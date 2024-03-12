import { BN, EC, F } from '@common'
import { lagrangeInterpolation } from '@libs/arithmetic'
import { TA } from '@types'
import { deriveLocals } from '@libs/storage'
import { getDeviceInfo } from '@libs/device'
import { addDevice, getDevices } from '@helpers/metadata'

export const verifyDevice = async (
    user: string,
    lastLogin?: string
): Promise<{ device: TA.Device; verified: boolean }> => {
    const device: TA.Device = getDeviceInfo(lastLogin)
    const devices: TA.Device[] = await getDevices(user)
    const verified: boolean = devices.some((e) => e.id === device.id)

    return { device, verified }
}

export const postDevice = async (
    user: string,
    lastLogin: string
): Promise<void> => {
    const { device, verified }: { device: TA.Device; verified: boolean } =
        await verifyDevice(user, lastLogin)

    if (!verified) {
        await addDevice({ device, user })
    }
}

export const deriveDeviceFactor = (user: string): TA.Factor | undefined => {
    const local: TA.UserLocal | undefined = deriveLocals()?.find(
        (e) => e.user.email === user
    )

    return local?.deviceFactor
}

export const constructDeviceFactor = async (
    networkFactor: TA.Factor
): Promise<{ privateFactor: TA.Factor; deviceFactor: TA.Factor }> => {
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
