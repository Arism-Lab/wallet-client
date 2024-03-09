import axios from 'axios'
import { Dispatch, SetStateAction } from 'react'
import type * as P2P from '@types/p2p'
import {
    kCombinations,
    thresholdSame,
    lagrangeInterpolation,
} from '@libs/arithmetic'
import { BN, H, C, N, T } from '@common'

const NODES: T.Node[] = [
    {
        id: 1,
        url: 'http://127.0.0.1:3001',
        publicKey: {
            X: 'bc38813a6873e526087918507c78fc3a61624670ee851ecfb4f3bef55d027b5a',
            Y: 'ac4b21229f662a0aefdfdac21cf17c3261a392c74a8790db218b34e3e4c1d56a',
        },
    },
    {
        id: 2,
        url: 'http://127.0.0.1:3002',
        publicKey: {
            X: 'b56541684ea5fa40c8337b7688d502f0e9e092098962ad344c34e94f06d293fb',
            Y: '759a998cef79d389082f9a75061a29190eec0cac99b8c25ddcf6b58569dad55c',
        },
    },
    {
        id: 3,
        url: 'http://127.0.0.1:3003',
        publicKey: {
            X: '4b5f33d7dd84ea0b7a1eb9cdefe33dbcc6822933cfa419c0112e9cbe33e84b26',
            Y: '7a7813bf1cbc2ee2c6fba506fa5de2af1601a093d93716a78ecec0e3e49f3a57',
        },
    },
]

const ping = async (url: string) => {
    const response = await axios.get(url)
    return response?.data === 'pong!'
}

const fetchNodes = async (): Promise<T.Node[]> => {
    const nodes: T.Node[] = []

    for (let i = 0; i < NODES.length; i += 1) {
        await ping(NODES[i].url).then((alive) => {
            if (alive) {
                nodes.push(NODES[i])
            }
        })
    }

    if (NODES.length < 2) throw new Error('Not enough Nodes')

    return nodes
}

export const getAddress = async (
    input: P2P.GetAddressRequest
): Promise<{
    data?: P2P.GetAddressResponse
    error?: P2P.ErrorApi
}> => {
    let errorApi: P2P.ErrorApi | undefined

    const nodes = await fetchNodes()

    for (const { url } of nodes) {
        try {
            const { owner } = input
            const { data } = await axios.post<P2P.GetAddressResponse>(
                `${url}/wallet`,
                { owner }
            )
            return { data, error: undefined }
        } catch (error: any) {
            const errorMessage = error.response?.data.message
            const statusCode = error.response?.data.statusCode
            errorApi = { errorMessage, statusCode }
        }
    }
    return { data: undefined, error: errorApi }
}

export const constructPrivateKey = async (
    { idToken, owner }: P2P.GetPrivateKeyRequest,
    setStep: Dispatch<SetStateAction<number>>
): Promise<{
    data?: P2P.GetPrivateKeyResponse
    error?: P2P.ErrorApi
}> => {
    await getAddress({ owner })

    const tempPrivateKey = C.generatePrivateKey()
    const tempPublicKey = C.getPublicKey(tempPrivateKey).toString('hex')
    const tempCommitment = H.keccak256(idToken)

    const nodes = await fetchNodes()
    const commitments: P2P.CommitmentResponse[] = []

    setStep(1)

    for (const { url } of nodes) {
        try {
            const { data: commitment } =
                await axios.post<P2P.CommitmentResponse>(`${url}/commitment`, {
                    commitment: tempCommitment,
                    tempPublicKey,
                })
            commitments.push(commitment)
        } catch {}
    }

    if (commitments.length < N.GENERATION_THRESHOLD) {
        return {
            data: undefined,
            error: {
                statusCode: '400',
                errorMessage: 'Not enough Commitments',
            },
        }
    }

    setStep(2)

    const encryptedMasterShares: { value: P2P.SecretResponse; id: number }[] =
        []

    for (const { url, id } of nodes) {
        try {
            const { data: value } = await axios.post<P2P.SecretResponse>(
                `${url}/secret`,
                {
                    commitments,
                    owner,
                    idToken,
                    tempPublicKey,
                }
            )
            encryptedMasterShares.push({ value, id })
        } catch {}
    }

    const thresholdPublicKey = thresholdSame(
        encryptedMasterShares.map((e) => e.value.publicKey),
        N.DERIVATION_THRESHOLD
    )

    setStep(3)

    if (encryptedMasterShares.length < N.DERIVATION_THRESHOLD) {
        return {
            data: undefined,
            error: {
                statusCode: '400',
                errorMessage: 'Not enough Master Shares',
            },
        }
    }

    const decryptedMasterShares: (undefined | Buffer)[] = []

    for (const {
        value: {
            metadata: { ephemPublicKey, iv, mac },
            ciphertext,
        },
    } of encryptedMasterShares) {
        const decryptedMasterShare = await C.decrypt(tempPrivateKey, {
            ephemPublicKey: Buffer.from(ephemPublicKey, 'hex'),
            iv: Buffer.from(iv, 'hex'),
            mac: Buffer.from(mac, 'hex'),
            ciphertext: Buffer.from(ciphertext, 'hex'),
        })
        decryptedMasterShares.push(decryptedMasterShare)
    }

    const masterShares: T.Point[] = decryptedMasterShares.reduce(
        (acc, curr, index) => {
            if (curr)
                acc.push({
                    x: BN.from(encryptedMasterShares[index].id),
                    y: BN.from(curr.toString(), 'hex'),
                })
            return acc
        },
        [] as T.Point[]
    )

    setStep(4)

    let privateKey: BN | undefined = undefined
    const allCombis = kCombinations(masterShares.length, N.DERIVATION_THRESHOLD)

    for (const combi of allCombis) {
        const derivedPrivateKey = lagrangeInterpolation(
            masterShares.filter((_, index) => combi.includes(index)),
            BN.ZERO
        )

        if (!derivedPrivateKey) {
            continue
        }

        const decryptedPublicKey = C.getPublicKey(
            Buffer.from(derivedPrivateKey.toString(16, 64), 'hex')
        ).toString('hex')

        if (thresholdPublicKey === decryptedPublicKey) {
            privateKey = derivedPrivateKey
        }
    }

    if (!privateKey) {
        return {
            data: undefined,
            error: {
                errorMessage: 'could not derive private key',
                statusCode: '400',
            },
        }
    }

    setStep(5)

    return {
        data: {
            address: C.privateKeyToAddress(privateKey),
            privateKey: privateKey.toString('hex', 64),
        },
        error: undefined,
    }
}
