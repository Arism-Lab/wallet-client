'use server'

import { verify } from '@libs/api'
import { connectDB } from '@libs/mongodb'
import MetadataModel, { IMetadata } from '@schemas/metadata'

export const find = async (user: string): Promise<Metadata> => {
    await connectDB()

    const metadata: IMetadata | null = await MetadataModel.findOne({ user })
    if (!metadata) {
        throw new Error('User not found')
    }

    return metadata.toObject()
}
export const initialize = async (userMetadata: Metadata, authorization: string): Promise<void> => {
    const verified = await verify(authorization, userMetadata.user)
    if (!verified) {
        throw new Error('Unauthorized')
    }

    await connectDB()

    const metadata: IMetadata | null = await MetadataModel.findOne({ user: userMetadata.user })
    if (metadata) {
        throw new Error('User already exists')
    }

    await MetadataModel.create(userMetadata)
}

export const findDevices = async (user: string): Promise<Device[]> => {
    await connectDB()

    const devices: Device[] | null = await MetadataModel.findOne({ user })
        .then((res) => res.devices)
        .catch(() => null)
    if (!devices) {
        throw new Error('User not found')
    }

    return devices
}
export const addDevice = async (user: string, device: Device, authorization: string): Promise<void> => {
    const verified = await verify(authorization, user)
    if (!verified) {
        throw new Error('Unauthorized')
    }

    await connectDB()

    const devices: Device[] | null = await MetadataModel.findOne({ user })
        .then((res) => res.devices)
        .catch(() => null)
    if (!devices) {
        throw new Error('User not found')
    }
    const index = devices.findIndex((d) => d.publicKey === device.publicKey)

    if (index !== -1) {
        devices[index] = device
    } else {
        devices.push(device)
    }

    await MetadataModel.findOneAndUpdate({ user }, { devices })
}
export const editDevice = async (user: string, device: Device, authorization: string): Promise<void> => {
    const verified = await verify(authorization, user)
    if (!verified) {
        throw new Error('Unauthorized')
    }

    await connectDB()

    const devices: Device[] | null = await MetadataModel.findOne({ user })
        .then((res) => res.devices)
        .catch(() => null)
    if (!devices) {
        throw new Error('User not found')
    }
    const index = devices.findIndex((d) => d.publicKey === device.publicKey)

    if (index === -1) {
        throw new Error('Device not found')
    }
    devices[index] = device

    await MetadataModel.findOneAndUpdate({ user }, { devices })
}
export const removeDevice = async (user: string, device: Device, authorization: string): Promise<void> => {
    const verified = await verify(authorization, user)
    if (!verified) {
        throw new Error('Unauthorized')
    }

    await connectDB()

    const devices: Device[] | null = await MetadataModel.findOne({ user })
        .then((res) => res.devices)
        .catch(() => null)
    if (!devices) {
        throw new Error('User not found')
    }
    const index = devices.findIndex((d) => d.publicKey === device.publicKey)

    if (index === -1) {
        throw new Error('Device not found')
    }
    devices.splice(index, 1)

    await MetadataModel.findOneAndUpdate({ user }, { devices })
}

export const findPrivateIndices = async (user: string): Promise<PrivateIndex[]> => {
    await connectDB()

    const privateIndices: PrivateIndex[] | null = await MetadataModel.findOne({ user })
        .then((res) => res.privateIndices)
        .catch(() => null)
    if (!privateIndices) {
        throw new Error('User not found')
    }

    return privateIndices
}
export const addPrivateIndex = async (
    user: string,
    privateIndex: PrivateIndex,
    authorization: string
): Promise<void> => {
    const verified = await verify(authorization, user)
    if (!verified) {
        throw new Error('Unauthorized')
    }

    await connectDB()

    const privateIndices: PrivateIndex[] = await MetadataModel.findOne({ user })
        .then((res) => res.privateIndices)
        .catch(() => null)
    privateIndices.push(privateIndex)

    await MetadataModel.findOneAndUpdate({ user }, { privateIndices })
}
export const editPrivateIndex = async (
    user: string,
    privateIndex: PrivateIndex,
    authorization: string
): Promise<void> => {
    const verified = await verify(authorization, user)
    if (!verified) {
        throw new Error('Unauthorized')
    }

    await connectDB()

    const privateIndices: PrivateIndex[] = await MetadataModel.findOne({ user })
        .then((res) => res.privateIndices)
        .catch(() => null)
    const index = privateIndices.findIndex((p) => p.index === privateIndex.index)

    if (index === -1) {
        throw new Error('Private index not found')
    }
    if (index === 0) {
        throw new Error('Cannot edit master wallet')
    }
    privateIndices[index] = privateIndex

    await MetadataModel.findOneAndUpdate({ user }, { privateIndices })
}
export const removePrivateIndex = async (
    user: string,
    privateIndex: PrivateIndex,
    authorization: string
): Promise<void> => {
    const verified = await verify(authorization, user)
    if (!verified) {
        throw new Error('Unauthorized')
    }

    await connectDB()

    const privateIndices: PrivateIndex[] = await MetadataModel.findOne({ user })
        .then((res) => res.privateIndices)
        .catch(() => null)
    const index = privateIndices.findIndex((p) => p.index === privateIndex.index)

    if (index === -1) {
        throw new Error('Private index not found')
    }
    if (index === 0) {
        throw new Error('Cannot remove master wallet')
    }
    privateIndices.splice(index, 1)

    await MetadataModel.findOneAndUpdate({ user }, { privateIndices })
}

export const findRecoveryKey = async (user: string): Promise<string> => {
    await connectDB()

    const recoveryKey: string | null = await MetadataModel.findOne({ user })
        .then((res) => res.recoveryKey)
        .catch(() => null)
    if (!recoveryKey) {
        throw new Error('User not found')
    }

    return recoveryKey
}
export const setRecoveryKey = async (user: string, recoveryKey: string, authorization: string): Promise<void> => {
    const verified = await verify(authorization, user)
    if (!verified) {
        throw new Error('Unauthorized')
    }

    await connectDB()

    await MetadataModel.findOneAndUpdate({ user }, { recoveryKey })
}
