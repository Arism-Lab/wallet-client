import { createAsyncThunk } from '@reduxjs/toolkit'

import { serializeFactor } from '@libs/serializer'
import { TA } from '@types'

export const deriveLocalUsers = createAsyncThunk<any, void>(
    'derive/localUsers',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const localUsers: TA.LocalUser[] = JSON.parse(
                window.localStorage.getItem('localUsers') || '[]'
            ).map((e: any) => {
                return {
                    info: e.info,
                    deviceFactor: serializeFactor(e.deviceFactor),
                    lastLogin: e.lastLogin,
                }
            })

            return fulfillWithValue(localUsers)
        } catch {
            return rejectWithValue(null)
        }
    }
)

export const storeLocalUser = createAsyncThunk<any, TA.LocalUser>(
    'store/localUser',
    async (payload, _) => {
        const localUsers: TA.LocalUser[] = JSON.parse(
            window.localStorage.getItem('localUsers') || '[]'
        )

        const index = localUsers.findIndex(
            (e) => e.info.email === payload.info.email
        )

        if (index !== -1) {
            localUsers[index] = payload
        } else {
            localUsers.push(payload)
        }

        window.localStorage.setItem('localUsers', JSON.stringify(localUsers))
    }
)

export const storeLocalUsers = createAsyncThunk<any, TA.LocalUser>(
    'store/localUsers',
    async (payload, _) => {
        window.localStorage.setItem('localUsers', JSON.stringify(payload))
    }
)

export const removeLocalUser = createAsyncThunk<any, string>(
    'remove/localUser',
    async (payload, _) => {
        const localUsers: TA.LocalUser[] = JSON.parse(
            window.localStorage.getItem('localUsers') || '[]'
        )

        const index = localUsers.findIndex((m) => m.info.email === payload)

        localUsers.splice(index, 1)

        window.localStorage.setItem('localUsers', JSON.stringify(localUsers))
    }
)
