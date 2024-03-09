import { BN, F } from '@common'
import { lagrangeInterpolation } from '@libs/arithmetic'
import { TA } from '@types'
import { storeDeviceFactor } from '@libs/storage'
import { generatePrivateKey } from '@common/secp256k1'

export const constructDeviceFactor = ({
    networkFactor,
}: TA.ConstructDeviceFactorRequest): TA.ConstructDeviceFactorResponse => {
    const privateKey: BN = BN.from(generatePrivateKey())

    const privateFactor: TA.Factor = {
        x: BN.ZERO,
        y: privateKey,
    }

    const deviceKey: BN = lagrangeInterpolation(
        [networkFactor, privateFactor],
        F.DEVICE_FACTOR_X_VALUE
    )

    const deviceFactor: TA.Factor = {
        x: F.DEVICE_FACTOR_X_VALUE,
        y: deviceKey,
    }

    return { privateFactor, deviceFactor }
}

export const addNewDevice = ({
    owner,
    networkFactor,
    recoveryFactor,
}: TA.AddNewDeviceRequest): TA.AddNewDeviceResponse => {
    const deviceKey: BN = lagrangeInterpolation(
        [networkFactor, recoveryFactor],
        F.DEVICE_FACTOR_X_VALUE
    )

    const deviceFactor: TA.Factor = {
        x: F.DEVICE_FACTOR_X_VALUE,
        y: deviceKey,
    }

    storeDeviceFactor({ deviceFactor, owner })

    // TODO: POST new device to metadata service
    // const device: TA.Device = {
    //     id: uuidv4(),
    //     info: getDeviceInfo(),
    // }
    // postNewDevice({ device, owner })

    return deviceFactor
}
