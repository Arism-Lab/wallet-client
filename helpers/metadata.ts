import axios from 'axios'

import { store } from '@store'
import { TA, TM } from '@types'

const getIdToken = (): string => {
    const token = store.getState().tokenReducer

    return token.data!.id_token!
}

export const initializeUser = async (user: string): Promise<void> => {
    await axios.post(`${process.env.NEXT_PUBLIC_METADATA_URL}`, { user })
}

export const addDevice = async (data: TM.AddDeviceRequest): Promise<void> => {
    const idToken = getIdToken()
    const headers = {
        Authorization: `Bearer ${idToken}`,
    }

    await axios.post(
        `${process.env.NEXT_PUBLIC_METADATA_URL}/add-device`,
        data,
        { headers }
    )
}
export const addKey = async (data: TM.AddKeyRequest): Promise<void> => {
    const idToken = getIdToken()
    const headers = {
        Authorization: `Bearer ${idToken}`,
    }

    await axios.post(`${process.env.NEXT_PUBLIC_METADATA_URL}/add-key`, data, {
        headers,
    })
}
export const setRecoveryKey = async (
    data: TM.SetRecoveryKeyRequest
): Promise<void> => {
    const idToken = getIdToken()
    const headers = {
        Authorization: `Bearer ${idToken}`,
    }

    await axios.post(
        `${process.env.NEXT_PUBLIC_METADATA_URL}/set-recovery-key`,
        data,
        { headers }
    )
}

export const getUser = async (
    user: string
): Promise<TA.Metadata | undefined> => {
    const { data } = await axios
        .get(`${process.env.NEXT_PUBLIC_METADATA_URL}/${user}`)
        .catch(() => ({ data: undefined }))

    return data
}
export const getDevices = async (user: string): Promise<TA.Device[]> => {
    const { data } = await axios
        .get(`${process.env.NEXT_PUBLIC_METADATA_URL}/${user}/devices`)
        .catch(() => ({ data: [] }))

    return data
}
export const getKeys = async (user: string): Promise<TA.Key[]> => {
    const { data } = await axios
        .get(`${process.env.NEXT_PUBLIC_METADATA_URL}/${user}/keys`)
        .catch(() => ({ data: [] }))

    return data
}
export const getRecoveryKey = async (user: string): Promise<string> => {
    const { data } = await axios
        .get(`${process.env.NEXT_PUBLIC_METADATA_URL}/${user}/recovery-key`)
        .catch(() => ({ data: '' }))

    return data
}
