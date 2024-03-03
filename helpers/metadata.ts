import type * as P2P from '@/types/p2p'
import { getPublic, encrypt, decrypt } from 'eccrypto'
import axios from 'axios'
import {
  addNewDeviceInMetadata,
  generateMetadata,
  reconstructMasterKey,
  enableMFA,
  updateMetadataPasswordMFA,
  updateMetadataRecoveryMFA,
} from '@/helpers/mfa'
import { deviceInfo } from '@/helpers/device'
import { BN, EC } from '@/common/index'
import { findIndex, isEmpty } from 'lodash'
import { keccak256 } from 'web3-utils'
import { hexToMnemonic, mnemonicToHex } from '@/libs/mnemonic'
import { privateKeyToAddress } from '@/common/crypto'

export const updateMetadata = async (
  owner: string,
  shareB: string,
  encryptedMetadata: { [key: string]: any }
) => {
  const msg = keccak256(JSON.stringify(encryptedMetadata))
  const signature = EC.secp256k1
    .sign(msg, Buffer.from(shareB, 'hex'), 'hex')
    .toDER('hex')

  await axios.put(`${process.env.NEXT_PUBLIC_METADATA_URL}/storages`, {
    signature,
    encryptedMetadata,
    owner: owner.toLowerCase(),
  })
}

export const getMasterKeyDisableMFA = async (
  input: P2P.GetMasterKeyDisableMFARequest
): Promise<{ data?: P2P.GetMasterKeyDisableMFAResponse; error?: P2P.ErrorApi }> => {
  const { owner, shareB, decryptedMetadata } = input
  const publicShareB = getPublic(Buffer.from(shareB, 'hex'))
  const deviceInfoString = deviceInfo()
  let encryptedMetadata: P2P.EncryptedMetadata

  let privateKey: BN | undefined

  if (!decryptedMetadata.enabledMFA) {
    const storageShare = storage
      .getShareDeviceFromLocalStorage()
      .find((share) => share.email === owner)
    
    if (isEmpty(storageShare)) {
      const { device, metadata } = await addNewDeviceInMetadata({
        deviceInfo: deviceInfoString,
        metadata: decryptedMetadata,
        shareB,
      })
      await storage.storeShareDeviceOnLocalStorage(device, owner)

      const encryptedMetadataBuffer = await encrypt(
        publicShareB,
        Buffer.from(JSON.stringify(metadata))
      )
      // Set buffer to string
      encryptedMetadata = {
        mac: encryptedMetadataBuffer.mac.toString('hex'),
        iv: encryptedMetadataBuffer.iv.toString('hex'),
        ephemPublicKey: encryptedMetadataBuffer.ephemPublicKey.toString('hex'),
        ciphertext: encryptedMetadataBuffer.ciphertext.toString('hex'),
      }

      await updateMetadata(owner, shareB, encryptedMetadata)
      // const msg = keccak256(JSON.stringify(encryptedMetadata));
      // const signature = ec
      //   .sign(msg, Buffer.from(shareB, 'hex'), 'hex')
      //   .toDER('hex');

      // await axios.put(`${process.v.NEXT_PUBLIC_METADATA_URL}/storages`, {
      //   signature,
      //   encryptedMetadata,
      //   owner: owner.toLowerCase(),
      // });

      // Because index 0 always exist
      const firstShareA = decryptedMetadata.tkey.devices[0]
      const { masterKey } = await reconstructMasterKey({
        shareA: {
          index: BN.from(firstShareA.deviceIndex!, 'hex'),
          value: BN.from(firstShareA.deviceValue!, 'hex'),
        },
        shareB: {
          index: BN.from(decryptedMetadata.tkey.node.index, 'hex'),
          value: BN.from(shareB, 'hex'),
        },
      })
      privateKey = masterKey
    }
    if (!isEmpty(storageShare)) {
      const shareAIndex = findIndex(
        decryptedMetadata.tkey?.devices,
        (device) => {
          return device.id === storageShare.share.id
        }
      )
      if (shareAIndex < 0) {
        return {
          data: undefined,
          error: {
            statusCode: '404',
            errorMessage: 'Not found share in local storage',
          },
        }
      }
      const { masterKey } = await reconstructMasterKey({
        shareA: {
          index: BN.from(
            decryptedMetadata.tkey.devices[shareAIndex].deviceIndex!,
            'hex'
          ),
          value: BN.from(storageShare?.share.deviceValue, 'hex'),
        },
        shareB: {
          index: BN.from(decryptedMetadata.tkey.node.index, 'hex'),
          value: BN.from(shareB, 'hex'),
        },
      })
      privateKey = masterKey
    }
  }
  if (!privateKey) {
    return {
      data: undefined,
      error: {
        statusCode: '404',
        errorMessage: 'Cannot reconstruct master-key',
      },
    }
  }
  const address = privateKeyToAddress(privateKey)
  return { data: { privateKey, address }, error: undefined }
}

