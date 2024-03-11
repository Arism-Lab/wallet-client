import elliptic from 'elliptic'
import { toChecksumAddress } from 'web3-utils'
import { BN, H } from '@common'
import { TA } from '@types'

export const secp256k1 = new elliptic.ec('secp256k1')

export const ORDER = secp256k1.curve.n

export const generateKeyPar = (): elliptic.ec.KeyPair => {
    return secp256k1.genKeyPair()
}

export const generatePrivateKey = (): string => {
    return generateKeyPar().getPrivate('hex')
}

export const decodePublicKey = (publicKey: string): TA.Point => {
    const x = BN.from(publicKey.slice(2, 66), 16)
    const y = BN.from(publicKey.slice(66), 16)

    return { x, y }
}

export const encodePublicKey = (point: TA.Point): string => {
    return `04${point.x.toString(16, 64)}${point.y.toString(16, 64)}`
}

export const getPublicKeyFromPrivateKey = (privateKey: BN): string => {
    const key = secp256k1.keyFromPrivate(privateKey.toString(16, 64), 'hex')

    return encodePublicKey({
        x: key.getPublic().getX(),
        y: key.getPublic().getY(),
    })
}

export const getAddressFromPrivateKey = (privateKey: BN): string => {
    const key = secp256k1.keyFromPrivate(privateKey.toString(16, 64), 'hex')
    const publicKey = key.getPublic().encode('hex', false).slice(2)
    const lowercaseAddress = `0x${H.keccak256(
        Buffer.from(publicKey, 'hex')
    ).slice(64 - 38)}`
    return toChecksumAddress(lowercaseAddress)
}

export const ellipticAddition = (p1: TA.Point, p2: TA.Point): TA.Point => {
    const p1CurvePoint = secp256k1.curve.point(p1.x, p1.y)
    const p2CurvePoint = secp256k1.curve.point(p2.x, p2.y)
    const p3CurvePoint = p1CurvePoint.add(p2CurvePoint)

    return {
        x: p3CurvePoint.getX(),
        y: p3CurvePoint.getY(),
    }
}
