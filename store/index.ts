'use client'

import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import logger from 'redux-logger'

import networkFactorReducer from '@store/networkFactor/reducer'
import signInOauthReducer from '@store/signInOauth/reducer'
import signInOauthAndPasswordReducer from '@store/signInOauthAndPassword/reducer'
import signInPasswordReducer from '@store/signInPassword/reducer'
import signUpReducer from '@store/signUp/reducer'

export const store = configureStore({
    reducer: {
        signInOauthReducer,
        signInOauthAndPasswordReducer,
        signInPasswordReducer,
        signUpReducer,
        networkFactorReducer,
    },
    middleware: (getDefaultMiddleware) => {
        const middleware = getDefaultMiddleware()
        if (process.env.NODE_ENV === 'development') middleware.push(logger)

        return middleware
    },
    devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