/**
 * @case enable MFA true, For device local storage not found
 * @param input
 * @returns
 */
export const getMasterKeyFrom2Shares = async (
  input: P2P.GetMasterKeyFrom2ShareInput
): Promise<{ data?: P2P.GetMasterKeyFrom2ShareOutput; error?: P2P.ErrorApi }> => {
  const { owner, shareB, decryptedMetadata, type } = input
  let { shareOtherValue } = input
  const publicShareB = getPublic(Buffer.from(shareB, 'hex'))
  const deviceInfoString = deviceInfo()

  let privKey: BN
  let shareOtherIndex: string
  if (type === 'passphrase') {
    shareOtherIndex = decryptedMetadata.tkey.passphrase.index
    shareOtherValue = keccak256(shareOtherValue).substring(2)
    const { masterKey } = await reconstructMasterKey({
      shareA: {
        index: BN.from(shareOtherIndex, 'hex'),
        value: BN.from(shareOtherValue, 'hex'),
      },
      shareB: {
        index: BN.from(decryptedMetadata.tkey.node.index, 'hex'),
        value: BN.from(shareB, 'hex'),
      },
    })
    privKey = masterKey
  }
  if (type === 'recovery') {
    shareOtherIndex = decryptedMetadata.tkey.recovery.index
    try {
      shareOtherValue = mnemonicToHex(shareOtherValue)
      const { masterKey } = await reconstructMasterKey({
        shareA: {
          index: BN.from(shareOtherIndex, 'hex'),
          value: BN.from(shareOtherValue, 'hex'),
        },
        shareB: {
          index: BN.from(decryptedMetadata.tkey.node.index, 'hex'),
          value: BN.from(shareB, 'hex'),
        },
      })
      privKey = masterKey
    } catch (error) {
      return {
        data: null,
        error: {
          statusCode: '404',
          errorMessage: error?.message || 'Invalid recovery',
        },
      }
    }
  }

  const privKeyString = privKey.toString('hex').padStart(64, '0')

  const publicKey = getPublic(Buffer.from(privKeyString, 'hex'))
  if (publicKey.toString('hex') !== decryptedMetadata.masterPublicKey) {
    return {
      data: null,
      error: {
        statusCode: '404',
        errorMessage: 'Invalid recovery or passphrase',
      },
    }
  }
  // storage new device
  const { device, metadata } = await addNewDeviceInMetadata({
    deviceInfo: deviceInfoString,
    metadata: decryptedMetadata,
    shareB,
    shareOtherIndex: shareOtherIndex,
    shareOtherValue: shareOtherValue,
  })
  await storage.storeShareDeviceOnLocalStorage(device, owner)

  const encryptedMetadataBuffer = await encrypt(
    publicShareB,
    Buffer.from(JSON.stringify(metadata))
  )
  // Set buffer to string
  const encryptedMetadata = {
    mac: encryptedMetadataBuffer.mac.toString('hex'),
    iv: encryptedMetadataBuffer.iv.toString('hex'),
    ephemPublicKey: encryptedMetadataBuffer.ephemPublicKey.toString('hex'),
    ciphertext: encryptedMetadataBuffer.ciphertext.toString('hex'),
  }
  await updateMetadata(owner, shareB, encryptedMetadata)

  const ethAddress = generateAddressFromPrivKey(privKey)
  return { data: { privKey, ethAddress }, error: null }
}

