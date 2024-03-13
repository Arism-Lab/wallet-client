import { createAsyncThunk } from '@reduxjs/toolkit'

import { serializeFactor } from '@libs/serializer'
import { TA } from '@types'

export const deriveLocalUsers = (): TA.LocalUser[] => {
    try {
        return JSON.parse(window.localStorage.getItem('localUsers')!)
            .map((e: any) => {
                return {
                    info: e.info,
                    deviceFactor: serializeFactor(e.deviceFactor),
                    lastLogin: e.lastLogin,
                }
            })
            .sort(
                (a: TA.LocalUser, b: TA.LocalUser) =>
                    new Date(b.lastLogin).getTime() -
                    new Date(a.lastLogin).getTime()
            )
    } catch {
        return []
    }
}

export const storeLocalUser = createAsyncThunk<any, TA.LocalUser>(
    'store/localUser',
    async (payload, action) => {
        try {
            const localUsers: TA.LocalUser[] = deriveLocalUsers()

            const index = localUsers.findIndex(
                (e) => e.info.email === payload.info.email
            )

            if (index !== -1) {
                localUsers[index] = payload
            } else {
                localUsers.push(payload)
            }

            window.localStorage.setItem(
                'localUsers',
                JSON.stringify(localUsers)
            )

            return action.fulfillWithValue(localUsers)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const storeLocalUsers = createAsyncThunk<any, TA.LocalUser>(
    'store/localUsers',
    async (payload, action) => {
        try {
            window.localStorage.setItem('localUsers', JSON.stringify(payload))

            return action.fulfillWithValue(payload)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)

export const removeLocalUser = createAsyncThunk<any, string>(
    'remove/localUser',
    async (payload, action) => {
        try {
            const localUsers: TA.LocalUser[] = deriveLocalUsers()

            const index = localUsers.findIndex((m) => m.info.email === payload)

            localUsers.splice(index, 1)

            window.localStorage.setItem(
                'localUsers',
                JSON.stringify(localUsers)
            )

            return action.fulfillWithValue(undefined)
        } catch (e) {
            return action.rejectWithValue(e)
        }
    }
)
