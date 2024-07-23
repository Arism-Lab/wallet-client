import { C, F } from '@common'
import * as clientMetadata from '@endpoints/metadata'
import { lagrangeInterpolation } from '@libs/arithmetic'
import * as serverMetadata from '@services/metadata'

export const deriveDeviceFactor = (factors: Point[]): Point => {
    const deviceKey: string = lagrangeInterpolation(factors, F.DEVICE_INDEX)
    const deviceFactor: Point = { x: F.DEVICE_INDEX, y: deviceKey }
    return deviceFactor
}

export const constructDeviceFactor = (factors: Point[]): { privateFactor: Point; deviceFactor: Point } => {
    const privateKey: string = lagrangeInterpolation(factors, F.PRIVATE_INDEX)
    const deviceKey: string = lagrangeInterpolation(factors, F.DEVICE_INDEX)
    const privateFactor: Point = { x: F.PRIVATE_INDEX, y: privateKey }
    const deviceFactor: Point = { x: F.DEVICE_INDEX, y: deviceKey }
    return { privateFactor, deviceFactor }
}

export const verifyDevice = async (
    user: string,
    devicePublicKey: string,
    fromClient: boolean = true
): Promise<boolean> => {
    const req = fromClient ? clientMetadata.findDevices(user) : serverMetadata.findDevices(user)
    const devices: Device[] = await req.then((data) => data).catch(() => [])
    return devices.some(({ publicKey }) => publicKey === devicePublicKey)
}

export const getDevice = async (user: string, fromClient: boolean = true): Promise<Device[]> => {
    const req = fromClient ? clientMetadata.findDevices(user) : serverMetadata.findDevices(user)
    return await req.then((data) => data).catch(() => [])
}

export const storeNewDevice = async (
    userSession: SessionUser,
    deviceKey: string,
    lastLogin: string,
    fromClient: boolean = true
): Promise<boolean> => {
    const device: Device = {
        agent: window?.navigator.userAgent,
        name: 'Authorized Device',
        lastLogin,
        publicKey: C.getPublicKeyFromPrivateKey(deviceKey),
    }
    const req = fromClient
        ? clientMetadata.addDevice(userSession.info.email, device)
        : serverMetadata.addDevice(userSession.info.email, device, userSession.jwt.id_token)
    return await req.then(() => true).catch(() => false)
}

export const storeNewLogin = async (
    userSession: SessionUser,
    deviceKey: string,
    lastLogin: string,
    fromClient: boolean = true
): Promise<boolean> => {
    const devicePublicKey: string = C.getPublicKeyFromPrivateKey(deviceKey)
    const req1 = fromClient
        ? clientMetadata.findDevices(userSession.info.email)
        : serverMetadata.findDevices(userSession.info.email)
    const device: Device | undefined = await req1
        .then((data) => data.find(({ publicKey }) => publicKey === devicePublicKey))
        .catch(() => undefined)
    if (!device) {
        return false
    }
    const modifiedDevice: Device = { ...device, lastLogin }
    const req2 = fromClient
        ? clientMetadata.editDevice(userSession.info.email, modifiedDevice)
        : serverMetadata.editDevice(userSession.info.email, modifiedDevice, userSession.jwt.id_token)
    return await req2.then(() => true).catch(() => false)
}

export const editDeviceName = async (
    userSession: SessionUser,
    name: string,
    device: Device,
    fromClient: boolean = true
): Promise<boolean> => {
    const newDevice: Device = { ...device, name }
    const req = fromClient
        ? clientMetadata.editDevice(userSession.info.email, newDevice)
        : serverMetadata.editDevice(userSession.info.email, newDevice, userSession.jwt.id_token)
    return await req.then(() => true).catch(() => false)
}

export const deleteDevice = async (
    userSession: SessionUser,
    device: Device,
    fromClient: boolean = true
): Promise<boolean> => {
    const req = fromClient
        ? clientMetadata.removeDevice(userSession.info.email, device)
        : serverMetadata.removeDevice(userSession.info.email, device, userSession.jwt.id_token)
    return await req.then(() => true).catch(() => false)
}
