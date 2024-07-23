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
type ExtractedAgent = {
    browser: Agent
    os: Agent
}
type Device = {
    agent: string
    name: string
    lastLogin: string
    publicKey: string
}
type ExtractDevice = ExtractedAgent & Device
type LocalUser = {
    info: Info
    deviceFactor: Point
    lastLogin: string
}
type PrivateIndex = {
    name: string
    address: string
    index: string
}
type PublicWallet = PrivateIndex & {
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
