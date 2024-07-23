import { GET, POST } from '@libs/api'

export const getUser = async (user: string): Promise<Metadata> => {
    const res = await GET<Metadata>('/metadata', { user })
    return res
}

export const initializeUser = async (user: Metadata): Promise<void> => {
    await POST<Metadata>('/metadata', user, true)
}

export const getDevices = async (user: string): Promise<Device[]> => {
    const res = await GET<Device[]>('/metadata/devices', { user })
    return res
}

export const addDevice = async (user: string, device: Device): Promise<void> => {
    await POST('/metadata/devices', { user, device }, true)
}

export const getPrivateIndices = async (user: string): Promise<PrivateIndex[]> => {
    const res = await GET<PrivateIndex[]>('/metadata/privateIndices', { user })
    return res
}

export const addPrivateIndex = async (user: string, privateIndex: PrivateIndex): Promise<void> => {
    await POST('/metadata/privateIndices', { user, privateIndex }, true)
}

export const getRecoveryKey = async (user: string): Promise<string> => {
    const res = await GET<string>('/metadata/recoveryKey', { user })
    return res
}

export const setRecoveryKey = async (user: string, recoveryKey: string): Promise<void> => {
    await POST('/metadata/recoveryKey', { user, recoveryKey }, true)
}
