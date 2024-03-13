import { createAsyncThunk } from '@reduxjs/toolkit'
import { Account, TokenSet } from 'next-auth'

export const deriveToken = (): TokenSet | undefined => {
    try {
        if (typeof window === 'undefined') return undefined

        return JSON.parse(window.localStorage.getItem('token') || 'undefined')
    } catch {
        return undefined
    }
}

export const storeToken = createAsyncThunk<any, Account>(
    'store/token',
    async (payload, action) => {
        try {
            const token: TokenSet = {
                access_token: payload?.access_token,
                token_type: payload?.token_type,
                id_token: payload?.id_token,
                refresh_token: payload?.refresh_token,
                scope: payload?.scope,
                expires_at: payload?.expires_at,
                session_state: payload?.session_state,
            }
            window.localStorage.setItem('token', JSON.stringify(token))

            return action.fulfillWithValue(token)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const removeToken = createAsyncThunk<any, void>(
    'remove/token',
    async (_, action) => {
        try {
            window.localStorage.removeItem('token')

            return action.fulfillWithValue(undefined)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)
