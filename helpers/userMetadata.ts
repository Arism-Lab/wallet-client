import { C, F } from '@common'

import { clientMetadata, serverMetadata } from './metadata'

export const getUser = async (user: string, fromClient: boolean = true): Promise<Metadata | null> => {
    const req = fromClient ? clientMetadata.find(user) : serverMetadata.find(user)
    return await req.then((data) => data).catch(() => null)
}

export const createNewUser = async (
    user: string,
    privateKey: string,
    deviceKey: string,
    lastLogin: string,
    fromClient: boolean = true
): Promise<boolean> => {
    const device: Device = {
        agent: window?.navigator.userAgent,
        name: 'Original Device',
        lastLogin,
        publicKey: C.getPublicKeyFromPrivateKey(deviceKey),
    }
    const privateIndex: PrivateIndex = {
        name: 'Master Wallet',
        address: C.getAddressFromPrivateKey(privateKey),
        index: F.PRIVATE_INDEX,
    }
    const userMetadata: Metadata = {
        user,
        masterAddress: C.getAddressFromPrivateKey(privateKey),
        masterPublicKey: C.getPublicKeyFromPrivateKey(privateKey),
        devices: [device],
        privateIndices: [privateIndex],
        recoveryKey: '0',
    }
    const req = fromClient ? clientMetadata.initialize(userMetadata) : serverMetadata.initialize(userMetadata, user)
    return await req.then(() => true).catch(() => false)
}

export const verifyUser = async (
    user: string,
    masterPrivateKey: string,
    fromClient: boolean = true
): Promise<boolean> => {
    const req = fromClient ? clientMetadata.find(user) : serverMetadata.find(user)
    const metadata: Metadata | undefined = await req.then((data) => data).catch(() => undefined)
    if (!metadata) {
        return false
    }
    const masterPublicKey: string = C.getPublicKeyFromPrivateKey(masterPrivateKey)
    return metadata.masterPublicKey === masterPublicKey
}
