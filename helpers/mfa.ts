import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import type * as P2P from '@types/p2p'
import { BN, EC } from '@common/index'
import { lagrangeInterpolation } from '@libs/arithmetic'

export const generateMetadata = async ({
    owner,
    shareB,
    deviceInfo,
    enableMFA,
}: P2P.GenerateMetadataInput): Promise<P2P.GenerateMetadataOutput> => {
    const keypair = EC.secp256k1.genKeyPair()
    const privateKey = keypair.getPrivate()

    const nodeValue = shareB
    const nodeIndex = EC.secp256k1.genKeyPair().getPrivate()
    const deviceIndex = EC.secp256k1.genKeyPair().getPrivate()

    const deviceValue = lagrangeInterpolation(
        [BN.ZERO, nodeIndex],
        [privateKey, nodeValue],
        deviceIndex
    )

    const mustShares = 2

    const metadata: P2P.Metadata = {
        enabledMFA: false,
        owner,
        masterPublicKey: keypair.getPublic('hex'),
        tkey: {
            total: mustShares,
            threshold: mustShares,
            node: {
                index: nodeIndex.toString('hex'),
            },
            devices: [
                {
                    id: uuidv4(),
                    deviceIndex: enableMFA
                        ? deviceIndex.toString('hex')
                        : undefined,
                    deviceValue: enableMFA
                        ? deviceValue?.toString('hex')
                        : undefined,
                    deviceInfo,
                },
            ],
        },
    }

    return metadata
}

export const reconstructMasterKey = async ({
    shareA,
    shareB,
}: P2P.ReconstructMasterKeyInput): Promise<P2P.ReconstructMasterKeyOutput> => {
    const indices = [shareA.index, shareB.index]
    const values = [shareA.value, shareB.value]
    const masterPrivateKey = lagrangeInterpolation(indices, values, BN.ZERO)

    return {
        masterKey: masterPrivateKey!,
    }
}

export const enableMFA = async ({
    oldMetadata,
    shareB,
    deviceInfo,
    recoveryEmail,
    passphrase,
}: P2P.EnableMFAInput): Promise<P2P.EnableMFAOutput> => {
    if (oldMetadata.enabledMFA) {
        throw new Error('Already enabled MFA')
    }

    const { owner, tkey, masterPublicKey } = oldMetadata
    const { node, devices } = tkey
    if (!devices[0]) {
        throw new Error('Should generate metadata before enable MFA')
    }

    const nodeValue = shareB
    const nodeIndex = BN.from(node.index, 'hex')

    const oldDeviceIndex = BN.from(devices[0].deviceIndex!, 'hex')
    const oldDeviceValue = BN.from(devices[0].deviceValue!, 'hex')

    const newDeviceIndex = EC.secp256k1.genKeyPair().getPrivate()

    const newDeviceValue = lagrangeInterpolation(
        [nodeIndex, oldDeviceIndex],
        [nodeValue, oldDeviceValue],
        newDeviceIndex
    )

    const newDevice = {
        id: uuidv4(),
        deviceValue: newDeviceValue!.toString('hex'),
        deviceInfo,
    }

    // Generate recovery-value
    const newRecoveryIndex = EC.secp256k1.genKeyPair().getPrivate()
    const newRecoveryValue = lagrangeInterpolation(
        [nodeIndex, oldDeviceIndex],
        [nodeValue, oldDeviceValue],
        newRecoveryIndex
    )
    // Generate passphrase-index
    const { masterKey } = await reconstructMasterKey({
        shareA: {
            index: newDeviceIndex!,
            value: newDeviceValue!,
        },
        shareB: {
            index: nodeIndex,
            value: nodeValue,
        },
    })
    const { newIndex: newPassphraseIndex } = await calculateIndexFromValue({
        newValue: BN.from(passphrase!, 'hex'),
        shareB: {
            index: nodeIndex,
            value: nodeValue,
        },
        masterPrivateKey: masterKey,
    })

    const newMetadata: P2P.Metadata = {
        enabledMFA: true,
        masterPublicKey,
        owner,
        tkey: {
            threshold: 2,
            total: 2,
            node,
            recovery: {
                index: newRecoveryIndex.toString('hex'),
                email: recoveryEmail,
                createdAt: moment().unix(),
            },
            passphrase: { index: newPassphraseIndex.toString('hex') },
            devices: [
                {
                    ...newDevice,
                    deviceIndex: newDeviceIndex.toString('hex'),
                },
            ],
        },
    }

    return {
        metadata: newMetadata,
        device: newDevice,
        recovery: { value: newRecoveryValue! },
    }
}

