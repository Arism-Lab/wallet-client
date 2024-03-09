export type Error = {
    statusCode: string
    message: string
}

export type Response<T> = {
    data?: T
    error?: Error
}

export type GetAddressRequest = {
    owner: string
}

export type GetAddressResponse = {
    owner: string
    publicKey: string
    address: string
}

export type ConstructPrivateKeyRequest = {
    owner: string
    idToken: string
}

export type ConstructPrivateKeyResponse = {
    address: string
    privateKey: string
}
