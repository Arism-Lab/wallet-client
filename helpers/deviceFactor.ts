import { v4 as uuidv4 } from 'uuid'
import { BN, EC, F } from '@common'
import { lagrangeInterpolation } from '@libs/arithmetic'
import { TA } from '@types'
import { deriveMetadatas, storeMetadata } from '@libs/storage'
import { getDeviceInfo } from '@libs/device'
import { addDevice } from '@helpers/metadata'
import { verifyPrivateKey } from '@helpers/privateFactor'

export const deriveDeviceFactor = ({
    user,
}: TA.DeriveDeviceFactorRequest): TA.DeriveDeviceFactorResponse => {
    const deviceFactors = deriveMetadatas()
    const deviceFactor = deviceFactors.find((df) => df.user.email === user)

    return deviceFactor?.deviceFactor
}

export const constructDeviceFactor = ({
    networkFactor,
}: TA.ConstructDeviceFactorRequest): TA.ConstructDeviceFactorResponse => {
    const privateKey: BN = BN.from(EC.generatePrivateKey())
    const privateFactor: TA.Factor = {
        x: F.PRIVATE_FACTOR_X,
        y: privateKey,
    }

    const deviceKey: BN = lagrangeInterpolation(
        [networkFactor, privateFactor],
        F.DEVICE_FACTOR_X
    )
    const deviceFactor: TA.Factor = {
        x: F.DEVICE_FACTOR_X,
        y: deviceKey,
    }

    return { privateFactor, deviceFactor }
}

export const constructDeviceFactorNewDevice = async ({
    user,
    networkFactor,
    recoveryFactor,
}: TA.ConstructDeviceFactorNewDeviceRequest): Promise<
    TA.ConstructDeviceFactorNewDeviceResponse | undefined
> => {
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

    const verified = await verifyPrivateKey(user, privateKey)
    if (!verified) return

    const device: TA.Device = {
        id: uuidv4(),
        info: getDeviceInfo(),
    }
    await addDevice({ device, user })

    return { privateFactor, deviceFactor }
}
