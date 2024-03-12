import { BN, EC, F } from '@common'
import { lagrangeInterpolation } from '@libs/arithmetic'
import { TA } from '@types'
import { getKeys } from '@helpers/metadata'

export const constructPrivateFactor = (
    factor1: TA.Factor,
    factor2: TA.Factor,
    privateFactorX: BN = F.PRIVATE_FACTOR_X
): TA.Factor => {
    const privateKey = lagrangeInterpolation([factor1, factor2], privateFactorX)
    const privateFactor: TA.Factor = {
        x: privateFactorX,
        y: privateKey,
    }

    return privateFactor
}

export const verifyPrivateKey = async (
    user: string,
    privateKey: BN
): Promise<boolean> => {
    const computedAddress: string = EC.getAddressFromPrivateKey(privateKey)

    const keys: TA.Key[] = await getKeys(user)

    return keys.some((key) => key.address === computedAddress)
}

export const derivePrivateFactors = async (
    session: TA.UserSession
): Promise<TA.Factor[]> => {
    const keys: TA.Key[] = await getKeys(session.user.email)

    return keys.map((key) =>
        constructPrivateFactor(
            session.factor1,
            session.factor2,
            BN.from(key.privateFactorX, 16)
        )
    )
}
