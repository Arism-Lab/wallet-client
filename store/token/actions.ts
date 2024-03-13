import { createAsyncThunk } from '@reduxjs/toolkit'
import { Account, TokenSet } from 'next-auth'

export const deriveToken = createAsyncThunk<any, void>(
    'derive/token',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const token = JSON.parse(window.localStorage.getItem('token')!)
            return fulfillWithValue(token)
        } catch {
            return rejectWithValue(null)
        }
    }
)

export const storeToken = createAsyncThunk<any, Account>(
    'store/sessionUser',
    async (payload, _) => {
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
    }
)

export const removeToken = createAsyncThunk<any, void>(
    'remove/token',
    async () => {
        window.localStorage.removeItem('token')
    }
)
