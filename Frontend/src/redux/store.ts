import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'
import pubsubReducer from './pubsubSlice'
import titleReducer from './titleSlice'

export default configureStore({
  reducer: {
    title: titleReducer,
    pubsub: pubsubReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})
