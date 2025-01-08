// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/redux/titleSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { NotificationState } from './types'

const initialState: NotificationState = {
  enabled : true,
}

export const notifSlice = createSlice({
  name: 'notif',
  initialState,
  reducers: {
    setNotif: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload
    },
  },
})

export const { setNotif } = notifSlice.actions

export default notifSlice.reducer
