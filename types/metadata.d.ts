import { TA } from '@types'

export type AddDeviceRequest = {
    user: string
    device: TA.Device
}
export type SetRecoveryKeyRequest = {
    user: string
    recoveryKey: string
}
export type AddKeyRequest = {
    user: string
    key: TA.Key
}
