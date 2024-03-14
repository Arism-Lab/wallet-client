import { BN, F } from '@common'
import { lagrangeInterpolation } from '@libs/arithmetic'
import { TA } from '@types'

export const constructDeviceFactor = async (
    privateFactor: TA.Factor,
    networkFactor: TA.Factor
): Promise<TA.Factor> => {
    const deviceKey: BN = lagrangeInterpolation(
        [networkFactor, privateFactor],
        F.DEVICE_FACTOR_X
    )
    const deviceFactor: TA.Factor = {
        x: F.DEVICE_FACTOR_X,
        y: deviceKey,
    }

    return deviceFactor
}

export const constructDeviceFactorNewDevice = async (
    networkFactor: TA.Factor,
    recoveryFactor: TA.Factor
): Promise<{ privateFactor: TA.Factor; deviceFactor: TA.Factor }> => {
    const deviceKey: BN = lagrangeInterpolation(
        [networkFactor, recoveryFactor],
        F.DEVICE_FACTOR_X
    )
    const deviceFactor: TA.Factor = {
        x: F.DEVICE_FACTOR_X,
        y: deviceKey,
    }

    const privateKey: BN = lagrangeInterpolation(
        [networkFactor, recoveryFactor],
        F.PRIVATE_FACTOR_X
    )
    const privateFactor: TA.Factor = {
        x: F.PRIVATE_FACTOR_X,
        y: privateKey,
    }

    return { privateFactor, deviceFactor }
}
