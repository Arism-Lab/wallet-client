import { createAsyncThunk } from '@reduxjs/toolkit'

export const emitStep1 = createAsyncThunk<any, NodeState>(
    'networkFactor/emit/step1',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitStep2 = createAsyncThunk<any, NodeState>(
    'networkFactor/emit/step2',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitStep3 = createAsyncThunk<any, NodeState>(
    'networkFactor/emit/step3',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitStep4 = createAsyncThunk<any, NodeState>(
    'networkFactor/emit/step4',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitStep5 = createAsyncThunk<any, string>(
    'networkFactor/emit/step5',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)
