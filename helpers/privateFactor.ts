import { C, F } from '@common'
import { getPrivateIndices } from '@helpers/metadata'
import { lagrangeInterpolation } from '@libs/arithmetic'

export const constructPrivateFactor = (
    factor1: Point,
    factor2: Point,
    privateIndex: string = F.PRIVATE_INDEX
): Point => {
    const privateKey = lagrangeInterpolation([factor1, factor2], privateIndex)
    const privateFactor: Point = { x: privateIndex, y: privateKey }

    return privateFactor
}

export const verifyPrivateKey = async (
    user: string,
    privateKey: string
): Promise<boolean> => {
    const computedAddress: string = C.getAddressFromPrivateKey(privateKey)
    const keys: Key[] = await getPrivateIndices(user)

    return keys.some((key) => key.address === computedAddress)
}

export const derivePrivateFactors = async (
    session: SessionUser
): Promise<Point[]> => {
    const keys: Key[] = await getPrivateIndices(session.info.email)

    return keys.map((key) =>
        constructPrivateFactor(
            session.factor1,
            session.factor2,
            key.privateIndex
        )
    )
}
