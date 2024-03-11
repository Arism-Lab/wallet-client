import { TA } from '@types'
import { Account, TokenSet } from 'next-auth'

export const storeMetadata = (
    data: TA.MetadataStorage | TA.MetadataStorage[]
) => {
    let metadatas: TA.MetadataStorage[] = deriveMetadatas()

    if (!Array.isArray(data)) {
        const index = metadatas.findIndex(
            (e) => e.user.email === data.user.email
        )
        if (index !== -1) {
            metadatas[index] = data
        } else {
            metadatas.push(data)
        }
    } else {
        metadatas = data
    }

    window.localStorage.setItem('metadatas', JSON.stringify(metadatas))
}
export const deriveMetadatas = (): TA.MetadataStorage[] => {
    const metadatas = JSON.parse(
        window.localStorage.getItem('metadatas') || '[]'
    ) as TA.MetadataStorage[]
    if (!Array.isArray(metadatas)) {
        return [metadatas]
    }
    return metadatas
}
export const removeMetadata = (user: string) => {
    const metadatas = deriveMetadatas()
    const index = metadatas.findIndex((m) => m.user.email === user)
    metadatas.splice(index, 1)
    storeMetadata(metadatas)
}
export const storeToken = (account: Account) => {
    const token: TokenSet = {
        access_token: account?.access_token,
        token_type: account?.token_type,
        id_token: account?.id_token,
        refresh_token: account?.refresh_token,
        scope: account?.scope,
        expires_at: account?.expires_at,
        session_state: account?.session_state,
    }
    window.localStorage.setItem('token', JSON.stringify(token))
}
export const deriveToken = (): TokenSet => {
    const token: TokenSet = JSON.parse(
        window.localStorage.getItem('token') || 'null'
    )!

    // TODO: Check if token is expired

    return token
}
export const wipeToken = () => {
    window.localStorage.removeItem('token')
}

export const storeUser = (user: TA.User) => {
    window.localStorage.setItem('user', JSON.stringify(user))
}
export const deriveUser = (): TA.User => {
    return JSON.parse(window.localStorage.getItem('user') || 'null')
}
export const wipeUser = () => {
    window.localStorage.removeItem('user')
}
