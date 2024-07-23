type ExchangeCommitmentRequest = {
    clientCommitment: string
    clientPublicKey: string
}
type ExchangeCommitmentResponse = {
    publicKey: string
}

type DerivePublicKeyRequest = {
    user: string
}
type DerivePublicKeyResponse = {
    publicKey: string
}
type InitializeSecretRequest = DerivePublicKeyRequest
type InitializeSecretResponse = DerivePublicKeyResponse
type IssueShareRequest = {
    user: string
    share: string
}
type IssueShareResponse = void
type DeriveMasterShareRequest = {
    idToken: string
    clientPublicKey: string
    nodeCommitment: string
    user: string
}
type DeriveMasterShareResponse = Ecies
type ConstructMasterShareRequest = DeriveMasterShareRequest
type ConstructMasterShareResponse = DeriveMasterShareResponse
