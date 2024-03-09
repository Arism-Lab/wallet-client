import { BN } from '@common'

export type Node = {
    id: number
    url: string
}

export type Point = {
    x: BN
    y: BN
}

export type Factor = {
    x: BN
    y: BN
}

export type DeriveNetworkFactorRequest = {
    idToken: string
    owner: string
}

export type DeriveNetworkFactorResponse = Factor | undefined

export type GetAddressRequest = {
    owner: string
}

export type GetAddressResponse = {
    address: string
}

export type ConstructDeviceFactorRequest = {
    networkFactor: Factor
}

export type ConstructDeviceFactorResponse = {
    privateFactor: Factor
    deviceFactor: Factor
}

export type DeviceFactorStorage = {
    deviceFactor: Factor
    owner: string
}
export type Device = {
    id: string
    info: string
    deviceFactorX: BN
}
export type Metadata = {
    owner: string
    devices: Device[]
    recoveryFactorX: BN
}

export type AddNewDeviceRequest = {
    owner: string
    networkFactor: Factor
    recoveryFactor: Factor
}

export type AddNewDeviceResponse = Factor
