import { createSlice } from '@reduxjs/toolkit'

import * as actions from '@store/sessionUser/actions'

const defaultState = {
    data: [],
    loading: false,
    error: null,
}

export const deriveSessionUser = createSlice({
    name: 'derive/sessionUser',
    initialState: {
        deriveSessionUser: defaultState,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(actions.deriveSessionUser.pending, (state) => {
            state.deriveSessionUser.data = []
            state.deriveSessionUser.loading = true
        })
        builder.addCase(
            actions.deriveSessionUser.fulfilled,
            (state, action) => {
                state.deriveSessionUser.data = action.payload
                state.deriveSessionUser.loading = false
            }
        )
        builder.addCase(actions.deriveSessionUser.rejected, (state) => {
            state.deriveSessionUser.data = []
            state.deriveSessionUser.loading = false
        })
    },
})

export const storeSessionUser = createSlice({
    name: 'store/sessionUser',
    initialState: {
        storeSessionUser: defaultState,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(actions.storeSessionUser.pending, (state) => {
            state.storeSessionUser.data = []
            state.storeSessionUser.loading = true
        })
        builder.addCase(actions.storeSessionUser.fulfilled, (state, action) => {
            state.storeSessionUser.data = action.payload
            state.storeSessionUser.loading = false
        })
        builder.addCase(actions.storeSessionUser.rejected, (state) => {
            state.storeSessionUser.data = []
            state.storeSessionUser.loading = false
        })
    },
})

export const removeSessionUser = createSlice({
    name: 'remove/sessionUser',
    initialState: {
        removeSessionUser: defaultState,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(actions.removeSessionUser.pending, (state) => {
            state.removeSessionUser.data = []
            state.removeSessionUser.loading = true
        })
        builder.addCase(
            actions.removeSessionUser.fulfilled,
            (state, action) => {
                state.removeSessionUser.data = action.payload
                state.removeSessionUser.loading = false
            }
        )
        builder.addCase(actions.removeSessionUser.rejected, (state) => {
            state.removeSessionUser.data = []
            state.removeSessionUser.loading = false
        })
    },
})

const sessionUser = {
    deriveSessionUserReducer: deriveSessionUser.reducer,
    storeSessionUserReducer: storeSessionUser.reducer,
    removeSessionUserReducer: removeSessionUser.reducer,
}
export default sessionUser
