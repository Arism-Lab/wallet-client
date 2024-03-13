import { createSlice } from '@reduxjs/toolkit'
import * as actions from '@redux/localUsers/actions'

const defaultState = {
    data: [],
    loading: false,
    error: null,
}

export const deriveLocalUsers = createSlice({
    name: 'derive/localUsers',
    initialState: {
        deriveLocalUsers: defaultState,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(actions.deriveLocalUsers.pending, (state) => {
            state.deriveLocalUsers.data = []
            state.deriveLocalUsers.loading = true
        })
        builder.addCase(actions.deriveLocalUsers.fulfilled, (state, action) => {
            state.deriveLocalUsers.data = action.payload
            state.deriveLocalUsers.loading = false
        })
        builder.addCase(actions.deriveLocalUsers.rejected, (state) => {
            state.deriveLocalUsers.data = []
            state.deriveLocalUsers.loading = false
        })
    },
})

export const storeLocalUser = createSlice({
    name: 'store/localUser',
    initialState: {
        storeLocalUser: defaultState,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(actions.storeLocalUser.pending, (state) => {
            state.storeLocalUser.data = []
            state.storeLocalUser.loading = true
        })
        builder.addCase(actions.storeLocalUser.fulfilled, (state, action) => {
            state.storeLocalUser.data = action.payload
            state.storeLocalUser.loading = false
        })
        builder.addCase(actions.storeLocalUser.rejected, (state) => {
            state.storeLocalUser.data = []
            state.storeLocalUser.loading = false
        })
    },
})

export const storeLocalUsers = createSlice({
    name: 'store/localUsers',
    initialState: {
        storeLocalUsers: defaultState,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(actions.storeLocalUsers.pending, (state) => {
            state.storeLocalUsers.data = []
            state.storeLocalUsers.loading = true
        })
        builder.addCase(actions.storeLocalUsers.fulfilled, (state, action) => {
            state.storeLocalUsers.data = action.payload
            state.storeLocalUsers.loading = false
        })
        builder.addCase(actions.storeLocalUsers.rejected, (state) => {
            state.storeLocalUsers.data = []
            state.storeLocalUsers.loading = false
        })
    },
})

export const removeLocalUser = createSlice({
    name: 'remove/localUser',
    initialState: {
        removeLocalUser: defaultState,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(actions.removeLocalUser.pending, (state) => {
            state.removeLocalUser.data = []
            state.removeLocalUser.loading = true
        })
        builder.addCase(actions.removeLocalUser.fulfilled, (state, action) => {
            state.removeLocalUser.data = action.payload
            state.removeLocalUser.loading = false
        })
        builder.addCase(actions.removeLocalUser.rejected, (state) => {
            state.removeLocalUser.data = []
            state.removeLocalUser.loading = false
        })
    },
})

const localUsersReducer = {
    deriveLocalUsers,
    storeLocalUser,
    storeLocalUsers,
    removeLocalUser,
}
export default localUsersReducer
