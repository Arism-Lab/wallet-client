import { BN, F } from '@common'
import { lagrangeInterpolation } from '@libs/arithmetic'
import { TA } from '@types'
import { getAddress } from '@helpers/wallet'
import { getAddressFromPrivateKey } from '@common/secp256k1'

export const constructPrivateFactor = (
    factor1: TA.Factor,
    factor2: TA.Factor
): TA.Factor => {
    const privateKey = lagrangeInterpolation(
        [factor1, factor2],
        F.PRIVATE_FACTOR_X
    )
    const privateFactor: TA.Factor = {
        x: F.PRIVATE_FACTOR_X,
        y: privateKey,
    }

    return privateFactor
}

export const verifyPrivateKey = async (
    user: string,
    privateKey: BN
): Promise<boolean> => {
    const computedAddress: string = getAddressFromPrivateKey(privateKey)
    const expectedAddress: string = (await getAddress({ user })) as string
    return computedAddress === expectedAddress
}
