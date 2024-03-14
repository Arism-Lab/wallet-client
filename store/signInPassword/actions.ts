import { createAsyncThunk } from '@reduxjs/toolkit'

export const emitRecoveryFactorStep1 = createAsyncThunk<any, string>(
    'signInPassword/emit/recoveryFactorStep1',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitRecoveryFactorStep2 = createAsyncThunk<any, string[]>(
    'signInPassword/emit/recoveryFactorStep2',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitVerifyStep = createAsyncThunk<any, string>(
    'signInPassword/emit/verifyStep',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)
