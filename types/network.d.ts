type CommitmentRequest = {
    commitment: string
    timestamp: string
    tempPublicKey: string
    verifier: string
}

type CommitmentResponse = {
    signature: string
    publicKey: string
}

type SecretRequest = {
    commitments: CommitmentResponse[]
    user: string
    idToken: string
    tempPublicKey?: string
}

type SecretResponse = {
    ciphertext: string
    threshold: number
    publicKey: string
}
