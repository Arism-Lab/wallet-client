import { C, E, F, H, N } from '@common'
import { fetcher } from '@libs/api'
import { kCombinations, lagrangeInterpolation, thresholdSame } from '@libs/arithmetic'
import { AppDispatch } from '@store'
import * as networkFactorActions from '@store/networkFactor/actions'

export const deriveNetworkFactor = async (
    idToken: string,
    user: string,
    isSignUp: boolean,
    dispatch: AppDispatch,
    actions: typeof networkFactorActions
): Promise<Point | undefined> => {
    const nodes: ArismNode[] = await getNodes(dispatch, actions)

    const publicKeys: { id: number; value: string }[] = isSignUp
        ? await initializeSecrets(nodes, user, dispatch, actions)
        : await derivePublicKey(nodes, user, dispatch, actions)

    const [clientPrivateKey, clientPublicKey] = E.generateKeyPair()
    const clientCommitment: string = H.keccak256(idToken)

    const commitments: { id: number; value: CommitmentResponse }[] = await exchangeCommitments(
        nodes,
        clientPublicKey,
        clientCommitment,
        dispatch,
        actions
    )

    const encryptedMasterShares: { id: number; value: Ecies }[] = await constructMasterShares(
        nodes,
        user,
        idToken,
        clientPublicKey,
        commitments,
        dispatch,
        actions
    )

    const networkKey: string = await constructNetworkKey(
        encryptedMasterShares,
        clientPrivateKey,
        publicKeys.map((key) => key.value),
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

const getNodes = async (dispatch: AppDispatch, actions: typeof networkFactorActions): Promise<ArismNode[]> => {
    const nodes: ArismNode[] = []

    await Promise.all(
        N.NODES.map(async (node) => {
            await ping(node.url).then(async (alive) => {
                if (alive) {
                    nodes.push(node)
                    await dispatch(actions.emitStep1({ id: node.id, value: node.url }))
                }
            })
        })
    )

    if (N.NODES.length < N.DERIVATION_THRESHOLD) {
        throw new Error('Not enough Nodes')
    }

    return nodes
}

const initializeSecrets = async (
    nodes: ArismNode[],
    user: string,
    dispatch: AppDispatch,
    actions: typeof networkFactorActions
): Promise<{ id: number; value: string }[]> => {
    const publicKeys: { id: number; value: string }[] = []

    for (const { id, url } of nodes) {
        const value = await fetcher<string>('POST', `${url}/secret/initialize-secret`, { user })
        publicKeys.push({ id, value })
        await dispatch(actions.emitStep2({ id, value }))
    }

    if (publicKeys.length < N.GENERATION_THRESHOLD) {
        throw new Error('Not enough Public Keys')
    }

    return publicKeys
}

const derivePublicKey = async (
    nodes: ArismNode[],
    user: string,
    dispatch: AppDispatch,
    actions: typeof networkFactorActions
): Promise<{ id: number; value: string }[]> => {
    const publicKeys: { id: number; value: string }[] = []

    for (const { id, url } of nodes) {
        const value = await fetcher<string>('GET', `${url}/secret/derive-public-key`, { user })
        publicKeys.push({ id, value })
        await dispatch(actions.emitStep2({ id, value }))
    }

    if (publicKeys.length < N.GENERATION_THRESHOLD) {
        throw new Error('Not enough Public Keys')
    }

    return publicKeys
}

const exchangeCommitments = async (
    nodes: ArismNode[],
    clientPublicKey: string,
    clientCommitment: string,
    dispatch: AppDispatch,
    actions: typeof networkFactorActions
): Promise<{ id: number; value: CommitmentResponse }[]> => {
    const commitments: { id: number; value: CommitmentResponse }[] = []

    await Promise.allSettled(
        nodes.map(({ id, url }) =>
            fetcher<CommitmentResponse>('POST', `${url}/commitment`, { clientCommitment, clientPublicKey }).then(
                async (value) => {
                    commitments.push({ id, value })
                    await dispatch(actions.emitStep3({ id, value: value.publicKey }))
                }
            )
        )
    )

    if (commitments.length < N.GENERATION_THRESHOLD) {
        throw new Error('Not enough Commitments')
    }

    return commitments
}

const constructMasterShares = async (
    nodes: ArismNode[],
    user: string,
    idToken: string,
    clientPublicKey: string,
    commitments: { id: number; value: CommitmentResponse }[],
    dispatch: AppDispatch,
    actions: typeof networkFactorActions
): Promise<{ id: number; value: Ecies }[]> => {
    const encryptedMasterShares: { id: number; value: Ecies }[] = []

    const commitmentMap: Record<number, CommitmentResponse> = Object.fromEntries(
        commitments.map(({ id, value }) => [id, value])
    )
    await Promise.allSettled(
        nodes.map(({ id, url }) =>
            fetcher<Ecies>('POST', `${url}/secret/construct-master-share`, {
                commitment: commitmentMap[id],
                user,
                idToken,
                clientPublicKey,
            }).then(async (value) => {
                encryptedMasterShares.push({ id, value })
                await dispatch(actions.emitStep4({ id, value: value.ciphertext }))
            })
        )
    )

    if (encryptedMasterShares.length < N.DERIVATION_THRESHOLD) {
        throw new Error('Not enough Master Shares')
    }

    return encryptedMasterShares
}

const constructNetworkKey = async (
    encryptedMasterShares: { id: number; value: Ecies }[],
    clientPrivateKey: string,
    publicKeys: string[],
    dispatch: AppDispatch,
    actions: typeof networkFactorActions
): Promise<string> => {
    const decryptedMasterShares: string[] = []

    for (const { value } of encryptedMasterShares) {
        const decryptedMasterShare: string = await E.decrypt(clientPrivateKey, value)
        decryptedMasterShares.push(decryptedMasterShare)
    }

    const masterShares: Point[] = decryptedMasterShares.reduce((acc, curr, index) => {
        if (curr)
            acc.push({
                x: encryptedMasterShares[index].id.toString(16),
                y: curr,
            })
        return acc
    }, [] as Point[])

    let decodedNetworkPublicKey: Point = C.decodePublicKey(publicKeys[0])
    for (let i = 1; i < publicKeys.length; i += 1) {
        decodedNetworkPublicKey = C.ellipticAddition(decodedNetworkPublicKey, C.decodePublicKey(publicKeys[i]))
    }

    const networkPublicKey: string = C.encodePublicKey(decodedNetworkPublicKey)
    const combinations: number[][] = kCombinations(decryptedMasterShares.length, N.DERIVATION_THRESHOLD)

    let networkKey: string | undefined
    for (const combination of combinations) {
        const derivedPrivateKey: string = lagrangeInterpolation(
            masterShares.filter((_, index) => combination.includes(index)),
            '0'
        )
        const derivedPublicKey = C.getPublicKeyFromPrivateKey(derivedPrivateKey)

        if (networkPublicKey === derivedPublicKey) {
            networkKey = derivedPrivateKey
            break
        }
    }

    if (!networkKey) {
        throw new Error('Could not construct Network Key')
    }

    await dispatch(actions.emitStep5(networkKey))

    return networkKey
}
