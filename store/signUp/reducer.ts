import { createSlice } from '@reduxjs/toolkit'

import * as actions from '@store/signUp/actions'
import { TA } from '@types'

const initialState: {
    data: TA.SignUpSteps
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
                    'Reconstructing Network Key by the decrypted Master Shares on the Application',
            },
            state: '',
        },
        privateFactorStep1: {
            instruction: {
                name: 'Creating Private Key',
                description:
                    "Randomly generating a Private Key or using user's existed Private Key on the Application",
            },
            state: '',
            privateKeyInput: true,
        },
        deviceFactorStep1: {
            instruction: {
                name: 'Creating Device Key',
                description:
                    'Randomly generating a Device Factor on the Application',
            },
            state: '',
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

export const signUp = createSlice({
    name: 'signUp',
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

        // Private Factor step 1 methods
        builder.addCase(actions.emitPrivateFactorStep1.pending, (state) => {
            state.loading = true
        })
        builder.addCase(
            actions.emitPrivateFactorStep1.fulfilled,
            (state, action) => {
                state.data.privateFactorStep1.state = action.payload
                state.loading = false
                state.error = undefined
            }
        )
        builder.addCase(
            actions.emitPrivateFactorStep1.rejected,
            (state, action) => {
                state.error = action.payload
                state.loading = false
            }
        )

        // Device Factor step 1 methods
        builder.addCase(actions.emitDeviceFactorStep1.pending, (state) => {
            state.loading = true
        })
        builder.addCase(
            actions.emitDeviceFactorStep1.fulfilled,
            (state, action) => {
                state.data.deviceFactorStep1.state = action.payload
                state.loading = false
                state.error = undefined
            }
        )
        builder.addCase(
            actions.emitDeviceFactorStep1.rejected,
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

export default signUp.reducer
