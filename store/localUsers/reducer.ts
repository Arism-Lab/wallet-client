import { createSlice } from '@reduxjs/toolkit'

import * as actions from '@store/localUsers/actions'
import { TA } from '@types'

const initialState: {
    data: TA.LocalUser[]
    loading: boolean
    error: any
} = {
    data: [],
    loading: false,
    error: {},
}

export const localUsers = createSlice({
    name: 'localUsers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Deriving methods
        builder.addCase(actions.deriveLocalUsers.pending, (state) => {
            state.loading = true
        })
        builder.addCase(actions.deriveLocalUsers.fulfilled, (state, action) => {
            state.data = action.payload
            state.loading = false
        })
        builder.addCase(actions.deriveLocalUsers.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })

        // Storing methods
        builder.addCase(actions.storeLocalUser.pending, (state) => {
            state.loading = true
        })
        builder.addCase(actions.storeLocalUser.fulfilled, (state, action) => {
            state.data = action.payload
            state.loading = false
        })
        builder.addCase(actions.storeLocalUser.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })

        // Storing methods
        builder.addCase(actions.storeLocalUsers.pending, (state) => {
            state.loading = true
        })
        builder.addCase(actions.storeLocalUsers.fulfilled, (state, action) => {
            state.data = action.payload
            state.loading = false
        })
        builder.addCase(actions.storeLocalUsers.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })

        // Removing methods
        builder.addCase(actions.removeLocalUser.pending, (state) => {
            state.loading = true
        })
        builder.addCase(actions.removeLocalUser.fulfilled, (state, action) => {
            state.data = action.payload
            state.loading = false
        })
        builder.addCase(actions.removeLocalUser.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })
    },
})

export default localUsers.reducer
