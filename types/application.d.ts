import { BN } from '@common'
import { User } from 'next-auth'

/**************************************
 *
 * LIBRARY TYPES
 **************************************/
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
export type MetadataStorage = {
    user: User
    deviceFactor: Factor
    address: string
    lastLogin: string
}
export type Device = {
    id: string
    info: string
}
export type Wallet = {
    address: string
    publicKey: string
    privateKey: string
}

/***************************************
 *
 * FACTORS' REQUEST AMD RESPONSE TYPES
 ***************************************/
export type DeriveNetworkFactorRequest = {
    idToken: string
    user: string
}
export type DeriveNetworkFactorResponse = Factor | undefined

export type DeriveDeviceFactorRequest = {
    user: string
}
export type DeriveDeviceFactorResponse = Factor | undefined

export type ConstructDeviceFactorRequest = {
    networkFactor: Factor
}
export type ConstructDeviceFactorResponse = {
    privateFactor: Factor
    deviceFactor: Factor
}
export type ConstructDeviceFactorNewDeviceRequest = {
    user: string
    networkFactor: Factor
    recoveryFactor: Factor
}
export type ConstructDeviceFactorNewDeviceResponse = {
    privateFactor: Factor
    deviceFactor: Factor
}

export type ConstructRecoveryFactorRequest = {
    user: string
    networkFactor: Factor
    password: string
}
export type ConstructRecoveryFactorResponse = {
    privateFactor: Factor
    recoveryFactor: Factor
}

/***************************************
 *
 * OTHERS' REQUEST AMD RESPONSE TYPES
 ***************************************/
export type AddNewDeviceRequest = {
    user: User
    networkFactor: Factor
    recoveryFactor: Factor
}

/***************************************
 *
 * UI TYPES
 ***************************************/

export type Step = {
    name: string
    description: string
}
export type Value = {
    node: Node
    value: string
}
export type NetworkFactorStep1 = {
    step: Step
    node: Value[]
}
export type NetworkFactorStep2 = {
    step: Step
    node: Value[]
}
export type NetworkFactorStep3 = {
    step: Step
    node: Value[]
}
export type NetworkFactorStep4 = {
    step: Step
    node: string
}
