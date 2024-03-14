import { createAsyncThunk } from '@reduxjs/toolkit'

import { TA } from '@types'

export const emitNetWorkFactorStep1 = createAsyncThunk<any, TA.NodeState>(
    'signUp/emit/networkFactorStep1',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitNetWorkFactorStep2 = createAsyncThunk<any, TA.NodeState>(
    'signUp/emit/networkFactorStep2',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitNetWorkFactorStep3 = createAsyncThunk<any, TA.NodeState>(
    'signUp/emit/networkFactorStep3',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitNetWorkFactorStep4 = createAsyncThunk<any, TA.NodeState>(
    'signUp/emit/networkFactorStep4',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitNetWorkFactorStep5 = createAsyncThunk<any, string>(
    'signUp/emit/networkFactorStep5',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitPrivateFactorStep1 = createAsyncThunk<any, string>(
    'signUp/emit/privateFactorStep1',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitDeviceFactorStep1 = createAsyncThunk<any, string>(
    'signUp/emit/deviceFactorStep1',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitVerifyStep = createAsyncThunk<any, string>(
    'signUp/emit/verifyStep',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)
