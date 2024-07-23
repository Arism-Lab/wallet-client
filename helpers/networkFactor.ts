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

    const derivedPublicKeyRequest: DerivePublicKeyRequest = { user }
    const publicKeys: { id: number; response: DerivePublicKeyResponse }[] = isSignUp
        ? await initializeSecrets(nodes, derivedPublicKeyRequest, dispatch, actions)
        : await derivePublicKey(nodes, derivedPublicKeyRequest, dispatch, actions)

    const [clientPrivateKey, clientPublicKey] = E.generateKeyPair()
    const clientCommitment: string = H.keccak256(idToken)

    const exchangeCommitmentRequest: ExchangeCommitmentRequest = { clientCommitment, clientPublicKey }
    const nodeCommitments: { id: number; response: ExchangeCommitmentResponse }[] = await exchangeCommitments(
        nodes,
        exchangeCommitmentRequest,
        dispatch,
        actions
    )

    const nodeCommitmentMap: Record<number, string> = Object.fromEntries(
        nodeCommitments.map(({ id, response }) => [id, response.publicKey])
    )
    const constructMasterSharesRequests: Record<number, ConstructMasterShareRequest> = Object.fromEntries(
        nodes.map(({ id }) => [id, { idToken, clientPublicKey, nodeCommitment: nodeCommitmentMap[id], user }])
    )
    const encryptedMasterShares: { id: number; response: ConstructMasterShareResponse }[] = isSignUp
        ? await constructMasterShares(nodes, constructMasterSharesRequests, dispatch, actions)
        : await deriveMasterShares(nodes, constructMasterSharesRequests, dispatch, actions)

    const networkKey: string = await constructNetworkKey(
        encryptedMasterShares,
        clientPrivateKey,
        publicKeys.map((key) => key.response.publicKey),
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
            await ping(node.url).then((alive) => {
                if (alive) {
                    nodes.push(node)
                    dispatch(actions.emitStep1({ id: node.id, value: node.url }))
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
    request: InitializeSecretRequest,
    dispatch: AppDispatch,
    actions: typeof networkFactorActions
): Promise<{ id: number; response: DerivePublicKeyResponse }[]> => {
    const publicKeys: { id: number; response: DerivePublicKeyResponse }[] = []

    for (const { id, url } of nodes) {
        const response = await fetcher<DerivePublicKeyResponse>('POST', `${url}/secret/initialize-secret`, request)
        publicKeys.push({ id, response })
        dispatch(actions.emitStep2({ id, value: response.publicKey }))
    }

    if (publicKeys.length < N.GENERATION_THRESHOLD) {
        throw new Error('Not enough Public Keys')
    }

    return publicKeys
}

const derivePublicKey = async (
    nodes: ArismNode[],
    request: DerivePublicKeyRequest,
    dispatch: AppDispatch,
    actions: typeof networkFactorActions
): Promise<{ id: number; response: DerivePublicKeyResponse }[]> => {
    const publicKeys: { id: number; response: DerivePublicKeyResponse }[] = []

    await Promise.allSettled(
        nodes.map(({ id, url }) =>
            fetcher<DerivePublicKeyResponse>('GET', `${url}/secret/derive-public-key`, request).then((response) => {
                publicKeys.push({ id, response })
                dispatch(actions.emitStep2({ id, value: response.publicKey }))
            })
        )
    )

    if (publicKeys.length < N.DERIVATION_THRESHOLD) {
        throw new Error('Not enough Public Keys')
    }

    return publicKeys
}

const exchangeCommitments = async (
    nodes: ArismNode[],
    request: ExchangeCommitmentRequest,
    dispatch: AppDispatch,
    actions: typeof networkFactorActions
): Promise<{ id: number; response: ExchangeCommitmentResponse }[]> => {
    const commitments: { id: number; response: ExchangeCommitmentResponse }[] = []

    await Promise.allSettled(
        nodes.map(({ id, url }) =>
            fetcher<ExchangeCommitmentResponse>('POST', `${url}/commitment`, request).then((response) => {
                commitments.push({ id, response })
                dispatch(actions.emitStep3({ id, value: response.publicKey }))
            })
        )
    )

    if (commitments.length < N.DERIVATION_THRESHOLD) {
        throw new Error('Not enough Commitments')
    }

    return commitments
}

const constructMasterShares = async (
    nodes: ArismNode[],
    requests: Record<number, ConstructMasterShareRequest>,
    dispatch: AppDispatch,
    actions: typeof networkFactorActions
): Promise<{ id: number; response: ConstructMasterShareResponse }[]> => {
    const encryptedMasterShares: { id: number; response: ConstructMasterShareResponse }[] = []

    await Promise.allSettled(
        nodes.map(({ id, url }) =>
            fetcher<ConstructMasterShareResponse>('POST', `${url}/secret/construct-master-share`, requests[id]).then(
                (response) => {
                    encryptedMasterShares.push({ id, response })
                    dispatch(actions.emitStep4({ id, value: response.ciphertext }))
                }
            )
        )
    )

    if (encryptedMasterShares.length < N.GENERATION_THRESHOLD) {
        throw new Error('Not enough Master Shares')
    }

    return encryptedMasterShares
}

const deriveMasterShares = async (
    nodes: ArismNode[],
    requests: Record<number, DeriveMasterShareRequest>,
    dispatch: AppDispatch,
    actions: typeof networkFactorActions
): Promise<{ id: number; response: DeriveMasterShareResponse }[]> => {
    const encryptedMasterShares: { id: number; response: DeriveMasterShareResponse }[] = []

    await Promise.allSettled(
        nodes.map(({ id, url }) =>
            fetcher<DeriveMasterShareResponse>('POST', `${url}/secret/derive-master-share`, requests[id]).then(
                (response) => {
                    encryptedMasterShares.push({ id, response })
                    dispatch(actions.emitStep4({ id, value: response.ciphertext }))
                }
            )
        )
    )

    if (encryptedMasterShares.length < N.DERIVATION_THRESHOLD) {
        throw new Error('Not enough Master Shares')
    }

    return encryptedMasterShares
}

const constructNetworkKey = async (
    encryptedMasterShares: { id: number; response: ConstructMasterShareResponse }[],
    clientPrivateKey: string,
    publicKeys: string[],
    dispatch: AppDispatch,
    actions: typeof networkFactorActions
): Promise<string> => {
    const decryptedMasterShares: string[] = []

    for (const { response } of encryptedMasterShares) {
        const decryptedMasterShare: string = await E.decrypt(clientPrivateKey, response)
        decryptedMasterShares.push(decryptedMasterShare)
    }

    const masterShares: Point[] = decryptedMasterShares.reduce((acc, curr, index) => {
        if (curr) {
            acc.push({ x: encryptedMasterShares[index].id.toString(16), y: curr })
        }
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

    dispatch(actions.emitStep5(networkKey))

    return networkKey
}
