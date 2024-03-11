import { storeMetadata, storeUser } from '@libs/storage'
import { TA } from '@types'
import { Account, User } from 'next-auth'
import { Dispatch, SetStateAction } from 'react'
import { deriveNetworkFactor } from '@helpers/networkFactor'
import {
    constructDeviceFactor,
    constructDeviceFactorNewDevice,
    deriveDeviceFactor,
    postDevice,
} from '@helpers/deviceFactor'
import { BN, EC, F } from '@common'
import {
    constructPrivateFactor,
    verifyPrivateKey,
} from '@helpers/privateFactor'
import {
    addKey,
    getRecoveryKey,
    getUser,
    initializeUser,
} from '@helpers/metadata'
import { deriveRecoveryFactor } from '@helpers/recoveryFactor'

export const checkExistence = async (user: string): Promise<boolean> => {
    return await getUser(user).then((data) => data !== undefined)
}
export const checkMfa = async (user: string): Promise<boolean> => {
    return await getRecoveryKey(user).then((data) => data != '0')
}

export const createNewKey = async (
    user: string,
    factor1: TA.Factor,
    factor2: TA.Factor
): Promise<boolean> => {
    const privateFactorX: string = EC.generatePrivateKey()
    const privateFactor = constructPrivateFactor(
        factor1,
        factor2,
        BN.from(privateFactorX, 16)
    )
    const address = EC.getAddressFromPrivateKey(privateFactor.y)

    return await addKey({
        user,
        key: { address, privateFactorX },
    })
        .then((data) => data !== undefined)
        .catch(() => false)
}

// Use case: Sign up
export const signUp = async (
    user: User,
    token: Account,
    setStep: Dispatch<SetStateAction<number>>
): Promise<boolean> => {
    await initializeUser(user.email!)

    const networkFactor: TA.Factor | undefined = await deriveNetworkFactor(
        {
            idToken: token.id_token!,
            user: user.email!,
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
    await postDevice(user.email!, lastLogin)

    const address = EC.getAddressFromPrivateKey(privateFactor.y)
    const privateFactorX = F.PRIVATE_FACTOR_X.toString(16, 64)
    await addKey({
        user: user.email!,
        key: { address, privateFactorX },
    })

    storeUser({ networkFactor, user })
    storeMetadata({ deviceFactor, user, lastLogin })

    return true
}

// Use case: Log in on the original device with OAuth
export const signInWithOauth = async (
    user: User,
    token: Account,
    setStep: Dispatch<SetStateAction<number>>
): Promise<boolean> => {
    const networkFactor: TA.Factor | undefined = await deriveNetworkFactor(
        {
            idToken: token.id_token!,
            user: user.email!,
        },
        setStep
    )
    if (!networkFactor) return false

    const deviceFactor: TA.Factor | undefined = deriveDeviceFactor(user.email!)
    if (!deviceFactor) return false

    const privateFactor: TA.Factor = constructPrivateFactor(
        networkFactor,
        deviceFactor
    )

    const verified = await verifyPrivateKey(user.email!, privateFactor.y)
    if (verified) {
        const lastLogin = new Date().toISOString()

        storeUser({ networkFactor, user })
        storeMetadata({ deviceFactor, user, lastLogin })

        return true
    }

    return false
}

// Use case: Log in on the original device with password (MFA must be turned on)
export const signInWithPassword = async (
    user: User,
    password: string
): Promise<boolean> => {
    const recoveryFactor: TA.Factor = await deriveRecoveryFactor(
        user.email!,
        password
    )

    const deviceFactor: TA.Factor | undefined = deriveDeviceFactor(user.email!)
    if (!deviceFactor) return false

    const privateFactor: TA.Factor = constructPrivateFactor(
        recoveryFactor,
        deviceFactor
    )

    const verified = await verifyPrivateKey(user.email!, privateFactor.y)
    if (verified) {
        const lastLogin = new Date().toISOString()

        storeUser({ user })
        storeMetadata({ deviceFactor, user, lastLogin })

        return true
    }

    return false
}

// Use case: Log in on a new device with OAuth and password (MFA must be turned on)
export const signInWithOauthAndPassword = async (
    user: User,
    token: Account,
    password: string,
    setStep: Dispatch<SetStateAction<number>>
): Promise<boolean> => {
    const networkFactor: TA.Factor | undefined = await deriveNetworkFactor(
        {
            idToken: token.id_token!,
            user: user.email!,
        },
        setStep
    )
    if (!networkFactor) return false

    const recoveryFactor: TA.Factor = await deriveRecoveryFactor(
        user.email!,
        password
    )

    const {
        privateFactor,
        deviceFactor,
    }: { privateFactor: TA.Factor; deviceFactor: TA.Factor } =
        await constructDeviceFactorNewDevice(recoveryFactor, networkFactor)

    const verified = await verifyPrivateKey(user.email!, privateFactor.y)
    if (verified) {
        const lastLogin = new Date().toISOString()

        storeUser({ networkFactor, user })
        storeMetadata({ deviceFactor, user, lastLogin })

        return true
    }

    return false
}
