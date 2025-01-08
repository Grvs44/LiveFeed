// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/redux/titleSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserState } from './types'

const loadUserFromStorage = (): UserState => {
  const storedUser = localStorage.getItem('user')
  //console.log(`Stored user is: ${localStorage.getItem('user')}`)
  return storedUser ? JSON.parse(storedUser) : { id: '', displayName: '', givenName: '', familyName: '' }
}

const initialState: UserState = loadUserFromStorage()

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
        state.id = action.payload.id;
        state.displayName = action.payload.displayName;
        state.givenName = action.payload.givenName;
        state.familyName = action.payload.familyName;
        localStorage.setItem('user', JSON.stringify(state))
    },
    clearUser: (state) => {
        state.id = '';
        state.displayName = '';
        state.givenName = '';
        state.familyName = '';
      },
  },
})

export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer
