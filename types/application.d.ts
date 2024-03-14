import { BN } from '@common'

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
export type Detection = {
    name: string
    version: string | undefined
}
export type Device = {
    id: string
    lastLogin: string | undefined
    browser: Detection | undefined
    os: Detection | undefined
}
export type Info = {
    email: string
    name: string
    image: string
}
export type LocalUser = {
    info: Info
    deviceFactor: Factor
    lastLogin: string
}
export type SessionUser = {
    factor1: Factor
    factor2: Factor
    factor3?: Factor | undefined
    info: Info
}
export type Key = {
    address: string
    privateFactorX: string
}
export type FullKey = {
    address: string
    publicKey: string
    privateKey: string
}
export type Metadata = {
    user: string
    masterAddress: string
    devices: Device[]
    recoveryKey: string
    keys: Key[]
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
 * LOGIN HOOK TYPES
 ***************************************/
export type LoginMethod =
    | 'signInOauth'
    | 'signInPassword'
    | 'signInOauthAndPassword'
    | 'signUp'
    | 'lost'
export type Instruction = {
    name: string
    description: string
}
export type NodeState = {
    node: number
    value: string
}
export type Step = {
    instruction: Instruction
    state: NodeState[] | string[] | string | undefined
    privateKeyInput?: boolean
    passwordInput?: boolean
}
export type SignInOauthSteps = {
    networkFactorStep1: Step
    networkFactorStep2: Step
    networkFactorStep3: Step
    networkFactorStep4: Step
    networkFactorStep5: Step
    deviceFactorStep1: Step
    privateFactorStep1: Step
    verifyStep: Step
}
export type SignInOauthAndPasswordSteps = {
    networkFactorStep1: Step
    networkFactorStep2: Step
    networkFactorStep3: Step
    networkFactorStep4: Step
    networkFactorStep5: Step
    recoveryFactorStep1: Step
    recoveryFactorStep2: Step
    verifyStep: Step
}
export type SignInPasswordSteps = {
    recoveryFactorStep1: Step
    recoveryFactorStep2: Step
    verifyStep: Step
}
export type SignUpSteps = {
    networkFactorStep1: Step
    networkFactorStep2: Step
    networkFactorStep3: Step
    networkFactorStep4: Step
    networkFactorStep5: Step
    privateFactorStep1: Step
    deviceFactorStep1: Step
    verifyStep: Step
}
export type LoginState =
    | SignInOauthSteps
    | SignInOauthAndPasswordSteps
    | SignInPasswordSteps
    | SignUpSteps
export type LoginReducer = {
    data: LoginState
    error: any
    loading: boolean
}
