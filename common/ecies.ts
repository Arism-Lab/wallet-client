import * as Ecies from 'eciesjs'

// TODO: removed HMAC in ECIES vulnerabilities

export const decrypt = (privateKey: string, ciphertext: string): string => {
    const data = Uint8Array.from(Buffer.from(ciphertext, 'hex'))
    return Ecies.decrypt(privateKey, data).toString('hex')
}

export const encrypt = (toPublicKey: string, plaintext: string): string => {
    const data = Uint8Array.from(Buffer.from(plaintext, 'hex'))
    return Ecies.encrypt(toPublicKey, data).toString('hex')
}

export const generatePrivateKey = (): string => {
    const privateKey: Ecies.PrivateKey = new Ecies.PrivateKey()
    return privateKey.toHex()
}

export const getPublicKey = (privateKey: string): string => {
    const publicKey: Ecies.PublicKey = Ecies.PublicKey.fromHex(privateKey)
    return publicKey.toHex()
}

export const generateKeyPair = (): [string, string] => {
    const privateKey: Ecies.PrivateKey = new Ecies.PrivateKey()
    const publicKey: Ecies.PublicKey = privateKey.publicKey

    return [privateKey.toHex(), publicKey.toHex()]
}
