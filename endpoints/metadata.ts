'use client'

import { DELETE, GET, POST, PUT } from '@libs/api'

export const find = async (user: string): Promise<Metadata> => {
    const res = await GET<Metadata>('/metadata', { user })
    return res
}
export const initialize = async (user: Metadata): Promise<void> => {
    await POST<Metadata>('/metadata', user, true)
}

export const findDevices = async (user: string): Promise<Device[]> => {
    const res = await GET<Device[]>('/metadata/devices', { user })
    return res
}
export const addDevice = async (user: string, device: Device): Promise<void> => {
    await POST('/metadata/devices', { user, device }, true)
}
export const editDevice = async (user: string, device: Device): Promise<void> => {
    await PUT('/metadata/devices', { user, device }, true)
}
export const removeDevice = async (user: string, device: Device): Promise<void> => {
    await DELETE('/metadata/devices', { user, device }, true)
}

export const findPrivateIndices = async (user: string): Promise<PrivateIndex[]> => {
    const res = await GET<PrivateIndex[]>('/metadata/privateIndices', { user })
    return res
}
export const addPrivateIndex = async (user: string, privateIndex: PrivateIndex): Promise<void> => {
    await POST('/metadata/privateIndices', { user, privateIndex }, true)
}
export const editPrivateIndex = async (user: string, privateIndex: PrivateIndex): Promise<void> => {
    await PUT('/metadata/privateIndices', { user, privateIndex }, true)
}
export const removePrivateIndex = async (user: string, privateIndex: PrivateIndex): Promise<void> => {
    await DELETE('/metadata/privateIndices', { user, privateIndex }, true)
}

export const findRecoveryKey = async (user: string): Promise<string> => {
    const res = await GET<string>('/metadata/recoveryKey', { user })
    return res
}
export const setRecoveryKey = async (user: string, recoveryKey: string): Promise<void> => {
    await PUT('/metadata/recoveryKey', { user, recoveryKey }, true)
}
