import { createSlice } from '@reduxjs/toolkit'

import * as actions from '@store/signInOauthAndPassword/actions'
import { TA } from '@types'

const initialState: {
    data: TA.SignInOauthAndPasswordSteps
    loading: boolean
    error: any
} = {
    data: {
        networkFactorStep1: {
            instruction: {
                name: 'Checking Mainnet Status',
                description: 'Pinging to Validation Nodes to check the Mainnet',
            },
            state: [],
        },
        networkFactorStep2: {
            instruction: {
                name: 'Making Commitments',
                description:
                    'Making Application Commitments from the Application to the Mainnet to encrypt their Master Shares',
            },
            state: [],
        },
        networkFactorStep3: {
            instruction: {
                name: 'Deriving Master Shares',
                description:
                    'Deriving encrypted Master Shares from the Mainnet to the Application',
            },
            state: [],
        },
        networkFactorStep4: {
            instruction: {
                name: 'Decrypting Master Shares',
                description:
                    'Decrypting derived Master Shares on the Application',
            },
            state: [],
        },
        networkFactorStep5: {
            instruction: {
                name: 'Reconstructing Network Key',
                description:
                    'Reconstructing Network Factor by the decrypted Master Shares on the Application',
            },
            state: '',
        },
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
                name: 'Deriving Factors',
                description:
                    'Deriving Private Factor and Device Factor from Network Factor and Recovery Factor on the Application',
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

export const signInOauthAndPassWord = createSlice({
    name: 'signInOauthAndPassWord',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Network Factor step 1 methods
        builder.addCase(actions.emitNetWorkFactorStep1.pending, (state) => {
            state.loading = true
        })
        builder.addCase(
            actions.emitNetWorkFactorStep1.fulfilled,
            (state, action) => {
                if (Array.isArray(state.data.networkFactorStep1.state)) {
                    state.data.networkFactorStep1.state = [
                        ...state.data.networkFactorStep1.state,
                        action.payload,
                    ]
                }
                state.loading = false
                state.error = undefined
            }
        )
        builder.addCase(
            actions.emitNetWorkFactorStep1.rejected,
            (state, action) => {
                state.error = action.payload
                state.loading = false
            }
        )

        // Network Factor step 2 methods
        builder.addCase(actions.emitNetWorkFactorStep2.pending, (state) => {
            state.loading = true
        })
        builder.addCase(
            actions.emitNetWorkFactorStep2.fulfilled,
            (state, action) => {
                if (Array.isArray(state.data.networkFactorStep2.state)) {
                    state.data.networkFactorStep2.state = [
                        ...state.data.networkFactorStep2.state,
                        action.payload,
                    ]
                }
                state.loading = false
                state.error = undefined
            }
        )
        builder.addCase(
            actions.emitNetWorkFactorStep2.rejected,
            (state, action) => {
                state.error = action.payload
                state.loading = false
            }
        )

        // Network Factor step 3 methods
        builder.addCase(actions.emitNetWorkFactorStep3.pending, (state) => {
            state.loading = true
        })
        builder.addCase(
            actions.emitNetWorkFactorStep3.fulfilled,
            (state, action) => {
                if (Array.isArray(state.data.networkFactorStep3.state)) {
                    state.data.networkFactorStep3.state = [
                        ...state.data.networkFactorStep3.state,
                        action.payload,
                    ]
                }
                state.loading = false
                state.error = undefined
            }
        )
        builder.addCase(
            actions.emitNetWorkFactorStep3.rejected,
            (state, action) => {
                state.error = action.payload
                state.loading = false
            }
        )

        // Network Factor step 4 methods
        builder.addCase(actions.emitNetWorkFactorStep4.pending, (state) => {
            state.loading = true
        })
        builder.addCase(
            actions.emitNetWorkFactorStep4.fulfilled,
            (state, action) => {
                if (Array.isArray(state.data.networkFactorStep4.state)) {
                    state.data.networkFactorStep4.state = [
                        ...state.data.networkFactorStep4.state,
                        action.payload,
                    ]
                }
                state.loading = false
                state.error = undefined
            }
        )
        builder.addCase(
            actions.emitNetWorkFactorStep4.rejected,
            (state, action) => {
                state.error = action.payload
                state.loading = false
            }
        )

        // Network Factor step 5 methods
        builder.addCase(actions.emitNetWorkFactorStep5.pending, (state) => {
            state.loading = true
        })
        builder.addCase(
            actions.emitNetWorkFactorStep5.fulfilled,
            (state, action) => {
                state.data.networkFactorStep5.state = action.payload
                state.loading = false
                state.error = undefined
            }
        )
        builder.addCase(
            actions.emitNetWorkFactorStep5.rejected,
            (state, action) => {
                state.error = action.payload
                state.loading = false
            }
        )

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

export default signInOauthAndPassWord.reducer
