// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/redux/titleSlice.ts
import { createSlice } from '@reduxjs/toolkit'
import { PubsubState } from './types'

const initialState: PubsubState = {}

export const pubsubSlice = createSlice({
  name: 'pubsub',
  initialState,
  reducers: {
    setClient(state, action: { payload: PubsubState['client'] }) {
      state.client?.stop()
      state.client = action.payload
    },
    resetClient(state) {
      state.client?.stop()
      state.client = undefined
    },
  },
})

export const { setClient, resetClient } = pubsubSlice.actions

export default pubsubSlice.reducer
