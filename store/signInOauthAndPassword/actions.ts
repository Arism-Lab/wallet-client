import { createAsyncThunk } from '@reduxjs/toolkit'

import { TA } from '@types'

export const emitNetWorkFactorStep1 = createAsyncThunk<any, TA.NodeState>(
    'signInOauthAndPassWord/emit/networkFactorStep1',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitNetWorkFactorStep2 = createAsyncThunk<any, TA.NodeState>(
    'signInOauthAndPassWord/emit/networkFactorStep2',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitNetWorkFactorStep3 = createAsyncThunk<any, TA.NodeState>(
    'signInOauthAndPassWord/emit/networkFactorStep3',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitNetWorkFactorStep4 = createAsyncThunk<any, TA.NodeState>(
    'signInOauthAndPassWord/emit/networkFactorStep4',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitNetWorkFactorStep5 = createAsyncThunk<any, string>(
    'signInOauthAndPassWord/emit/networkFactorStep5',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitRecoveryFactorStep1 = createAsyncThunk<any, string>(
    'signInOauthAndPassWord/emit/recoveryFactorStep1',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitRecoveryFactorStep2 = createAsyncThunk<any, string[]>(
    'signInOauthAndPassWord/emit/recoveryFactorStep2',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const emitVerifyStep = createAsyncThunk<any, string>(
    'signInOauthAndPassWord/emit/verifyStep',
    async (payload, action) => {
        try {
            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)
