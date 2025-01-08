import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'
import pubsubReducer from './pubsubSlice'
import titleReducer from './titleSlice'
import tokenReducer from './tokenSlice'
import tagsReducer from './tagsSlice'
import userReducer from './userSlice'
import notifsReducer from './notifSlice'

export default configureStore({
  reducer: {
    title: titleReducer,
    pubsub: pubsubReducer,
    token: tokenReducer,
    tags: tagsReducer,
    notif : notifsReducer,
    user: userReducer,
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
