import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import localUsersReducer from '@redux/localUsers/reducer'
import sessionUserReducer from '@redux/sessionUser/reducer'
import tokenReducer from '@redux/token/reducer'

export const store = configureStore({
    reducer: {
        localUsers: localUsersReducer,
        sessionUser: sessionUserReducer,
        token: tokenReducer,
    },
    middleware: (getDefaultMiddleware) => {
        const middleware = getDefaultMiddleware()
        if (process.env.NODE_ENV === 'development') middleware.push(logger)

        return middleware
    },
    devTools: process.env.NODE_ENV !== 'production',
})

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