/**
 * @case enable MFA true, For device local storage found
 * @param input
 * @returns
 */
export const getMasterKeyFromStorage = async (
  input: P2P.GetMasterKeyFromStorageInput
): Promise<{ data?: P2P.GetMasterKeyFromStorageOutput; error?: P2P.ErrorApi }> => {
  const { owner, shareB, decryptedMetadata } = input
  const publicShareB = getPublic(Buffer.from(shareB, 'hex'))
  let privKey: BN
  const storageShare = storage
    .getShareDeviceFromLocalStorage()
    .find((share) => share.email === owner)
  if (isEmpty(storageShare)) {
    return {
      data: null,
      error: {
        errorMessage: 'Not found share in local storage',
        statusCode: '404',
      },
    }
  }
  if (!isEmpty(storageShare)) {
    const shareAIndex = findIndex(decryptedMetadata.tkey?.devices, (device) => {
      return device.id === storageShare.share.id
    })
    if (shareAIndex < 0) {
      return {
        data: null,
        error: {
          errorMessage: 'Not found share in local storage',
          statusCode: '404',
        },
      }
    }

    const { masterKey } = await reconstructMasterKey({
      shareA: {
        index: BN.from(
          decryptedMetadata.tkey.devices[shareAIndex]?.deviceIndex,
          'hex'
        ),
        value: BN.from(storageShare?.share.deviceValue, 'hex'),
      },
      shareB: {
        index: BN.from(decryptedMetadata.tkey.node.index, 'hex'),
        value: BN.from(shareB, 'hex'),
      },
    })
    privKey = masterKey
  }
  if (!privKey) {
    throw Error('Cannot reconstruct master-key')
  }

  const ethAddress = generateAddressFromPrivKey(privKey)
  return { data: { privKey, ethAddress }, error: null }
}

/**
 * @case enable MFA
 * @param input
 * @returns
 */
export const enabledMFA = async (
  input: P2P.UserEnableMFAInput
): Promise<{ data?: P2P.{ recovery: string }; error?: P2P.ErrorApi }> => {
  try {
    const { owner, shareB, decryptedMetadata, recoveryEmail, passphrase } =
      input
    const publicShareB = getPublic(Buffer.from(shareB, 'hex'))
    const deviceInfoString = deviceInfo()

    const passphraseBN = BN.from(keccak256(passphrase).substring(2), 'hex')
    const { metadata, device, recovery } = await enableMFA({
      deviceInfo: deviceInfoString,
      oldMetadata: decryptedMetadata,
      shareB: BN.from(shareB, 'hex'),
      passphrase: passphraseBN,
      recoveryEmail,
    })
    alert(hexToMnemonic(recovery.value.toString('hex')))
    // Call api update metadata
    const encryptedMetadataBuffer = await encrypt(
      publicShareB,
      Buffer.from(JSON.stringify(metadata))
    )
    // Set buffer to string
    const encryptedMetadata = {
      mac: encryptedMetadataBuffer.mac.toString('hex'),
      iv: encryptedMetadataBuffer.iv.toString('hex'),
      ephemPublicKey: encryptedMetadataBuffer.ephemPublicKey.toString('hex'),
      ciphertext: encryptedMetadataBuffer.ciphertext.toString('hex'),
    }

    await updateMetadata(owner, shareB, encryptedMetadata)
    // storage new device
    await storage.storeShareDeviceOnLocalStorage(device, owner)
    return {
      data: {
        recovery: hexToMnemonic(recovery.value.toString('hex')),
      },
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: { statusCode: '500', errorMessage: error.message || 'Unknown' },
    }
  }
}

