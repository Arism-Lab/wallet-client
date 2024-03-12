import { TA } from '@types'
import { Account, TokenSet } from 'next-auth'
import { upCastingFactor } from '@libs/casting'

export const storeLocals = (data: TA.UserLocal | TA.UserLocal[]) => {
    let locals: TA.UserLocal[] = deriveLocals()

    if (!Array.isArray(data)) {
        const index = locals.findIndex((e) => e.user.email === data.user.email)
        if (index !== -1) {
            locals[index] = data
        } else {
            locals.push(data)
        }
    } else {
        locals = data
    }

    window.localStorage.setItem('locals', JSON.stringify(locals))
}
export const deriveLocals = (): TA.UserLocal[] => {
    const locals: TA.UserLocal[] = JSON.parse(
        window.localStorage.getItem('locals') || '[]'
    )

    return locals.map((m) => {
        return {
            user: m.user,
            deviceFactor: upCastingFactor(m.deviceFactor),
            lastLogin: m.lastLogin,
        }
    })
}
export const removeLocals = (session: string) => {
    const locals = deriveLocals()
    const index = locals.findIndex((m) => m.user.email === session)
    locals.splice(index, 1)
    storeLocals(locals)
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
    return JSON.parse(window.localStorage.getItem('token')!)
}
export const wipeToken = () => {
    window.localStorage.removeItem('token')
}

export const storeSession = (session: TA.UserSession) => {
    window.localStorage.setItem('session', JSON.stringify(session))
}
export const deriveSession = (): TA.UserSession => {
    const session: TA.UserSession = JSON.parse(
        window.localStorage.getItem('session')!
    )

    return {
        user: session.user,
        factor1: upCastingFactor(session.factor1),
        factor2: upCastingFactor(session.factor2),
        factor3: session.factor3 ? upCastingFactor(session.factor3) : undefined,
    }
}
export const wipeSession = () => {
    window.localStorage.removeItem('session')
}
