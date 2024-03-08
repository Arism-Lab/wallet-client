import { Ecies } from 'eccrypto'
import BN from 'bn.js'

export type GetAddressRequest = {
  owner: string
}

export type GetAddressResponse = {
  owner: string
  publicKey: string
  address: string
}

export type GetPrivateKeyRequest = {
  owner: string
  idToken: string
}

export type GetPrivateKeyResponse = {
  address: string
  privateKey: string
  metadataNonce?: BN
}

export type CommitmentRequest = {
  commitment: string
  timestamp: string
  tempPublicKey: string
  verifier: string
}

export type CommitmentResponse = {
  signature: string
}

export type ShareRequest = {
  signatures: CommitmentResponse[]
  owner: string
  verifier: string
  idToken: string
  tempPublicKey?: string
}

export type SecretResponse = {
  masterShare: string
  threshold: number
  publicKey: string
  metadata: {
    iv: string
    ephemPublicKey: string
    mac: string
  }
}

export type ErrorApi = {
  statusCode: string
  errorMessage?: string
}

export type Metadata = {
  enabledMFA: boolean
  masterPublicKey: string
  owner: string
  tkey: Tkey
}

export type DeviceKey = {
  id: string
  deviceIndex?: string
  deviceValue?: string
  deviceInfo: string
}

export type Tkey = {
  total: number
  threshold: number
  node: {
    index: string
  }
  devices: DeviceKey[]
  passphrase?: {
    index: string
  }
  recovery?: {
    email: string
    createdAt: number
    index: string
  }
}

export type ReconstructMasterKeyInput = {
  shareA: {
    index: BN
    value: BN
  }
  shareB: {
    index: BN
    value: BN
  }
}

export type ReconstructMasterKeyOutput = {
  masterKey: BN
}

export type EnableMFAInput = {
  oldMetadata: Metadata
  shareB: BN
  deviceInfo: string
  // recovery?: BN;
  recoveryEmail: string
  passphrase?: BN
}

export type EnableMFAOutput = {
  metadata: Metadata
  device: DeviceKey
  recovery: {
    index?: BN
    value: BN
  }
}

export type UserEnableMFAInput = {
  owner: string
  decryptedMetadata: Metadata
  shareB: string

  recoveryEmail?: string
  passphrase?: string
}

export type ChangePasswordMFAInput = {
  owner: string
  decryptedMetadata: Metadata
  shareB: string
  passphrase: string
  masterPrivateKey: string
}

export type ChangePasswordMFAOutput = {
  metadata: Metadata
}

export type ResendRecoveryMFAInput = {
  owner: string
  decryptedMetadata: Metadata
  shareB: string
  recoveryEmail: string
  masterPrivateKey: string
}

export type ResendRecoveryMFAOutput = {
  metadata: Metadata
  phrase: string
}

export type RemoveDeviceMFAInput = {
  deviceId: string
  owner: string
  decryptedMetadata: Metadata
  shareB: string
}

export type RemoveDeviceMFAOutput = boolean

export type UpdateMetadataPasswordMFAInput = {
  owner: string
  decryptedMetadata: Metadata
  shareB: BN
  passphrase: BN
  masterPrivateKey: BN
}

export type UpdateMetadataPasswordMFAOutput = {
  metadata: Metadata
}

export type UpdateMetadataRecoveryMFAInput = {
  owner: string
  decryptedMetadata: Metadata
  shareB: BN
  recoveryEmail: string
  masterPrivateKey: BN
}

export type UpdateMetadataRecoveryMFAOutput = {
  metadata: Metadata
  recovery: {
    index?: BN
    value: BN
  }
}

export type GenerateMetadataInput = {
  owner: string
  shareB: BN
  deviceInfo: string
  enableMFA?: boolean
}

export type GenerateMetadataOutput = Metadata

export type GetMasterKeyDisableMFARequest = {
  shareB: string
  owner: string
  decryptedMetadata: Metadata
}

export type GetMasterKeyDisableMFAResponse = {
  privateKey: BN
  address: string
}

export type GetMasterKeyFromStorageInput = {
  shareB: string
  owner: string
  decryptedMetadata: Metadata
}

export type GetMasterKeyFromStorageOutput = {
  privateKey: BN
  address: string
}

export type GetMasterKeyFrom2ShareInput = {
  shareB: string
  shareOtherValue: string
  type: 'passphrase' | 'recovery'
  owner: string
  decryptedMetadata: Metadata
}

export type GetMasterKeyFrom2ShareOutput = {
  privateKey: BN
  address: string
}

export type GetMetadataRequest = {
  shareB: string
  owner: string
}

export type GetMetadataResponse = {
  owner: string
  publicKey?: string // public key of shareB
  // decrypted
  metadata?: Metadata

  // encrypted, data response from api get metadata (layer)
  encryptedMetadata?: EncryptedMetadata
}

export type EncryptedMetadata = {
  // mac: string;
  // ciphertext: string;
  // iv: string;
  // ephemPublicKey: string;
  [key in keyof Ecies]: string
}
export type AddNewDeviceInMetadataInput = {
  metadata: Metadata
  shareB: string
  deviceInfo: string

  // share other
  shareOtherIndex?: string
  shareOtherValue?: string
}

export type AddNewDeviceInMetadataOutput = {
  metadata: Metadata
  device: DeviceKey
}

export type CalculateIndexFromValueInput = {
  masterPrivateKey: BN
  shareB: {
    index: BN
    value: BN
  }
  newValue: BN
}

export type CalculateIndexFromValueOutput = {
  newIndex: BN
}
