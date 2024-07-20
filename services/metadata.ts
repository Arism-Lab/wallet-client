import { verify } from '@libs/api'
import { connectDB } from '@libs/mongodb'
import Metadata, { IMetadata } from '@schemas/metadata'

export const find = async (user: string): Promise<Metadata | undefined> => {
    await connectDB()

    const metadata: IMetadata | null = await Metadata.findOne({ user }).exec()

    return metadata?.toObject()
}

export const initialize = async (
    user: string,
    authorization: string
): Promise<Metadata> => {
    const verified = await verify(authorization, user)
    if (!verified) {
        throw new Error('Unauthorized')
    }

    await connectDB()

    const metadata: IMetadata | null = await Metadata.findOne({ user })
    if (metadata) {
        return metadata.toObject()
    }

    const newMetadata: Metadata = {
        user,
        devices: [],
        privateIndices: [],
        recoveryKey: '0',
    }
    await Metadata.create(newMetadata)

    return newMetadata
}

export const findDevices = async (user: string): Promise<Device[]> => {
    await connectDB()

    const devices: Device[] = await Metadata.findOne({ user }).then(
        (res) => res.devices
    )

    return devices
}

export const addDevice = async (
    user: string,
    device: Device,
    authorization: string
): Promise<void> => {
    const verified = await verify(authorization, user)
    if (!verified) {
        throw new Error('Unauthorized')
    }

    await connectDB()

    const devices: Device[] = await Metadata.findOne({ user }).then(
        (res) => res.devices
    )
    const index = devices.findIndex((d) => d.id === device.id)

    if (index !== -1) {
        devices[index] = device
    } else {
        devices.push(device)
    }

    await Metadata.findOneAndUpdate({ user }, { devices })
}

export const findPrivateIndices = async (
    user: string
): Promise<PrivateIndex[]> => {
    await connectDB()

    const privateIndices: PrivateIndex[] = await Metadata.findOne({
        user,
    }).then((res) => res.privateIndices)

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

    const privateIndices: PrivateIndex[] = await Metadata.findOne({
        user,
    }).then((res) => res.privateIndices)

    privateIndices.push(privateIndex)

    await Metadata.findOneAndUpdate({ user }, { privateIndices })
}

export const findRecoveryKey = async (user: string): Promise<string> => {
    await connectDB()

    const recoveryKey: string = await Metadata.findOne({ user }).then(
        (res) => res.recoveryKey
    )

    return recoveryKey
}

export const setRecoveryKey = async (
    user: string,
    recoveryKey: string,
    authorization: string
): Promise<void> => {
    const verified = await verify(authorization, user)
    if (!verified) {
        throw new Error('Unauthorized')
    }

    await connectDB()

    await Metadata.findOneAndUpdate({ user }, { recoveryKey })
}
