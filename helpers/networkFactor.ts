import axios from 'axios'

import { BN, C, EC, F, H, N } from '@common'
import {
    kCombinations,
    lagrangeInterpolation,
    thresholdSame,
} from '@libs/arithmetic'
import { AppDispatch } from '@store'
import type { TA, TN } from '@types'

const ping = async (url: string): Promise<boolean> => {
    return await axios
        .get(url)
        .then((res) => res.data === 'pong!')
        .catch(() => false)
}

export const getNodes = async (
    dispatch?: AppDispatch,
    actions?: any
): Promise<TA.Node[]> => {
    const nodes: TA.Node[] = []

    for (let i = 0; i < N.NODES.length; i += 1) {
        await ping(N.NODES[i].url).then((alive) => {
            if (alive) {
                nodes.push(N.NODES[i])
            }
        })

        if (dispatch)
            await dispatch(
                actions.emitNetWorkFactorStep1({
                    node: N.NODES[i].id,
                    value: N.NODES[i].url,
                })
            )
    }

    if (N.NODES.length < N.DERIVATION_THRESHOLD)
        throw new Error('Not enough Nodes')

    return nodes
}

export const deriveNetworkFactor = async (
    idToken: string,
    user: string,
    dispatch: AppDispatch,
    actions: any
): Promise<TA.Factor | undefined> => {
    const nodes: TA.Node[] = await getNodes(dispatch, actions)

    for (const { url } of nodes) {
        try {
            await axios.post<string>(`${url}/wallet`, { user })
        } catch {}
    }

    const tempPrivateKey = C.generatePrivateKey()
    const tempPublicKey = C.getPublicKey(tempPrivateKey).toString('hex')
    const tempCommitment = H.keccak256(idToken)

    const commitments: TN.CommitmentResponse[] = []

    for (const { id, url } of nodes) {
        try {
            const { data: commitment } =
                await axios.post<TN.CommitmentResponse>(`${url}/commitment`, {
                    commitment: tempCommitment,
                    tempPublicKey,
                })

            commitments.push(commitment)

            await dispatch(
                actions.emitNetWorkFactorStep2({
                    node: id,
                    value: commitment.publicKey,
                })
            )
        } catch {}
    }

    if (commitments.length < N.GENERATION_THRESHOLD) return

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

            await dispatch(
                actions.emitNetWorkFactorStep3({
                    node: id,
                    value: BN.from(value.ciphertext).toString(16),
                })
            )
        } catch {}
    }
    if (encryptedMasterShares.length < N.DERIVATION_THRESHOLD) return

    const thresholdPublicKey = thresholdSame(
        encryptedMasterShares.map((e) => e.value.publicKey),
        N.DERIVATION_THRESHOLD
    )

    const decryptedMasterShares: Buffer[] = []

    for (const {
        value: {
            metadata: { ephemPublicKey, iv, mac },
            ciphertext,
        },
    } of encryptedMasterShares) {
        const decryptedMasterShare: Buffer = await C.decrypt(tempPrivateKey, {
            ephemPublicKey: Buffer.from(ephemPublicKey, 'hex'),
            iv: Buffer.from(iv, 'hex'),
            mac: Buffer.from(mac, 'hex'),
            ciphertext: Buffer.from(ciphertext, 'hex'),
        })
        decryptedMasterShares.push(decryptedMasterShare)

        await dispatch(
            actions.emitNetWorkFactorStep4({
                node: encryptedMasterShares.find(
                    (e) => e.value.ciphertext === ciphertext
                )!.id,
                value: BN.from(decryptedMasterShare.toString(), 16).toString(
                    16
                ),
            })
        )
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

    let networkKey: BN | undefined = undefined
    const allCombis = kCombinations(masterShares.length, N.DERIVATION_THRESHOLD)

    for (const combi of allCombis) {
        const derivedPrivateKey = lagrangeInterpolation(
            masterShares.filter((_, index) => combi.includes(index)),
            BN.ZERO
        )

        const publicKey = EC.getPublicKeyFromPrivateKey(derivedPrivateKey)

        if (thresholdPublicKey === publicKey) {
            networkKey = derivedPrivateKey
        }
    }

    if (!networkKey) return

    await dispatch(actions.emitNetWorkFactorStep5(networkKey.toString(16)))

    return {
        x: F.NETWORK_FACTOR_X,
        y: networkKey,
    }
}
