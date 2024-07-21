import { createSlice } from '@reduxjs/toolkit'

import * as actions from '@store/signInPassword/actions'

const initialState: {
    data: SignInPasswordSteps
    loading: boolean
    error: any
} = {
    data: [
        {
            instruction: {
                name: 'Reconstructing Recovery Key',
                description:
                    "Reconstructing the Recovery Factor by user's password on the Application",
            },
            state: '',
            passwordInput: true,
        },
        {
            instruction: {
                name: 'Deriving Private Key',
                description:
                    'Deriving Private Factor from Device Factor and Recovery Factor on the Application',
            },
            state: [],
        },
        {
            instruction: {
                name: 'Verifying & Storing Metadata',
                description:
                    'Verifying and Storing information of User and Device from Application to the Metadata Server if valid',
            },
            state: '',
        },
    ],
    loading: false,
    error: undefined,
}

export const signInPassword = createSlice({
    name: 'signInPassword',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Recovery Factor step 1 methods
        builder.addCase(actions.emitStep1.pending, (state) => {
            state.loading = true
        })
        builder.addCase(actions.emitStep1.fulfilled, (state, action) => {
            state.data[0].state = action.payload
            state.loading = false
            state.error = undefined
        })
        builder.addCase(actions.emitStep1.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })

        // Recovery Factor step 2 methods
        builder.addCase(actions.emitStep2.pending, (state) => {
            state.loading = true
        })
        builder.addCase(actions.emitStep2.fulfilled, (state, action) => {
            state.data[1].state = action.payload
            state.loading = false
            state.error = undefined
        })
        builder.addCase(actions.emitStep2.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })

        // Verify storage step methods
        builder.addCase(actions.emitStep3.pending, (state) => {
            state.loading = true
        })
        builder.addCase(actions.emitStep3.fulfilled, (state, action) => {
            state.data[2].state = action.payload
            state.loading = false
            state.error = undefined
        })
        builder.addCase(actions.emitStep3.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })
    },
})

export default signInPassword.reducer
