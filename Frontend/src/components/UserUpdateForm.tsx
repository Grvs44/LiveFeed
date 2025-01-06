import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { LoginContext } from '../context/LoginProvider'
import { UserInfo } from '../context/types'
import { useUpdateUserDetailsMutation } from '../redux/apiSlice'

export default function UserUpdateForm() {
  const { activeAccount, refreshAccount } = React.useContext(LoginContext)
  const [updateUserDetails] = useUpdateUserDetailsMutation()
  const [feedback, setFeedback] = React.useState({ message: '', error: false })
  const [userDetails, setUserDetails] = React.useState<UserInfo>({
    name: '',
    given_name: '',
    family_name: '',
  })

  React.useEffect(() => {
    if (activeAccount?.idTokenClaims) {
      setUserDetails({
        name: (activeAccount.idTokenClaims.name as string) ?? '',
        given_name: (activeAccount.idTokenClaims.given_name as string) ?? '',
        family_name: (activeAccount.idTokenClaims.family_name as string) ?? '',
      })
    }
  }, [activeAccount])

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
      setFeedback({ message: 'Please fill all fields', error: true })
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
      setFeedback({ message: 'Profile updated successfully', error: false })
      await refreshAccount?.()
    } catch (error) {
      console.error('Failed to update user:', error)
      setFeedback({ message: 'Something went wrong. ', error: true })
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
          <Typography
            variant="body2"
            sx={{
              color: feedback.error ? 'error.main' : 'success.main',
              marginTop: 2,
              textAlign: 'left',
            }}
          >
            {feedback.message}
          </Typography>
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
