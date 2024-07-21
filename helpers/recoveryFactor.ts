import { H } from '@common'
import { getRecoveryKey, setRecoveryKey } from '@helpers/metadata'
import { lagrangeInterpolation } from '@libs/arithmetic'

export const deriveRecoveryFactor = async (user: string, password: string): Promise<Point> => {
    const recoveryIndex: string = H.keccak256(password).slice(2)
    const recoveryKey: string = await getRecoveryKey(user)
    const recoveryFactor: Point = { x: recoveryIndex, y: recoveryKey }

    return recoveryFactor
}

export const constructRecoveryFactor = async (
    session: SessionUser,
    password: string
): Promise<Point> => {
    const recoveryIndex: string = H.keccak256(password).slice(2)
    const recoveryKey: string = lagrangeInterpolation(
        [session.factor1!, session.factor2!],
        recoveryIndex
    )
    const recoveryFactor: Point = { x: recoveryIndex, y: recoveryKey }

    await setRecoveryKey(session.info.email, recoveryKey)

    return recoveryFactor
}
