import { createAsyncThunk } from '@reduxjs/toolkit'

import { serializeFactor } from '@libs/serializer'
import { TA } from '@types'

export const deriveSessionUser = createAsyncThunk<any, void>(
    'derive/sessionUsers',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const sessionUser: TA.SessionUser = JSON.parse(
                window.localStorage.getItem('sessionUser') || '[]'
            ).then((e: any) => {
                return {
                    user: e.user,
                    factor1: serializeFactor(e.factor1),
                    factor2: serializeFactor(e.factor2),
                    factor3: e.factor3 ? serializeFactor(e.factor3) : undefined,
                }
            })

            return fulfillWithValue(sessionUser)
        } catch {
            return rejectWithValue(null)
        }
    }
)

export const storeSessionUser = createAsyncThunk<any, TA.SessionUser>(
    'store/sessionUser',
    async (payload, _) => {
        window.localStorage.setItem('sessionUser', JSON.stringify(payload))
    }
)

export const removeSessionUser = createAsyncThunk<any, void>(
    'remove/sessionUser',
    async () => {
        window.localStorage.removeItem('sessionUser')
    }
)
