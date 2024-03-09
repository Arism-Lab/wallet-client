import Web3 from 'web3'
import * as bip39 from 'bip39'

export const generateMnemonic = () => {
    const web3 = new Web3()

    // Generate a random 256-bit entropy
    const entropy = web3.utils.randomHex(32)

    // Convert the entropy to a 24-word mnemonic phrase using BIP39
    const mnemonic = bip39.entropyToMnemonic(
        Buffer.from(entropy.substring(2), 'hex')
    )
    return mnemonic
}

export const hexToMnemonic = (hex: string) => {
    const mnemonic = bip39.entropyToMnemonic(Buffer.from(hex, 'hex'))
    return mnemonic
}

export const mnemonicToHex = (mnemonic: string): string => {
    // Convert the entropy to a 24-word mnemonic phrase using BIP39
    const hex = bip39.mnemonicToEntropy(mnemonic)
    return hex
}
