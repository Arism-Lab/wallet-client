export type CommitmentRequest = {
    commitment: string
    timestamp: string
    tempPublicKey: string
    verifier: string
}

export type CommitmentResponse = {
    signature: string
    publicKey: string
}

export type SecretRequest = {
    commitments: CommitmentResponse[]
    owner: string
    idToken: string
    tempPublicKey?: string
}

export type SecretResponse = {
    ciphertext: string
    threshold: number
    publicKey: string
    metadata: {
        iv: string
        ephemPublicKey: string
        mac: string
    }
}