/**
 * @case change account passowrd MFA
 * @param input
 * @returns
 */
export const changeAccountPassword = async (
  input: P2P.ChangePasswordMFAInput
): Promise<{ data?: P2P.boolean; error?: P2P.ErrorApi }> => {
  try {
    const { owner, shareB, decryptedMetadata, passphrase, masterPrivateKey } =
      input
    const publicShareB = getPublic(Buffer.from(shareB, 'hex'))

    const passphraseBN = BN.from(keccak256(passphrase).substring(2), 'hex')
    const { metadata } = await updateMetadataPasswordMFA({
      owner,
      decryptedMetadata,
      shareB: BN.from(shareB, 'hex'),
      masterPrivateKey: BN.from(masterPrivateKey, 'hex'),
      passphrase: passphraseBN,
    })
    // Call api update metadata
    const encryptedMetadataBuffer = await encrypt(
      publicShareB,
      Buffer.from(JSON.stringify(metadata))
    )
    // Set buffer to string
    const encryptedMetadata = {
      mac: encryptedMetadataBuffer.mac.toString('hex'),
      iv: encryptedMetadataBuffer.iv.toString('hex'),
      ephemPublicKey: encryptedMetadataBuffer.ephemPublicKey.toString('hex'),
      ciphertext: encryptedMetadataBuffer.ciphertext.toString('hex'),
    }

    await updateMetadata(owner, shareB, encryptedMetadata)
    return {
      data: true,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: { statusCode: '500', errorMessage: error.message || 'Unknown' },
    }
  }
}

/**
 * @case change account passowrd MFA
 * @param input
 * @returns
 */
export const changeRecovery = async (
  input: P2P.ResendRecoveryMFAInput
): Promise<{ data?: P2P.ResendRecoveryMFAOutput; error?: P2P.ErrorApi }> => {
  try {
    const {
      owner,
      shareB,
      decryptedMetadata,
      recoveryEmail,
      masterPrivateKey,
    } = input
    const publicShareB = getPublic(Buffer.from(shareB, 'hex'))

    const { metadata, recovery } = await updateMetadataRecoveryMFA({
      owner,
      decryptedMetadata,
      shareB: BN.from(shareB, 'hex'),
      masterPrivateKey: BN.from(masterPrivateKey, 'hex'),
      recoveryEmail,
    })
    // Call api update metadata
    const encryptedMetadataBuffer = await encrypt(
      publicShareB,
      Buffer.from(JSON.stringify(metadata))
    )
    // Set buffer to string
    const encryptedMetadata = {
      mac: encryptedMetadataBuffer.mac.toString('hex'),
      iv: encryptedMetadataBuffer.iv.toString('hex'),
      ephemPublicKey: encryptedMetadataBuffer.ephemPublicKey.toString('hex'),
      ciphertext: encryptedMetadataBuffer.ciphertext.toString('hex'),
    }

    await updateMetadata(owner, shareB, encryptedMetadata)
    // Send mail
    const words = hexToMnemonic(recovery.value.toString('hex'))
    return {
      data: { metadata, phrase: words },
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: { statusCode: '500', errorMessage: error.message || 'Unknown' },
    }
  }
}

/**
 * @case Remove device
 * @param input
 * @returns
 */
