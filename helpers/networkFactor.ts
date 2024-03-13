import axios from 'axios'
import { Dispatch, SetStateAction } from 'react'

import { BN, C, EC, F, H, N } from '@common'
import {
    kCombinations,
    lagrangeInterpolation,
    thresholdSame,
} from '@libs/arithmetic'
import type { TA, TN } from '@types'

const ping = async (url: string): Promise<boolean> => {
    return await axios
        .get(url)
        .then((res) => res.data === 'pong!')
        .catch(() => false)
}

export const getNodes = async (): Promise<TA.Node[]> => {
    const nodes: TA.Node[] = []

    for (let i = 0; i < N.NODES.length; i += 1) {
        await ping(N.NODES[i].url).then((alive) => {
            if (alive) {
                nodes.push(N.NODES[i])
            }
        })
    }

    if (N.NODES.length < N.DERIVATION_THRESHOLD)
        throw new Error('Not enough Nodes')

    return nodes
}

export const getAddress = async (user: string): Promise<string | undefined> => {
    const nodes = await getNodes()

    for (const { url } of nodes) {
        try {
            const { data } = await axios.post<string>(`${url}/wallet`, { user })
            return data
        } catch {}
    }
    return undefined
}

export const deriveNetworkFactor = async (
    { idToken, user }: TA.DeriveNetworkFactorRequest,
    setStep: Dispatch<SetStateAction<number>>
): Promise<TA.Factor | undefined> => {
    await getAddress(user)

    const tempPrivateKey = C.generatePrivateKey()
    const tempPublicKey = C.getPublicKey(tempPrivateKey).toString('hex')
    const tempCommitment = H.keccak256(idToken)

    const nodes = await getNodes()
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

    if (commitments.length < N.GENERATION_THRESHOLD) return

    setStep(2)

    const encryptedMasterShares: { value: TN.SecretResponse; id: number }[] = []

    for (const { url, id } of nodes) {
        try {
            const { data: value } = await axios.post<TN.SecretResponse>(
                `${url}/secret`,
                {
                    commitments,
                    user,
                    idToken,
                    tempPublicKey,
                }
            )
            encryptedMasterShares.push({ value, id })
        } catch {}
    }

    setStep(3)

    const thresholdPublicKey = thresholdSame(
        encryptedMasterShares.map((e) => e.value.publicKey),
        N.DERIVATION_THRESHOLD
    )

    if (encryptedMasterShares.length < N.DERIVATION_THRESHOLD) return

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

    const masterShares: TA.Point[] = decryptedMasterShares.reduce(
        (acc, curr, index) => {
            if (curr)
                acc.push({
                    x: BN.from(encryptedMasterShares[index].id, 16),
                    y: BN.from(curr.toString(), 16),
                })
            return acc
        },
        [] as TA.Point[]
    )

    setStep(4)

    let privateKey: BN | undefined = undefined
    const allCombis = kCombinations(masterShares.length, N.DERIVATION_THRESHOLD)

    for (const combi of allCombis) {
        const derivedPrivateKey = lagrangeInterpolation(
            masterShares.filter((_, index) => combi.includes(index)),
            BN.ZERO
        )

        const publicKey = EC.getPublicKeyFromPrivateKey(derivedPrivateKey)

        if (thresholdPublicKey === publicKey) {
            privateKey = derivedPrivateKey
        }
    }

    if (!privateKey) return

    setStep(5)

    return {
        x: F.NETWORK_FACTOR_X,
        y: privateKey,
    }
}
