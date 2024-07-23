import { F } from '@common'
import { lagrangeInterpolation } from '@libs/arithmetic'

export const constructDeviceFactor = async (privateFactor: Point, networkFactor: Point): Promise<Point> => {
    const deviceKey: string = lagrangeInterpolation([networkFactor, privateFactor], F.DEVICE_INDEX)
    const deviceFactor: Point = { x: F.DEVICE_INDEX, y: deviceKey }

    return deviceFactor
}

export const constructDeviceFactorNewDevice = async (
    networkFactor: Point,
    recoveryFactor: Point
): Promise<{ privateFactor: Point; deviceFactor: Point }> => {
    const deviceKey: string = lagrangeInterpolation([networkFactor, recoveryFactor], F.DEVICE_INDEX)
    const deviceFactor: Point = { x: F.DEVICE_INDEX, y: deviceKey }

    const privateKey: string = lagrangeInterpolation([networkFactor, recoveryFactor], F.PRIVATE_INDEX)
    const privateFactor: Point = { x: F.PRIVATE_INDEX, y: privateKey }

    return { privateFactor, deviceFactor }
}
