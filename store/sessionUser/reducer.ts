import { createSlice } from '@reduxjs/toolkit'

import * as actions from '@store/sessionUser/actions'
import { TA } from '@types'

const initialState: {
    data: TA.SessionUser | undefined
    loading: boolean
    error: any
} = {
    data: undefined,
    loading: false,
    error: {},
}

export const sessionUser = createSlice({
    name: 'sessionUser',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(actions.deriveSessionUser.pending, (state) => {
            state.loading = true
        })
        builder.addCase(
            actions.deriveSessionUser.fulfilled,
            (state, action) => {
                state.data = action.payload
                state.loading = false
            }
        )
        builder.addCase(actions.deriveSessionUser.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })

        builder.addCase(actions.storeSessionUser.pending, (state) => {
            state.loading = true
        })
        builder.addCase(actions.storeSessionUser.fulfilled, (state, action) => {
            state.data = action.payload
            state.loading = false
        })
        builder.addCase(actions.storeSessionUser.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })

        builder.addCase(actions.removeSessionUser.pending, (state) => {
            state.loading = true
        })
        builder.addCase(
            actions.removeSessionUser.fulfilled,
            (state, action) => {
                state.data = action.payload
                state.loading = false
            }
        )
        builder.addCase(actions.removeSessionUser.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })
    },
})

export default sessionUser.reducer
