import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'
import pubsubReducer from './pubsubSlice'
import titleReducer from './titleSlice'
import tokenReducer from './tokenSlice'

export default configureStore({
  reducer: {
    title: titleReducer,
    pubsub: pubsubReducer,
    token: tokenReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['pubsub/setClient'],
        ignoredPaths: ['pubsub.client'],
      },
    }).concat(apiSlice.middleware),
})
