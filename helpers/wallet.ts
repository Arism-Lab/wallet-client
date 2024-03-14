import { Account } from 'next-auth'

import { BN, EC, F } from '@common'
import {
    constructDeviceFactor,
    constructDeviceFactorNewDevice,
} from '@helpers/deviceFactor'
import {
    addDevice,
    addKey,
    getRecoveryKey,
    getUser,
    initializeUser,
} from '@helpers/metadata'
import { deriveNetworkFactor } from '@helpers/networkFactor'
import {
    constructPrivateFactor,
    verifyPrivateKey,
} from '@helpers/privateFactor'
import { deriveRecoveryFactor } from '@helpers/recoveryFactor'
import { getDeviceInfo } from '@libs/device'
import { AppDispatch, store, useAppDispatch } from '@store'
import { storeLocalUser } from '@store/localUsers/actions'
import { storeSessionUser } from '@store/sessionUser/actions'
import * as actions from '@store/signInOauth/actions'
import { TA } from '@types'

export const checkExistence = async (user: string): Promise<boolean> => {
    return await getUser(user).then((data) => data !== undefined)
}
export const checkMfa = async (user: string): Promise<boolean> => {
    return await getRecoveryKey(user).then((data) => data != '0')
}

export const storeUser = async (
    localUser: TA.LocalUser,
    sessionUser: TA.SessionUser,
    dispatch: AppDispatch
) => {
    const device: TA.Device = getDeviceInfo(localUser.lastLogin)

    await addDevice({ device, user: sessionUser.info.email })

    dispatch(storeLocalUser(localUser))
    dispatch(storeSessionUser(sessionUser))
}

export const createNewKey = async (
    session: TA.SessionUser
): Promise<boolean> => {
    const privateFactorX: string = EC.generatePrivateKey()
    const privateFactor = constructPrivateFactor(
        session.factor1,
        session.factor2,
        BN.from(privateFactorX, 16)
    )
    const address = EC.getAddressFromPrivateKey(privateFactor.y)

    return await addKey({
        user: session.info.email,
        key: { address, privateFactorX },
    })
        .then((data) => data !== undefined)
        .catch(() => false)
}
