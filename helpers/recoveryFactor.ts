import { H } from '@common'
import * as clientMetadata from '@endpoints/metadata'
import { lagrangeInterpolation } from '@libs/arithmetic'
import { deriveThresholdFactors } from '@libs/session'
import * as serverMetadata from '@services/metadata'

export const deriveRecoveryFactor = async (
    user: string,
    password: string,
    fromClient: boolean = true
): Promise<Point | null> => {
    const req = fromClient ? clientMetadata.find(user) : serverMetadata.find(user)
    const metadata: Metadata | undefined = await req.then((data) => data).catch(() => undefined)
    if (!metadata) {
        return null
    }
    const recoveryIndex: string = H.keccak256(password).slice(2)
    const recoveryKey: string = metadata.recoveryKey
    const recoveryFactor: Point = { x: recoveryIndex, y: recoveryKey }
    return recoveryFactor
}

export const enableMfa = async (
    session: SessionUser,
    password: string,
    fromClient: boolean = true
): Promise<boolean> => {
    const recoveryIndex: string = H.keccak256(password).slice(2)
    const factors: Point[] = deriveThresholdFactors(session)
    const recoveryKey: string = lagrangeInterpolation(factors, recoveryIndex)
    const req = fromClient
        ? clientMetadata.setRecoveryKey(session.info.email, recoveryKey)
        : serverMetadata.setRecoveryKey(session.info.email, recoveryKey, session.jwt.id_token)
    return await req.then(() => true).catch(() => false)
}

export const checkMfa = async (user: string, fromClient: boolean = true): Promise<boolean> => {
    const req = fromClient ? clientMetadata.findRecoveryKey(user) : serverMetadata.findRecoveryKey(user)
    return await req.then((data) => data !== '0').catch(() => false)
}
