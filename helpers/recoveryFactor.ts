import { BN, EC, F, H } from '@common'
import { lagrangeInterpolation } from '@libs/arithmetic'
import { TA } from '@types'
import { addRecoveryKey, getRecoveryKey } from '@helpers/metadata'

export const deriveRecoveryFactor = async (
    user: string,
    password: string
): Promise<TA.Factor> => {
    const recoveryFactorX = BN.from(H.keccak256(password), 16)
    const recoveryFactorKey = await getRecoveryKey(user)

    return {
        x: recoveryFactorX,
        y: BN.from(recoveryFactorKey, 16),
    }
}

export const constructRecoveryFactor = async ({
    user,
    networkFactor,
    password,
}: TA.ConstructRecoveryFactorRequest): Promise<TA.ConstructRecoveryFactorResponse> => {
    const privateKey: BN = BN.from(EC.generatePrivateKey(), 16)
    const privateFactor: TA.Factor = {
        x: F.PRIVATE_FACTOR_X,
        y: privateKey,
    }

    const recoveryFactorX = BN.from(H.keccak256(password), 16)
    const recoveryKey: BN = lagrangeInterpolation(
        [networkFactor, privateFactor],
        recoveryFactorX
    )

    const recoveryFactor: TA.Factor = {
        x: recoveryFactorX,
        y: recoveryKey,
    }

    await addRecoveryKey({
        user,
        recoveryKey: recoveryKey.toString(16),
    })

    return { privateFactor, recoveryFactor }
}
