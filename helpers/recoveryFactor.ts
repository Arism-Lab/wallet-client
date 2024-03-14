import { BN, EC, H } from '@common'
import { getRecoveryKey, setRecoveryKey } from '@helpers/metadata'
import { lagrangeInterpolation } from '@libs/arithmetic'
import { TA } from '@types'

export const deriveRecoveryFactor = async (
    user: string,
    password: string
): Promise<TA.Factor> => {
    const recoveryFactorX = BN.from(H.keccak256(password).slice(2), 16)
    const recoveryFactorKey = await getRecoveryKey(user)

    return {
        x: recoveryFactorX,
        y: BN.from(recoveryFactorKey, 16),
    }
}

export const constructRecoveryFactor = async (
    session: TA.SessionUser,
    password: string
): Promise<TA.Factor> => {
    const recoveryFactorX = BN.from(H.keccak256(password).slice(2), 16)

    const recoveryKey: BN = lagrangeInterpolation(
        [session.factor1, session.factor2],
        recoveryFactorX
    )

    const recoveryFactor: TA.Factor = {
        x: recoveryFactorX,
        y: recoveryKey,
    }

    await setRecoveryKey({
        user: session.info.email,
        recoveryKey: recoveryKey.toString(16),
    })

    return recoveryFactor
}
