import { createAsyncThunk } from '@reduxjs/toolkit'

export const emitStep1 = createAsyncThunk<any, string>('signInPassword/emit/emitStep1', (payload, action) => {
    try {
        return action.fulfillWithValue(payload)
    } catch (e) {
        return action.rejectWithValue(e)
    }
})

export const emitStep2 = createAsyncThunk<any, string[]>('signInPassword/emit/step2', (payload, action) => {
    try {
        return action.fulfillWithValue(payload)
    } catch (e) {
        return action.rejectWithValue(e)
    }
})

export const emitStep3 = createAsyncThunk<any, string>('signInPassword/emit/step3', (payload, action) => {
    try {
        return action.fulfillWithValue(payload)
    } catch (e) {
        return action.rejectWithValue(e)
    }
})
