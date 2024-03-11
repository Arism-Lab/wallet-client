import { BN, EC, F, H } from '@common'
import { lagrangeInterpolation } from '@libs/arithmetic'
import { TA } from '@types'
import { setRecoveryKey, getRecoveryKey } from '@helpers/metadata'
import { deriveDeviceFactor } from '@helpers/deviceFactor'

export const deriveRecoveryFactor = async (
    user: string,
    password: string
): Promise<TA.Factor> => {
    const recoveryFactorX = BN.from(H.keccak256(password).slice(2), 16).umod(EC.ORDER)
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
    const deviceFactor: TA.Factor = deriveDeviceFactor(user) as TA.Factor
    const privateFactor: TA.Factor = {
        x: deviceFactor.x,
        y: deviceFactor.y,
    }

    const recoveryFactorX = BN.from(H.keccak256(password).slice(2), 16).umod(EC.ORDER)


    const recoveryKey: BN = lagrangeInterpolation(
        [networkFactor, privateFactor],
        recoveryFactorX
    )

    const recoveryFactor: TA.Factor = {
        x: recoveryFactorX,
        y: recoveryKey,
    }

    await setRecoveryKey({
        user,
        recoveryKey: recoveryKey.toString(16),
    })

    return { privateFactor, recoveryFactor }
}
