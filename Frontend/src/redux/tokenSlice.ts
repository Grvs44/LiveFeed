import { createSlice } from '@reduxjs/toolkit'
import { TokenState } from './types'

const initialState: TokenState = {}

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setToken(state, action: { payload: TokenState['token'] }) {
      state.token = action.payload
    },
  },
})

export const { setToken } = tokenSlice.actions

export default tokenSlice.reducer
