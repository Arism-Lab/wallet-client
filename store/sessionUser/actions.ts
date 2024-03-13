import { createAsyncThunk } from '@reduxjs/toolkit'

import { serializeFactor } from '@libs/serializer'
import { TA } from '@types'

export const deriveSessionUser = createAsyncThunk<any, void>(
    'derive/sessionUsers',
    async (_, action) => {
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

            return action.fulfillWithValue(sessionUser)
        } catch {
            return action.rejectWithValue(null)
        }
    }
)

export const storeSessionUser = createAsyncThunk<any, TA.SessionUser>(
    'store/sessionUser',
    async (payload, action) => {
        try {
            window.localStorage.setItem('sessionUser', JSON.stringify(payload))

            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const removeSessionUser = createAsyncThunk<any, void>(
    'remove/sessionUser',
    async (_, action) => {
        try {
            window.localStorage.removeItem('sessionUser')

            return action.fulfillWithValue(undefined)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)
