import { createSlice } from '@reduxjs/toolkit'

import * as actions from '@store/localUsers/actions'
import { TA } from '@types'

const initialState: {
    data: TA.LocalUser[]
    loading: boolean
    error: any
} = {
    data: actions.deriveLocalUsers(),
    loading: false,
    error: undefined,
}

export const localUsers = createSlice({
    name: 'localUsers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Storing methods
        builder.addCase(actions.storeLocalUser.pending, (state) => {
            state.loading = true
        })
        builder.addCase(actions.storeLocalUser.fulfilled, (state, action) => {
            state.data = action.payload
            state.loading = false
            state.error = undefined
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
            state.error = undefined
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
            state.error = undefined
        })
        builder.addCase(actions.removeLocalUser.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })
    },
})

export default localUsers.reducer
