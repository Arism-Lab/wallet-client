import { createAsyncThunk } from '@reduxjs/toolkit'

import { serializeFactor } from '@libs/serializer'
import { TA } from '@types'

export const deriveSessionUser = (): TA.SessionUser | undefined => {
    try {
        const res = JSON.parse(window.localStorage.getItem('sessionUser')!)!

        return {
            info: res.info,
            factor1: serializeFactor(res.factor1),
            factor2: serializeFactor(res.factor2),
            factor3: res.factor3 ? serializeFactor(res.factor3) : undefined,
        }
    } catch (e) {
        return undefined
    }
}

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
