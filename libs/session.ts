import { N } from '@common'

export const deriveThresholdFactors = (sessionUser: SessionUser): Point[] => {
    const factors: Point[] = []

    for (const factorName of ['networkFactor', 'deviceFactor', 'recoveryFactor']) {
        const factor: Point | undefined = sessionUser[factorName]
        if (factor) {
            factors.push(factor)
        }
        if (factors.length === N.DERIVATION_THRESHOLD) {
            break
        }
    }

    return factors
}
