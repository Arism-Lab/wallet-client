import DeviceDetector, { DeviceDetectorResult } from 'device-detector-js'

export const extractAgent = (id: string): ExtractedAgent => {
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

    return { browser, os }
}
