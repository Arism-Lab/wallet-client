import { createSlice } from '@reduxjs/toolkit'

import { append } from '@libs/array'
import * as actions from '@store/networkFactor/actions'

const initialState: {
    data: NetworkFactorSteps
    loading: boolean
    error: any
} = {
    data: [
        {
            instruction: {
                name: 'Checking Mainnet Status',
                description: `Checking Validation Nodes' health on the Mainnet`,
            },
            state: [],
        },
        {
            instruction: {
                name: 'Initializing Secrets',
                description: 'Initializing Secrets for Validation Nodes on the Mainnet',
            },
            state: [],
        },
        {
            instruction: {
                name: 'Exchanging Commitments',
                description:
                    'Exchanging Commitments between the Application and the Validation Nodes for communication security',
            },
            state: [],
        },
        {
            instruction: {
                name: 'Constructing Master Shares',
                description: 'Constructing encrypted Master Shares from the Mainnet to the Application',
            },
            state: [],
        },
        {
            instruction: {
                name: 'Constructing Network Key',
                description: 'Constructing Network Factor by the decrypted Master Shares on the Application',
            },
            state: '',
        },
    ],
    loading: false,
    error: undefined,
}

export const signInOauth = createSlice({
    name: 'signInOauth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Network Factor step 1 methods
        builder.addCase(actions.emitStep1.pending, (state) => {
            state.loading = true
        })
        builder.addCase(actions.emitStep1.fulfilled, (state, action) => {
            state.data[0].state = append(state.data[0].state, action.payload)
            state.loading = false
            state.error = undefined
        })
        builder.addCase(actions.emitStep1.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })

        // Network Factor step 2 methods
        builder.addCase(actions.emitStep2.pending, (state) => {
            state.loading = true
        })
        builder.addCase(actions.emitStep2.fulfilled, (state, action) => {
            state.data[1].state = append(state.data[1].state, action.payload)
            state.loading = false
            state.error = undefined
        })
        builder.addCase(actions.emitStep2.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })

        // Network Factor step 3 methods
        builder.addCase(actions.emitStep3.pending, (state) => {
            state.loading = true
        })
        builder.addCase(actions.emitStep3.fulfilled, (state, action) => {
            state.data[2].state = append(state.data[2].state, action.payload)
            state.loading = false
            state.error = undefined
        })
        builder.addCase(actions.emitStep3.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })

        // Network Factor step 4 methods
        builder.addCase(actions.emitStep4.pending, (state) => {
            state.loading = true
        })
        builder.addCase(actions.emitStep4.fulfilled, (state, action) => {
            state.data[3].state = append(state.data[3].state, action.payload)
            state.loading = false
            state.error = undefined
        })
        builder.addCase(actions.emitStep4.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })

        // Network Factor step 5 methods
        builder.addCase(actions.emitStep5.pending, (state) => {
            state.loading = true
        })
        builder.addCase(actions.emitStep5.fulfilled, (state, action) => {
            state.data[4].state = action.payload
            state.loading = false
            state.error = undefined
        })
        builder.addCase(actions.emitStep5.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })
    },
})

export default signInOauth.reducer
