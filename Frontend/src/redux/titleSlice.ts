// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/redux/titleSlice.ts
import { createSlice } from '@reduxjs/toolkit'
import { TitleState } from './types'

const initialState: TitleState = {
  title: 'LiveFeed',
}

export const titleSlice = createSlice({
  name: 'title',
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload
      document.title = action.payload
    },
  },
})

export const { setTitle } = titleSlice.actions

export default titleSlice.reducer
