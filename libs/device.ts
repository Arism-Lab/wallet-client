import DeviceDetector, { DeviceDetectorResult } from 'device-detector-js'
import { TA } from '@types'

export const getDeviceInfo = (lastLogin?: string): TA.Device => {
    const id = window?.navigator.userAgent || 'Unknown'

    const deviceDetector = new DeviceDetector()
    const device: DeviceDetectorResult = deviceDetector.parse(id)

    const browser: TA.Detection = {
        name: device?.client?.name || 'Unknown',
        version: device?.client?.version || 'Unknown',
    }

    const os: TA.Detection = {
        name: device?.os?.name || 'Unknown',
        version: device?.os?.version || 'Unknown',
    }

    return { id, lastLogin, browser, os }
}
