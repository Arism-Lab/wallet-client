'use client'

import { C } from '@common'
import {
    addDevice,
    addPrivateIndex,
    getRecoveryKey,
    getUser,
} from '@helpers/metadata'
import { constructPrivateFactor } from '@helpers/privateFactor'
import { getDeviceInfo } from '@libs/device'
import { storeLocalUser } from '@libs/local'

export const checkExistence = async (user: string): Promise<boolean> => {
    return await getUser(user).then((data) => data !== undefined)
}
export const checkMfa = async (user: string): Promise<boolean> => {
    return await getRecoveryKey(user).then((data) => data != '0')
}

export const storeUser = async (localUser: LocalUser) => {
    const device: Device = getDeviceInfo(localUser.lastLogin)
    await addDevice(localUser.info.email, device)
    storeLocalUser(localUser)
}

export const createNewKey = async (session: SessionUser): Promise<boolean> => {
    const index: string = C.generatePrivateKey()
    const privateFactor = constructPrivateFactor(
        session.factor1!,
        session.factor2!,
        index
    )
    const address = C.getAddressFromPrivateKey(privateFactor.y)

    return await addPrivateIndex(session.info.email, { address, index })
        .then((data) => data !== undefined)
        .catch(() => false)
}
