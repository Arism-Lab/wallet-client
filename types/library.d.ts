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
type Wallet = {
    address: string
    publicKey: string
    privateKey: string
}
type Metadata = {
    user: string
    devices: Device[]
    recoveryKey: string
    privateIndices: PrivateIndex[]
}
