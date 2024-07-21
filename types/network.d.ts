type CommitmentRequest = {
    commitment: string
    timestamp: string
    clientPublicKey: string
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
    clientPublicKey?: string
}

type SecretResponse = {
    publicKey: string
    ecies: Ecies
}
