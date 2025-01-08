import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from 'react-redux'
import { LoginContext } from '../context/LoginProvider'
import { UserInfo } from '../context/types'
import { useUpdateUserDetailsMutation } from '../redux/apiSlice'
import { State } from '../redux/types'
import { setUser } from '../redux/userSlice'

export default function UserUpdateForm() {
  const user = useSelector((state: State) => state.user) // Get user details from Redux
  const { activeAccount } = React.useContext(LoginContext)
  const [updateUserDetails] = useUpdateUserDetailsMutation()
  const [userDetails, setUserDetails] = React.useState<UserInfo>({
    name: user.displayName ?? '',
    given_name: user.givenName ?? '',
    family_name: user.familyName ?? '',
  })

  React.useEffect(() => {
    setUserDetails(() => ({
      name: user.displayName ?? '',
      given_name: user.givenName ?? '',
      family_name: user.familyName ?? '',
    }))
  }, [user])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation check
    if (
      !userDetails.name ||
      !userDetails.given_name ||
      !userDetails.family_name
    ) {
      return
    }
    try {
      const result = await updateUserDetails({
        id: activeAccount?.localAccountId, // B2C User ID
        displayName: userDetails.name,
        givenName: userDetails.given_name,
        familyName: userDetails.family_name,
      }).unwrap()

      console.log('User updated successfully:', result)
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  return (
    <Box sx={{ marginBottom: '40px' }}>
      <Box
        sx={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}
      >
        <Typography variant="h6" sx={{ fontSize: '1.125rem' }} gutterBottom>
          Your Details
        </Typography>
        <form>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Display Name"
              variant="outlined"
              name="name"
              value={userDetails.name}
              onChange={handleInput}
              required
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                name="given_name"
                value={userDetails.given_name}
                onChange={handleInput}
                required
              />
              <TextField
                fullWidth
                label="Surname"
                variant="outlined"
                name="family_name"
                value={userDetails.family_name}
                onChange={handleInput}
                required
              />
            </Box>
          </Box>
          <Box sx={{ marginTop: 3, textAlign: 'right' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Update
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
}
