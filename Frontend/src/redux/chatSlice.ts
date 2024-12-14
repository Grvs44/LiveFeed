import { createSlice } from '@reduxjs/toolkit'
import { ChatState } from './types'

const initialState: ChatState = {
  chats:[],
  clientReady:false,
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setClientReady: (state, action) => {
      console.log('setclientready')
      console.log(action)
      state.clientReady = action.payload
    },
  },
})

export const { setClientReady } = chatSlice.actions

export default chatSlice.reducer
