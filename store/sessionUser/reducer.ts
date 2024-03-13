import { createSlice } from '@reduxjs/toolkit'

import * as actions from '@store/sessionUser/actions'
import { TA } from '@types'

const initialState: {
    data: TA.SessionUser | undefined
    loading: boolean
    error: any
} = {
    data: actions.deriveSessionUser(),
    loading: false,
    error: undefined,
}

export const sessionUser = createSlice({
    name: 'sessionUser',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Storing methods
        builder.addCase(actions.storeSessionUser.pending, (state) => {
            state.loading = true
        })
        builder.addCase(actions.storeSessionUser.fulfilled, (state, action) => {
            state.data = action.payload
            state.loading = false
            state.error = undefined
        })
        builder.addCase(actions.storeSessionUser.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })

        // Removing methods
        builder.addCase(actions.removeSessionUser.pending, (state) => {
            state.loading = true
        })
        builder.addCase(
            actions.removeSessionUser.fulfilled,
            (state, action) => {
                state.data = action.payload
                state.loading = false
                state.error = undefined
            }
        )
        builder.addCase(actions.removeSessionUser.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })
    },
})

export default sessionUser.reducer
