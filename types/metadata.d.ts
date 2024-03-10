import { TA } from '@types'

export type AddDeviceRequest = {
    user: string
    device: TA.Device
}

export type AddRecoveryKeyRequest = {
    user: string
    recoveryKey: string
}
