import { createSlice } from '@reduxjs/toolkit'

import * as actions from '@store/signInPassword/actions'
import { TA } from '@types'

const initialState: {
    data: TA.SignInPasswordSteps
    loading: boolean
    error: any
} = {
    data: {
        recoveryFactorStep1: {
            instruction: {
                name: 'Reconstructing Recovery Key',
                description:
                    "Reconstructing the Recovery Factor by user's password on the Application",
            },
            state: '',
            passwordInput: true,
        },
        recoveryFactorStep2: {
            instruction: {
                name: 'Deriving Private Key',
                description:
                    'Deriving Private Factor from Device Factor and Recovery Factor on the Application',
            },
            state: [],
        },
        verifyStep: {
            instruction: {
                name: 'Verifying & Storing Metadata',
                description:
                    'Verifying and Storing information of User and Device from Application to the Metadata Server if valid',
            },
            state: '',
        },
    },
    loading: false,
    error: undefined,
}

export const signInPassword = createSlice({
    name: 'signInPassword',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Recovery Factor step 1 methods
        builder.addCase(actions.emitRecoveryFactorStep1.pending, (state) => {
            state.loading = true
        })
        builder.addCase(
            actions.emitRecoveryFactorStep1.fulfilled,
            (state, action) => {
                state.data.recoveryFactorStep1.state = action.payload
                state.loading = false
                state.error = undefined
            }
        )
        builder.addCase(
            actions.emitRecoveryFactorStep1.rejected,
            (state, action) => {
                state.error = action.payload
                state.loading = false
            }
        )

        // Recovery Factor step 2 methods
        builder.addCase(actions.emitRecoveryFactorStep2.pending, (state) => {
            state.loading = true
        })
        builder.addCase(
            actions.emitRecoveryFactorStep2.fulfilled,
            (state, action) => {
                state.data.recoveryFactorStep2.state = action.payload
                state.loading = false
                state.error = undefined
            }
        )
        builder.addCase(
            actions.emitRecoveryFactorStep2.rejected,
            (state, action) => {
                state.error = action.payload
                state.loading = false
            }
        )

        // Verify storage step methods
        builder.addCase(actions.emitVerifyStep.pending, (state) => {
            state.loading = true
        })
        builder.addCase(actions.emitVerifyStep.fulfilled, (state, action) => {
            state.data.verifyStep.state = action.payload
            state.loading = false
            state.error = undefined
        })
        builder.addCase(actions.emitVerifyStep.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })
    },
})

export default signInPassword.reducer
