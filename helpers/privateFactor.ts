import { C, F } from '@common'
import * as clientMetadata from '@endpoints/metadata'
import { lagrangeInterpolation } from '@libs/arithmetic'
import { deriveThresholdFactors } from '@libs/session'
import * as serverMetadata from '@services/metadata'

export const derivePrivateFactor = (factors: Point[], privateIndex: string = F.PRIVATE_INDEX): Point => {
    const privateKey = lagrangeInterpolation(factors, privateIndex)
    const privateFactor: Point = { x: privateIndex, y: privateKey }
    return privateFactor
}

export const derivePrivateFactors = (userSession: SessionUser, privateIndices: PrivateIndex[]): Point[] => {
    const factors: Point[] = deriveThresholdFactors(userSession)
    return privateIndices.map(({ index }) => derivePrivateFactor(factors, index))
}

export const getPrivateIndices = async (user: string, fromClient: boolean = true): Promise<PrivateIndex[]> => {
    const req = fromClient ? clientMetadata.findPrivateIndices(user) : serverMetadata.findPrivateIndices(user)
    return await req.then((data) => data).catch(() => [])
}

export const createNewWallet = async (
    userSession: SessionUser,
    name: string,
    fromClient: boolean = true
): Promise<Wallet | null> => {
    const factors: Point[] = deriveThresholdFactors(userSession)
    const index: string = C.generatePrivateKey()
    const privateFactor: Point = derivePrivateFactor(factors, index)
    const address: string = C.getAddressFromPrivateKey(privateFactor.y)
    const publicKey: string = C.getPublicKeyFromPrivateKey(privateFactor.y)
    const privateIndex: PrivateIndex = { name, address, index }
    const wallet: Wallet = { ...privateIndex, privateKey: privateFactor.y, publicKey }
    const req = fromClient
        ? clientMetadata.addPrivateIndex(userSession.info.email, privateIndex)
        : serverMetadata.addPrivateIndex(userSession.info.email, privateIndex, userSession.jwt.id_token)
    return await req.then(() => wallet).catch(() => null)
}

export const editWalletName = async (
    userSession: SessionUser,
    name: string,
    privateIndex: PrivateIndex,
    fromClient: boolean = true
): Promise<boolean> => {
    const newPrivateIndex: PrivateIndex = { ...privateIndex, name }
    const req = fromClient
        ? clientMetadata.editPrivateIndex(userSession.info.email, newPrivateIndex)
        : serverMetadata.editPrivateIndex(userSession.info.email, newPrivateIndex, userSession.jwt.id_token)
    return await req.then(() => true).catch(() => false)
}

export const deleteWallet = async (
    userSession: SessionUser,
    privateIndex: PrivateIndex,
    fromClient: boolean = true
): Promise<boolean> => {
    const req = fromClient
        ? clientMetadata.removePrivateIndex(userSession.info.email, privateIndex)
        : serverMetadata.removePrivateIndex(userSession.info.email, privateIndex, userSession.jwt.id_token)
    return await req.then(() => true).catch(() => false)
}