export const updateMetadataPasswordMFA = async (
    params: P2P.UpdateMetadataPasswordMFAInput
): Promise<P2P.UpdateMetadataPasswordMFAOutput> => {
    const { shareB, decryptedMetadata, passphrase, masterPrivateKey } = params

    if (!decryptedMetadata.enabledMFA) {
        throw new Error('User does not enable MFA yet')
    }

    const { owner, tkey, masterPublicKey } = decryptedMetadata
    const { node } = tkey

    const nodeValue = shareB
    const nodeIndex = BN.from(node.index, 'hex')

    // Generate passphrase-index
    const { newIndex: newPassphraseIndex } = await calculateIndexFromValue({
        newValue: BN.from(passphrase, 'hex'),
        shareB: {
            index: nodeIndex,
            value: nodeValue,
        },
        masterPrivateKey,
    })

    const newMetadata: P2P.Metadata = {
        enabledMFA: true,
        masterPublicKey,
        owner,
        tkey: {
            ...tkey,
            passphrase: { index: newPassphraseIndex.toString('hex') },
        },
    }

    return { metadata: newMetadata }
}

export const updateMetadataRecoveryMFA = async (
    params: P2P.UpdateMetadataRecoveryMFAInput
): Promise<P2P.UpdateMetadataRecoveryMFAOutput> => {
    const { shareB, decryptedMetadata, recoveryEmail, masterPrivateKey } =
        params

    if (!decryptedMetadata.enabledMFA) {
        throw new Error('User does not enable MFA yet')
    }

    const { owner, tkey, masterPublicKey } = decryptedMetadata
    const { node } = tkey

    const nodeValue = shareB
    const nodeIndex = BN.from(node.index, 'hex')

    // Generate recovery-value
    const newRecoveryIndex = EC.secp256k1.genKeyPair().getPrivate()
    const newRecoveryValue = lagrangeInterpolation(
        [nodeIndex, BN.ZERO],
        [nodeValue, masterPrivateKey],
        newRecoveryIndex
    )

    const newMetadata: P2P.Metadata = {
        enabledMFA: true,
        masterPublicKey,
        owner,
        tkey: {
            ...tkey,
            recovery: {
                index: newRecoveryIndex.toString('hex'),
                email: recoveryEmail,
                createdAt: moment().unix(),
            },
        },
    }

    return { metadata: newMetadata, recovery: { value: newRecoveryValue! } }
}

export const addNewDeviceInMetadata = async ({
    metadata,
    deviceInfo,
    shareB,
    shareOtherIndex,
    shareOtherValue,
}: P2P.AddNewDeviceInMetadataInput): Promise<P2P.AddNewDeviceInMetadataOutput> => {
    const { enabledMFA, tkey } = metadata

    if (enabledMFA) {
        const { devices, node } = tkey
        const nodeIndex = BN.from(node.index, 'hex')
        const nodeValue = BN.from(shareB, 'hex')
        const newDeviceIndex = EC.secp256k1.genKeyPair().getPrivate()

        const newDeviceValue = lagrangeInterpolation(
            [nodeIndex, BN.from(shareOtherIndex!, 'hex')],
            [nodeValue, BN.from(shareOtherValue!, 'hex')],
            newDeviceIndex
        )

        const newDevice: P2P.DeviceKey = {
            id: uuidv4(),
            deviceValue: newDeviceValue!.toString('hex'),
            deviceInfo,
        }
        devices.push({
            ...newDevice,
            deviceIndex: newDeviceIndex.toString('hex'),
            deviceValue: undefined,
        })
        const newTkey: P2P.Tkey = {
            ...tkey,
            total: tkey.total + 1,
            devices,
        }
        const newMetadata: P2P.Metadata = {
            ...metadata,
            tkey: newTkey,
        }

        return { metadata: newMetadata, device: newDevice }
    } else {
        const { devices, node } = tkey
        const nodeIndex = BN.from(node.index, 'hex')
        const nodeValue = BN.from(shareB, 'hex')

        const lastDevice = devices[devices.length - 1]
        const deviceIndex = BN.from(lastDevice.deviceIndex!, 'hex')
        const deviceValue = BN.from(lastDevice.deviceValue!, 'hex')

        const newDeviceIndex = EC.secp256k1.genKeyPair().getPrivate()

        const newDeviceValue = lagrangeInterpolation(
            [nodeIndex, deviceIndex],
            [nodeValue, deviceValue],
            newDeviceIndex
        )

        const newDevice: P2P.DeviceKey = {
            id: uuidv4(),
            deviceValue: newDeviceValue!.toString('hex'),
            deviceInfo,
        }

        devices.push({
            ...newDevice,
            deviceIndex: newDeviceIndex.toString('hex'),
        })

        const newTkey: P2P.Tkey = {
            ...tkey,
            total: tkey.total + 1,
            devices,
        }
        const newMetadata: P2P.Metadata = {
            ...metadata,
            tkey: newTkey,
        }

        return { metadata: newMetadata, device: newDevice }
    }
}

export const calculateIndexFromValue = async ({
    masterPrivateKey,
    shareB,
    newValue,
}: P2P.CalculateIndexFromValueInput): Promise<P2P.CalculateIndexFromValueOutput> => {
    const coefficient = shareB.value
        .sub(masterPrivateKey)
        .mul(shareB.index.invm(EC.ORDER))
        .umod(EC.ORDER)

    const newIndex = newValue
        .sub(masterPrivateKey)
        .mul(coefficient.invm(EC.ORDER))
        .umod(EC.ORDER)

    return { newIndex }
}
