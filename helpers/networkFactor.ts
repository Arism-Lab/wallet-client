import { BN, C, E, F, H, N } from '@common'
import { fetcher } from '@libs/api'
import {
    kCombinations,
    lagrangeInterpolation,
    thresholdSame,
} from '@libs/arithmetic'
import { AppDispatch } from '@store'
import * as networkFactorActions from '@store/networkFactor/actions'

export const deriveNetworkFactor = async (
    idToken: string,
    user: string,
    dispatch: AppDispatch,
    actions: typeof networkFactorActions
): Promise<Point | undefined> => {
    const nodes: ArismNode[] = await getNodes(user, dispatch, actions)

    const [tempPrivateKey, tempPublicKey] = E.generateKeyPair()
    const tempCommitment: string = H.keccak256(idToken)

    const commitments: CommitmentResponse[] = await getCommitments(
        nodes,
        tempCommitment,
        tempPublicKey,
        dispatch,
        actions
    )

    const encryptedMasterShares: { id: number; value: SecretResponse }[] =
        await getEncryptedMasterShares(
            nodes,
            user,
            idToken,
            tempPublicKey,
            commitments,
            dispatch,
            actions
        )

    const decryptedMasterShares: Point[] = await getDecryptedMasterShares(
        encryptedMasterShares,
        tempPrivateKey,
        dispatch,
        actions
    )

    const networkKey: string = await getNetworkKey(
        encryptedMasterShares,
        decryptedMasterShares,
        dispatch,
        actions
    )

    const networkFactor: Point = { x: F.NETWORK_INDEX, y: networkKey }

    return networkFactor
}

export const ping = async (url: string): Promise<boolean> => {
    const res = await fetcher<string>('GET', url)
        .then((res) => res === 'pong!')
        .catch(() => false)

    return res
}

const getNodes = async (
    user: string,
    dispatch: AppDispatch,
    actions: typeof networkFactorActions
): Promise<ArismNode[]> => {
    const nodes: ArismNode[] = []

    await Promise.all(
        N.NODES.map(async (node) => {
            await ping(node.url).then(async (alive) => {
                if (alive) {
                    nodes.push(node)

                    await dispatch(
                        actions.emitStep1({ node: node.id, value: node.url })
                    )
                }
            })
        })
    )

    if (N.NODES.length < N.DERIVATION_THRESHOLD) {
        throw new Error('Not enough Nodes')
    }

    // TODO: Check if this is necessary
    await Promise.allSettled(
        nodes.map(
            async ({ url }) => await fetcher('POST', `${url}/wallet`, { user })
        )
    )

    return nodes
}

const getCommitments = async (
    nodes: ArismNode[],
    tempCommitment: string,
    tempPublicKey: string,
    dispatch: AppDispatch,
    actions: typeof networkFactorActions
): Promise<CommitmentResponse[]> => {
    const commitments: CommitmentResponse[] = []

    await Promise.allSettled(
        nodes.map(async ({ id, url }) => {
            await fetcher<CommitmentResponse>('POST', `${url}/commitment`, {
                commitment: tempCommitment,
                tempPublicKey,
            }).then(async (commitment) => {
                commitments.push(commitment)

                await dispatch(
                    actions.emitStep2({ node: id, value: commitment.publicKey })
                )
            })
        })
    )

    if (commitments.length < N.GENERATION_THRESHOLD) {
        throw new Error('Not enough Commitments')
    }

    return commitments
}

const getEncryptedMasterShares = async (
    nodes: ArismNode[],
    user: string,
    idToken: string,
    tempPublicKey: string,
    commitments: CommitmentResponse[],
    dispatch: AppDispatch,
    actions: typeof networkFactorActions
): Promise<{ id: number; value: SecretResponse }[]> => {
    const encryptedMasterShares: { id: number; value: SecretResponse }[] = []

    await Promise.allSettled(
        nodes.map(async ({ url, id }) => {
            const value = await fetcher<SecretResponse>(
                'POST',
                `${url}/secret`,
                { commitments, user, idToken, tempPublicKey }
            )

            encryptedMasterShares.push({ value, id })

            await dispatch(
                actions.emitStep3({
                    node: id,
                    value: BN.from(value.ciphertext).toString(16),
                })
            )
        })
    )

    if (encryptedMasterShares.length < N.DERIVATION_THRESHOLD) {
        throw new Error('Not enough Master Shares')
    }

    return encryptedMasterShares
}

const getDecryptedMasterShares = async (
    encryptedMasterShares: { id: number; value: SecretResponse }[],
    tempPrivateKey: string,
    dispatch: AppDispatch,
    actions: typeof networkFactorActions
): Promise<Point[]> => {
    const decryptedMasterShares: string[] = []

    for (const { value } of encryptedMasterShares) {
        const decryptedMasterShare: string = E.decrypt(
            tempPrivateKey,
            value.ciphertext
        )
        decryptedMasterShares.push(decryptedMasterShare)

        await dispatch(
            actions.emitStep4({
                node: encryptedMasterShares.find(
                    (e) => e.value.ciphertext === value.ciphertext
                )!.id,
                value: decryptedMasterShare,
            })
        )
    }

    const masterShares: Point[] = decryptedMasterShares.reduce(
        (acc, curr, index) => {
            if (curr)
                acc.push({
                    x: encryptedMasterShares[index].id.toString(16),
                    y: curr,
                })
            return acc
        },
        [] as Point[]
    )

    return masterShares
}

const getNetworkKey = async (
    encryptedMasterShares: { id: number; value: SecretResponse }[],
    decryptedMasterShares: Point[],
    dispatch: AppDispatch,
    actions: typeof networkFactorActions
): Promise<string> => {
    let networkKey: string | undefined

    const allCombis = kCombinations(
        decryptedMasterShares.length,
        N.DERIVATION_THRESHOLD
    )

    const thresholdPublicKey = thresholdSame(
        encryptedMasterShares.map((e) => e.value.publicKey),
        N.DERIVATION_THRESHOLD
    )

    for (const combi of allCombis) {
        const derivedPrivateKey: string = lagrangeInterpolation(
            decryptedMasterShares.filter((_, index) => combi.includes(index)),
            '0'
        )

        const publicKey = C.getPublicKeyFromPrivateKey(derivedPrivateKey)

        if (thresholdPublicKey === publicKey) {
            networkKey = derivedPrivateKey
        }
    }

    if (!networkKey) {
        throw new Error('Could not construct Network Key')
    }

    await dispatch(actions.emitStep5(networkKey))

    return networkKey
}
