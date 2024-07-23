import DeviceDetector, { DeviceDetectorResult } from 'device-detector-js'

export const getDeviceInfo = (lastLogin: string): Device => {
    const id = window?.navigator.userAgent || 'Unknown'

    const deviceDetector = new DeviceDetector()
    const device: DeviceDetectorResult = deviceDetector.parse(id)

    const browser: Agent = {
        name: device?.client?.name || 'Unknown',
        version: device?.client?.version || 'Unknown',
    }

    const os: Agent = {
        name: device?.os?.name || 'Unknown',
        version: device?.os?.version || 'Unknown',
    }

    return { id, lastLogin, browser, os }
}
