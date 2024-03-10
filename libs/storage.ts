import { TA } from '@types'
import { Account, TokenSet } from 'next-auth'

export const storeMetadata = (
    data: TA.MetadataStorage | TA.MetadataStorage[]
) => {
    if (Array.isArray(data)) {
        window.localStorage.setItem('metadatas', JSON.stringify(data))
        return
    }
    const metadatas: TA.MetadataStorage[] = deriveMetadatas()
    window.localStorage.setItem(
        'metadatas',
        JSON.stringify([...metadatas, data])
    )
}
export const deriveMetadatas = (): TA.MetadataStorage[] => {
    return JSON.parse(window.localStorage.getItem('metadatas') || '[]')
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

export const storeWallet = (wallet: TA.Wallet) => {
    window.localStorage.setItem('wallet', JSON.stringify(wallet))
}
export const deriveWallet = (): TA.Wallet => {
    return JSON.parse(window.localStorage.getItem('wallet') || 'null')
}
export const wipeWallet = () => {
    window.localStorage.removeItem('wallet')
}
