import { createSlice } from '@reduxjs/toolkit'
import * as actions from '@redux/token/actions'

const defaultState = {
    data: [],
    loading: false,
    error: null,
}

export const deriveToken = createSlice({
    name: 'derive/token',
    initialState: {
        deriveToken: defaultState,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(actions.deriveToken.pending, (state) => {
            state.deriveToken.data = []
            state.deriveToken.loading = true
        })
        builder.addCase(actions.deriveToken.fulfilled, (state, action) => {
            state.deriveToken.data = action.payload
            state.deriveToken.loading = false
        })
        builder.addCase(actions.deriveToken.rejected, (state) => {
            state.deriveToken.data = []
            state.deriveToken.loading = false
        })
    },
})

export const storeToken = createSlice({
    name: 'store/sessionUser',
    initialState: {
        storeToken: defaultState,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(actions.storeToken.pending, (state) => {
            state.storeToken.data = []
            state.storeToken.loading = true
        })
        builder.addCase(actions.storeToken.fulfilled, (state, action) => {
            state.storeToken.data = action.payload
            state.storeToken.loading = false
        })
        builder.addCase(actions.storeToken.rejected, (state) => {
            state.storeToken.data = []
            state.storeToken.loading = false
        })
    },
})

export const removeToken = createSlice({
    name: 'remove/token',
    initialState: {
        removeToken: defaultState,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(actions.removeToken.pending, (state) => {
            state.removeToken.data = []
            state.removeToken.loading = true
        })
        builder.addCase(actions.removeToken.fulfilled, (state, action) => {
            state.removeToken.data = action.payload
            state.removeToken.loading = false
        })
        builder.addCase(actions.removeToken.rejected, (state) => {
            state.removeToken.data = []
            state.removeToken.loading = false
        })
    },
})

const tokenReducer = {
    deriveToken,
    storeToken,
    removeToken,
}
export default tokenReducer
