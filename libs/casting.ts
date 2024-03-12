import { BN } from '@common'
import { TA } from '@types'

export const upCastingFactor = (factor: {
    x: string | BN
    y: string | BN
}): TA.Factor => {
    return {
        x: typeof factor.x === 'string' ? BN.from(factor.x, 16) : factor.x,
        y: typeof factor.y === 'string' ? BN.from(factor.y, 16) : factor.y,
    }
}
