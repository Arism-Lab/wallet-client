import { configureStore } from '@reduxjs/toolkit'
import signInPasswordReducer from '@store/signInPassword/reducer'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import logger from 'redux-logger'

import localUsersReducer from '@store/localUsers/reducer'
import sessionUserReducer from '@store/sessionUser/reducer'
import signInOauthReducer from '@store/signInOauth/reducer'
import signInOauthAndPasswordReducer from '@store/signInOauthAndPassword/reducer'
import signUpReducer from '@store/signUp/reducer'
import tokenReducer from '@store/token/reducer'

export const store = configureStore({
    reducer: {
        localUsersReducer,
        sessionUserReducer,
        tokenReducer,
        signInOauthReducer,
        signInOauthAndPasswordReducer,
        signInPasswordReducer,
        signUpReducer,
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