export const removeDeviceMFA = async (
  input: P2P.RemoveDeviceMFAInput
): Promise<{ data?: P2P.RemoveDeviceMFAOutput; error?: P2P.ErrorApi }> => {
  try {
    const { owner, shareB, deviceId } = input
    const { decryptedMetadata } = input
    const {
      tkey: { devices },
    } = decryptedMetadata
    const publicShareB = getPublic(Buffer.from(shareB, 'hex'))
    const afterDevice = devices.filter((device) => device.id !== deviceId)
    const metadata = {
      ...decryptedMetadata,
      tkey: {
        ...decryptedMetadata.tkey,
        devices: afterDevice,
      },
    }
    // Call api update metadata
    const encryptedMetadataBuffer = await encrypt(
      publicShareB,
      Buffer.from(JSON.stringify(metadata))
    )
    // Set buffer to string
    const encryptedMetadata = {
      mac: encryptedMetadataBuffer.mac.toString('hex'),
      iv: encryptedMetadataBuffer.iv.toString('hex'),
      ephemPublicKey: encryptedMetadataBuffer.ephemPublicKey.toString('hex'),
      ciphertext: encryptedMetadataBuffer.ciphertext.toString('hex'),
    }

    await updateMetadata(owner, shareB, encryptedMetadata)
    return {
      data: true,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: { statusCode: '500', errorMessage: error.message || 'Unknown' },
    }
  }
}

export const getMetadata = async (
  input: P2P.GetMetadataRequest
): Promise<{ data?: P2P.GetMetadataResponse; error?: P2P.ErrorApi }> => {
  const { owner, shareB } = input
  const publicShareB = getPublic(Buffer.from(shareB, 'hex'))
  const deviceInfoString = deviceInfo()
  let error: ErrorApi
  let encryptedMetadata: EncryptedMetadata
  try {
    const { data: metadata } = await axios.get<GetMetadataResponse>(
      `${process.env.NEXT_PUBLIC_METADATA_URL}/storages/${owner.toLowerCase()}`
    )
    encryptedMetadata = metadata.encryptedMetadata
  } catch (err) {
    error = {
      errorMessage: err?.response?.data.message,
      statusCode: err?.response?.data.statusCode,
    }
  }

  // Case: First time user sign in DWallet, auto storage metadata
  if (error?.errorMessage?.includes('Can not find metadata')) {
    const metadata = await generateMetadata({
      shareB: BN.from(shareB, 'hex'),
      owner,
      deviceInfo: deviceInfoString,
    })
    try {
      const encryptedMetadataBuffer = await encrypt(
        publicShareB,
        Buffer.from(JSON.stringify(metadata))
      )
      // Set buffer to string
      encryptedMetadata = {
        mac: encryptedMetadataBuffer.mac.toString('hex'),
        iv: encryptedMetadataBuffer.iv.toString('hex'),
        ephemPublicKey: encryptedMetadataBuffer.ephemPublicKey.toString('hex'),
        ciphertext: encryptedMetadataBuffer.ciphertext.toString('hex'),
      }

      const msg = keccak256(JSON.stringify(encryptedMetadata))
      const signature = ec
        .sign(msg, Buffer.from(shareB, 'hex'), 'hex')
        .toDER('hex')

      await axios.post(`${process.env.NEXT_PUBLIC_METADATA_URL}/storages`, {
        encryptedMetadata,
        signature,
        publicKey: publicShareB.toString('hex'),
        owner: owner.toLowerCase(),
      })
      const data: GetMetadataResponse = {
        encryptedMetadata,
        publicKey: publicShareB.toString('hex'),
        owner: owner.toLowerCase(),
      }
      return { error: null, data: data }
    } catch (err) {
      error = {
        errorMessage: err?.response?.data.message,
        statusCode: err?.response?.data.statusCode,
      }
    }
    if (error) return { error, data: null }
    // await storage.storeShareOnLocalStorage(removeFieldValue(metadata), "shares")
  }

  const metadata = await decrypt(Buffer.from(shareB, 'hex'), {
    ephemPublicKey: Buffer.from(encryptedMetadata.ephemPublicKey, 'hex'),
    iv: Buffer.from(encryptedMetadata.iv, 'hex'),
    mac: Buffer.from(encryptedMetadata.mac, 'hex'),
    ciphertext: Buffer.from(encryptedMetadata.ciphertext, 'hex'),
  })
  const decryptedMetadata = JSON.parse(metadata.toString()) as Metadata
  return { data: { owner, metadata: decryptedMetadata }, error: null }
}
