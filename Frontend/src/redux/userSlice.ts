// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/redux/titleSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserState } from './types'

const initialState: UserState = {
    id: '',
    displayName: '',
    givenName: '',
    familyName: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
        state.id = action.payload.id;
        state.displayName = action.payload.displayName;
        state.givenName = action.payload.givenName;
        state.familyName = action.payload.familyName;
    },
    clearUser: (state) => {
        state.id = '';
        state.displayName = '';
        state.givenName = '';
        state.familyName = '';
      },
  },
})

export const { setUser } = userSlice.actions

export default userSlice.reducer
