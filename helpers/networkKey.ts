import axios from 'axios'
import { Dispatch, SetStateAction } from 'react'
import {
    kCombinations,
    thresholdSame,
    lagrangeInterpolation,
} from '@libs/arithmetic'
import { BN, H, C, N } from '@common'
import type { TA, TL, TN } from '@types'

const NODES: TL.Node[] = [
    {
        id: 1,
        url: process.env.NEXT_PUBLIC_NODE1_URL!,
        // publicKey: '04bc38813a6873e526087918507c78fc3a61624670ee851ecfb4f3bef55d027b5aac4b21229f662a0aefdfdac21cf17c3261a392c74a8790db218b34e3e4c1d56a',
    },
    {
        id: 2,
        url: process.env.NEXT_PUBLIC_NODE2_URL!,
        // publicKey: '04b56541684ea5fa40c8337b7688d502f0e9e092098962ad344c34e94f06d293fb759a998cef79d389082f9a75061a29190eec0cac99b8c25ddcf6b58569dad55c',
    },
    {
        id: 3,
        url: process.env.NEXT_PUBLIC_NODE3_URL!,
        // publicKey: '044b5f33d7dd84ea0b7a1eb9cdefe33dbcc6822933cfa419c0112e9cbe33e84b267a7813bf1cbc2ee2c6fba506fa5de2af1601a093d93716a78ecec0e3e49f3a57',
    },
]

const ping = async (url: string) => {
    const response = await axios.get(url)
    return response?.data === 'pong!'
}

const fetchNodes = async (): Promise<TL.Node[]> => {
    const nodes: TL.Node[] = []

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
    input: TA.GetAddressRequest
): Promise<{
    data?: TA.GetAddressResponse
    error?: TA.Error
}> => {
    let errorApi: TA.Error | undefined

    const nodes = await fetchNodes()

    for (const { url } of nodes) {
        try {
            const { owner } = input
            const { data } = await axios.post<TA.GetAddressResponse>(
                `${url}/wallet`,
                { owner }
            )
            return { data, error: undefined }
        } catch (error: any) {
            const message = error.response?.data.message
            const statusCode = error.response?.data.statusCode
            errorApi = { message, statusCode }
        }
    }
    return { data: undefined, error: errorApi }
}

export const constructPrivateKey = async (
    { idToken, owner }: TA.ConstructPrivateKeyRequest,
    setStep: Dispatch<SetStateAction<number>>
): Promise<{
    data?: TA.ConstructPrivateKeyResponse
    error?: TA.Error
}> => {
    await getAddress({ owner })

    const tempPrivateKey = C.generatePrivateKey()
    const tempPublicKey = C.getPublicKey(tempPrivateKey).toString('hex')
    const tempCommitment = H.keccak256(idToken)

    const nodes = await fetchNodes()
    const commitments: TN.CommitmentResponse[] = []

    setStep(1)

    for (const { url } of nodes) {
        try {
            const { data: commitment } =
                await axios.post<TN.CommitmentResponse>(`${url}/commitment`, {
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
                message: 'Not enough Commitments',
            },
        }
    }

    setStep(2)

    const encryptedMasterShares: { value: TN.SecretResponse; id: number }[] = []

    for (const { url, id } of nodes) {
        try {
            const { data: value } = await axios.post<TN.SecretResponse>(
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

    const thresholdAddress = thresholdSame(
        encryptedMasterShares.map((e) => e.value.publicKey),
        N.DERIVATION_THRESHOLD
    )

    setStep(3)

    if (encryptedMasterShares.length < N.DERIVATION_THRESHOLD) {
        return {
            data: undefined,
            error: {
                statusCode: '400',
                message: 'Not enough Master Shares',
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
        [] as TL.Point[]
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

        const addressDecrypted = C.privateKeyToAddress(derivedPrivateKey)

        if (thresholdAddress === addressDecrypted) {
            privateKey = derivedPrivateKey
        }
    }

    if (!privateKey) {
        return {
            data: undefined,
            error: {
                message: 'could not derive private key',
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
