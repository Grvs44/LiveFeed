import React from 'react'
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from 'react-redux'
import TagsChipArray from '../components/TagsChipArray'
import UserUpdateForm from '../components/UserUpdateForm'
import { LoginContext } from '../context/LoginProvider'
import { UserInfo } from '../context/types'
import {
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
} from '../redux/apiSlice'
import { setNotif } from '../redux/notifSlice'
import { setTitle } from '../redux/titleSlice'
import { State } from '../redux/types'

export default function SettingsPage() {
  const dispatch = useDispatch()
  const token = useSelector((state: State) => state.token.token)
  const [updatePreferences] = useUpdatePreferencesMutation()
  const { data, isLoading } = useGetPreferencesQuery(undefined, {
    skip: token === undefined,
  })
  const notificationsEnabled = useSelector(
    (state: State) => state.notif.enabled,
  )

  const handleNotificationChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value === 'yes'
    dispatch(setNotif(value))
  }

  React.useEffect(() => {
    dispatch(setTitle('Settings'))
    if (data && data.notifications !== undefined) {
      dispatch(setNotif(data.notifications))
    }
  }, [data, dispatch])

  function handleSaveChanges(): void {
    try {
      updatePreferences({
        notifications: notificationsEnabled,
      })
    } catch (err) {
      console.error('Failed to update preferences:', err)
      alert('Failed to save preferences.')
    }
  }

  return (
    <Box sx={{ width: '100%', padding: '10px 30px 30px' }}>
      <Typography variant="h6" gutterBottom align="center">
        Manage your details and preferences
      </Typography>
      <UserUpdateForm />
      <Divider />
      <TagsChipArray />
      <Divider />

      <Box sx={{ marginTop: '40px' }}>
        <Box
          sx={{
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
          }}
        >
          <FormControl component="fieldset">
            <Typography variant="h6" sx={{ fontSize: '1.125rem' }} gutterBottom>
              Email Notifications
            </Typography>
            <RadioGroup
              aria-label="notifications"
              name="notifications"
              value={notificationsEnabled ? 'yes' : 'no'}
              onChange={handleNotificationChange}
            >
              <FormControlLabel
                value="yes"
                control={<Radio />}
                label="Yes, send me notifications"
              />
              <FormControlLabel
                value="no"
                control={<Radio />}
                label="No, I don't want notifications"
              />
            </RadioGroup>
          </FormControl>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '0px',
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
