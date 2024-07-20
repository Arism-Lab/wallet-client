type DeriveNetworkFactorRequest = {
    idToken: string
    user: string
}
type DeriveNetworkFactorResponse = Point | undefined

type DeriveDeviceFactorRequest = {
    user: string
}
type DeriveDeviceFactorResponse = Point | undefined

type ConstructDeviceFactorRequest = {
    networkFactor: Point
}
type ConstructDeviceFactorResponse = {
    privateFactor: Point
    deviceFactor: Point
}
type ConstructDeviceFactorNewDeviceRequest = {
    user: string
    networkFactor: Point
    recoveryFactor: Point
}
type ConstructDeviceFactorNewDeviceResponse = {
    privateFactor: Point
    deviceFactor: Point
}

type ConstructRecoveryFactorRequest = {
    user: string
    networkFactor: Point
    password: string
}
type ConstructRecoveryFactorResponse = {
    privateFactor: Point
    recoveryFactor: Point
}
