import { BN, EC, F, H } from '@common'
import { lagrangeInterpolation } from '@libs/arithmetic'
import { TA } from '@types'
import { addRecoveryKey, getRecoveryKey } from '@helpers/metadata'

export const deriveRecoveryFactor = async (
    user: string,
    password: string
): Promise<TA.Factor> => {
    const recoveryFactorX = BN.from(H.keccak256(password))
    const recoveryFactorKey = await getRecoveryKey(user)

    return {
        x: recoveryFactorX,
        y: BN.from(recoveryFactorKey, 'hex'),
    }
}

export const constructRecoveryFactor = async ({
    user,
    networkFactor,
    password,
}: TA.ConstructRecoveryFactorRequest): Promise<TA.ConstructRecoveryFactorResponse> => {
    const privateKey: BN = BN.from(EC.generatePrivateKey())
    const privateFactor: TA.Factor = {
        x: F.PRIVATE_FACTOR_X,
        y: privateKey,
    }

    const recoveryFactorX = BN.from(H.keccak256(password))
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
        recoveryKey: recoveryKey.toString('hex'),
    })

    return { privateFactor, recoveryFactor }
}
