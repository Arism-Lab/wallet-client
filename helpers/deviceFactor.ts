import { v4 as uuidv4 } from 'uuid'
import { BN, EC, F } from '@common'
import { lagrangeInterpolation } from '@libs/arithmetic'
import { TA } from '@types'
import { deriveMetadatas } from '@libs/storage'
import { getDeviceInfo } from '@libs/device'
import { addDevice, getDevices } from '@helpers/metadata'
import { verifyPrivateKey } from '@helpers/privateFactor'

export const deriveDeviceFactor = (user: string): TA.Factor | undefined => {
    const deviceFactors: TA.MetadataStorage[] = deriveMetadatas()
    const deviceFactor: TA.MetadataStorage | undefined = deviceFactors.find(
        (e) => e.user.email === user
    )

    if (deviceFactor) {
        return {
            x: BN.from(deviceFactor.deviceFactor.x, 16),
            y: BN.from(deviceFactor.deviceFactor.y, 16),
        }
    }
}

export const constructDeviceFactor = async ({
    user,
    networkFactor,
}: TA.ConstructDeviceFactorRequest): Promise<TA.ConstructDeviceFactorResponse> => {
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

    await storeDevice(user)

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

    await storeDevice(user)

    return { privateFactor, deviceFactor }
}

export const storeDevice = async (user: string) => {
    const device: TA.Device = {
        id: uuidv4(),
        info: getDeviceInfo(),
    }

    const devices: TA.Device[] = await getDevices(user)

    if (devices.find((e) => e.info === device.info)) return

    await addDevice({ device, user })
}
