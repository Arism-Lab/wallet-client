import { createAsyncThunk } from '@reduxjs/toolkit'

export const emitNetWorkFactorStep1 = createAsyncThunk<any, NodeState>(
    'signInOauth/emit/networkFactorStep1',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitNetWorkFactorStep2 = createAsyncThunk<any, NodeState>(
    'signInOauth/emit/networkFactorStep2',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitNetWorkFactorStep3 = createAsyncThunk<any, NodeState>(
    'signInOauth/emit/networkFactorStep3',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitNetWorkFactorStep4 = createAsyncThunk<any, NodeState>(
    'signInOauth/emit/networkFactorStep4',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitNetWorkFactorStep5 = createAsyncThunk<any, string>(
    'signInOauth/emit/networkFactorStep5',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitDeviceFactorStep1 = createAsyncThunk<any, string>(
    'signInOauth/emit/deviceFactorStep1',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitPrivateFactorStep1 = createAsyncThunk<any, string>(
    'signInOauth/emit/privateFactorStep1',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitVerifyStep = createAsyncThunk<any, string>(
    'signInOauth/emit/verifyStep',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)
