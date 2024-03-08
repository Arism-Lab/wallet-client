import { toChecksumAddress } from 'web3-utils'
import { BN, EC, H } from '@common'
import * as Crypto from 'eccrypto'

export const decrypt = (
  privateKey: Buffer,
  opts: Crypto.Ecies
): Promise<Buffer> => {
  return Crypto.decrypt(privateKey, opts)
}

export const getPublicKey = (privateKey: Buffer): Buffer => {
  return Crypto.getPublic(privateKey)
}

export const privateKeyToAddress = (privateKey: BN): string => {
  const key = EC.secp256k1.keyFromPrivate(privateKey.toString('hex', 64), 'hex')
  const publicKey = key.getPublic().encode('hex', false).slice(2)
  const lowercaseAddress = `0x${H.keccak256(
    Buffer.from(publicKey, 'hex')
  ).slice(64 - 38)}`
  return toChecksumAddress(lowercaseAddress)
}

export const generatePrivateKey = (): Buffer => {
  return Crypto.generatePrivate()
}
