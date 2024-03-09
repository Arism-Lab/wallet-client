import { TA } from '@types'

export const storeDeviceFactor = ({
    deviceFactor,
    owner,
}: TA.DeviceFactorStorage) => {
    const deviceFactors = deriveDeviceFactors()

    const exeisted = deviceFactors.find((item) => item.owner === owner)
    if (exeisted) return

    const updatedDeviceFactors = JSON.stringify([
        ...deviceFactors,
        { deviceFactor, owner },
    ])
    window.localStorage.setItem('share-device', updatedDeviceFactors)
}

export const deriveDeviceFactors = (): TA.DeviceFactorStorage[] => {
    const deviceFactors = window.localStorage.getItem('device-factors')
    return JSON.parse(deviceFactors || '[]')
}
