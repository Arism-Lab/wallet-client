import { Account } from 'next-auth'
import { Dispatch, SetStateAction } from 'react'

import { BN, EC, F } from '@common'
import {
    constructDeviceFactor,
    constructDeviceFactorNewDevice,
    postDevice,
} from '@helpers/deviceFactor'
import {
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
import { store, useAppDispatch } from '@store'
import { storeLocalUser } from '@store/localUsers/actions'
import { storeSessionUser } from '@store/sessionUser/actions'
import { TA } from '@types'

export const checkExistence = async (user: string): Promise<boolean> => {
    return await getUser(user).then((data) => data !== undefined)
}
export const checkMfa = async (user: string): Promise<boolean> => {
    return await getRecoveryKey(user).then((data) => data != '0')
}

const storeUser = (localUser: TA.LocalUser, sessionUser: TA.SessionUser) => {
    const dispatch = store.dispatch

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

// Use case: Sign up
export const signUp = async (
    info: TA.Info,
    token: Account,
    setStep: Dispatch<SetStateAction<number>>
): Promise<boolean> => {
    await initializeUser(info.email)

    const networkFactor: TA.Factor | undefined = await deriveNetworkFactor(
        {
            idToken: token.id_token!,
            user: info.email,
        },
        setStep
    )
    if (!networkFactor) return false

    const {
        privateFactor,
        deviceFactor,
    }: { privateFactor: TA.Factor; deviceFactor: TA.Factor } =
        await constructDeviceFactor(networkFactor)

    const lastLogin = new Date().toISOString()
    await postDevice(info.email, lastLogin)

    const address = EC.getAddressFromPrivateKey(privateFactor.y)
    const privateFactorX = F.PRIVATE_FACTOR_X.toString(16, 64)
    await addKey({
        user: info.email,
        key: { address, privateFactorX },
    })

    storeUser(
        { deviceFactor, info, lastLogin },
        { factor1: networkFactor, factor2: deviceFactor, info }
    )

    return true
}

// Use case: Log in on the original device with OAuth
export const signInWithOauth = async (
    info: TA.Info,
    token: Account,
    deviceFactor: TA.Factor,
    setStep: Dispatch<SetStateAction<number>>
): Promise<boolean> => {
    const networkFactor: TA.Factor | undefined = await deriveNetworkFactor(
        {
            idToken: token.id_token!,
            user: info.email,
        },
        setStep
    )
    if (!networkFactor) return false

    const privateFactor: TA.Factor = constructPrivateFactor(
        networkFactor,
        deviceFactor
    )

    const verified = await verifyPrivateKey(info.email, privateFactor.y)
    if (verified) {
        const lastLogin = new Date().toISOString()

        storeUser(
            { deviceFactor, info, lastLogin },
            { factor1: networkFactor, factor2: deviceFactor, info }
        )

        return true
    }

    return false
}

// Use case: Log in on the original device with password (MFA must be turned on)
export const signInWithPassword = async (
    info: TA.Info,
    password: string,
    deviceFactor: TA.Factor
): Promise<boolean> => {
    const recoveryFactor: TA.Factor = await deriveRecoveryFactor(
        info.email,
        password
    )

    const privateFactor: TA.Factor = constructPrivateFactor(
        recoveryFactor,
        deviceFactor
    )

    const verified = await verifyPrivateKey(info.email, privateFactor.y)
    if (verified) {
        const lastLogin = new Date().toISOString()

        storeUser(
            { deviceFactor, info, lastLogin },
            { factor1: deviceFactor, factor2: recoveryFactor, info }
        )

        return true
    }

    return false
}

// Use case: Log in on a new device with OAuth and password (MFA must be turned on)
export const signInWithOauthAndPassword = async (
    info: TA.Info,
    token: Account,
    password: string,
    setStep: Dispatch<SetStateAction<number>>
): Promise<boolean> => {
    const networkFactor: TA.Factor | undefined = await deriveNetworkFactor(
        {
            idToken: token.id_token!,
            user: info.email,
        },
        setStep
    )
    if (!networkFactor) return false

    const recoveryFactor: TA.Factor = await deriveRecoveryFactor(
        info.email,
        password
    )

    const {
        privateFactor,
        deviceFactor,
    }: { privateFactor: TA.Factor; deviceFactor: TA.Factor } =
        await constructDeviceFactorNewDevice(recoveryFactor, networkFactor)

    const verified = await verifyPrivateKey(info.email, privateFactor.y)
    if (verified) {
        const lastLogin = new Date().toISOString()

        storeUser(
            { deviceFactor, info, lastLogin },
            {
                factor1: networkFactor,
                factor2: deviceFactor,
                factor3: recoveryFactor,
                info,
            }
        )

        return true
    }

    return false
}
