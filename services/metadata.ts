import { verify } from '@libs/api'
import { connectDB } from '@libs/mongodb'
import MetadataModel, { IMetadata } from '@schemas/metadata'

export const find = async (user: string): Promise<Metadata | null> => {
    await connectDB()

    const metadata: IMetadata | null = await MetadataModel.findOne({ user })
    return metadata?.toObject() ?? null
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

    const devices: Device[] = await MetadataModel.findOne({ user }).then((res) => res.devices)
    return devices
}

export const addDevice = async (user: string, device: Device, authorization: string): Promise<void> => {
    const verified = await verify(authorization, user)
    if (!verified) {
        throw new Error('Unauthorized')
    }

    await connectDB()

    const devices: Device[] = await MetadataModel.findOne({ user }).then((res) => res.devices)
    const index = devices.findIndex((d) => d.id === device.id)

    if (index !== -1) {
        devices[index] = device
    } else {
        devices.push(device)
    }

    await MetadataModel.findOneAndUpdate({ user }, { devices })
}

export const findPrivateIndices = async (user: string): Promise<PrivateIndex[]> => {
    await connectDB()

    const privateIndices: PrivateIndex[] = await MetadataModel.findOne({ user }).then((res) => res.privateIndices)
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

    const privateIndices: PrivateIndex[] = await MetadataModel.findOne({ user }).then((res) => res.privateIndices)
    privateIndices.push(privateIndex)

    await MetadataModel.findOneAndUpdate({ user }, { privateIndices })
}

export const findRecoveryKey = async (user: string): Promise<string> => {
    await connectDB()

    const recoveryKey: string = await MetadataModel.findOne({ user }).then((res) => res.recoveryKey)
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
