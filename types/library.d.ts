type ArismNode = {
    id: number
    url: string
}
type Point = {
    x: string
    y: string
}
type Agent = {
    name: string
    version: string
}
type Device = {
    id: string
    lastLogin: string
    browser: Agent
    os: Agent
}
type LocalUser = {
    info: Info
    deviceFactor: Point
    lastLogin: string
}
type PrivateIndex = {
    address: string
    index: string
}
type PublicWallet = {
    user: string
    address: string
    publicKey: string
}
type Wallet = PublicWallet & {
    privateKey: string
}
type Metadata = {
    user: string
    masterAddress: string
    masterPublicKey: string
    devices: Device[]
    recoveryKey: string
    privateIndices: PrivateIndex[]
}
type Ecies = {
    iv: string
    ephemPublicKey: string
    ciphertext: string
    mac: string
}
