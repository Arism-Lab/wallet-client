import { createSlice } from '@reduxjs/toolkit'
import { TokenSet } from 'next-auth'

import * as actions from '@store/token/actions'

const initialState: {
    data: TokenSet | undefined
    loading: boolean
    error: any
} = {
    data: undefined,
    loading: false,
    error: {},
}

export const token = createSlice({
    name: 'token',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Deriving methods
        builder.addCase(actions.deriveToken.pending, (state) => {
            state.loading = true
        })
        builder.addCase(actions.deriveToken.fulfilled, (state, action) => {
            state.data = action.payload
            state.loading = false
        })
        builder.addCase(actions.deriveToken.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })

        builder.addCase(actions.storeToken.pending, (state) => {
            state.loading = true
        })
        builder.addCase(actions.storeToken.fulfilled, (state, action) => {
            state.data = action.payload
            state.loading = false
        })
        builder.addCase(actions.storeToken.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })

        // Removing methods
        builder.addCase(actions.removeToken.pending, (state) => {
            state.loading = true
        })
        builder.addCase(actions.removeToken.fulfilled, (state, action) => {
            state.data = action.payload
            state.loading = false
        })
        builder.addCase(actions.removeToken.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })
    },
})

export default token.reducer
