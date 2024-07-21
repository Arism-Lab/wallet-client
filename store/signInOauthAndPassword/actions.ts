import { createAsyncThunk } from '@reduxjs/toolkit'

export const emitStep1 = createAsyncThunk<any, string>(
    'signInOauthAndPassWord/emit/step1',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitStep2 = createAsyncThunk<any, string[]>(
    'signInOauthAndPassWord/emit/step2',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitStep3 = createAsyncThunk<any, string>(
    'signInOauthAndPassWord/emit/step3',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)
