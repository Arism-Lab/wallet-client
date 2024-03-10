import * as Crypto from 'eccrypto'

export const decrypt = (
    privateKey: Buffer,
    opts: Crypto.Ecies
): Promise<Buffer> => {
    return Crypto.decrypt(privateKey, opts)
}

export const generatePrivateKey = (): Buffer => {
    return Crypto.generatePrivate()
}

export const getPublicKey = (privateKey: Buffer): Buffer => {
    return Crypto.getPublic(privateKey)
}
