import { deriveToken } from '@libs/storage'
import { TA, TM } from '@types'
import axios from 'axios'

export const addDevice = async (data: TM.AddDeviceRequest): Promise<void> => {
    const { id_token } = deriveToken()
    const headers = {
        Authorization: `Bearer ${id_token}`,
    }

    await axios.post(
        `${process.env.NEXT_PUBLIC_METADATA_URL}/add-device`,
        data,
        { headers }
    )
}

export const addRecoveryKey = async (
    data: TM.AddRecoveryKeyRequest
): Promise<void> => {
    const { id_token } = deriveToken()
    const headers = {
        Authorization: `Bearer ${id_token}`,
    }

    await axios.post(
        `${process.env.NEXT_PUBLIC_METADATA_URL}/set-recovery-key`,
        data,
        { headers }
    )
}

export const getDevices = async (user: string): Promise<TA.Device[]> => {
    const { data } = await axios
        .get(`${process.env.NEXT_PUBLIC_METADATA_URL}/${user}/devices`)
        .catch(() => ({ data: [] }))

    return data
}

export const getRecoveryKey = async (user: string): Promise<string> => {
    const { data } = await axios
        .get(`${process.env.NEXT_PUBLIC_METADATA_URL}/${user}/recovery-key`)
        .catch(() => ({ data: '' }))

    return data
}
