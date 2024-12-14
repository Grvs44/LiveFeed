import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'
import chatReducer from './chatSlice'
import titleReducer from './titleSlice'

export default configureStore({
  reducer: {
    chat: chatReducer,
    title: titleReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})
