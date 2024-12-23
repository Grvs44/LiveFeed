import React from 'react'
import { useDispatch } from 'react-redux'
import { setTitle } from '../redux/titleSlice'
import { LoginContext } from '../context/LoginProvider';
import { UserInfo } from '../context/types';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import UserUpdateForm from '../components/UserUpdateForm';
import TagsChipArray from '../components/TagsChipArray';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';


export default function SettingsPage() {
  const dispatch = useDispatch()
  const { activeAccount } = React.useContext(LoginContext)
  const [userDetails] = React.useState<UserInfo>({
    name: (activeAccount?.idTokenClaims?.name as string) ?? '',
    given_name: (activeAccount?.idTokenClaims?.given_name as string) ?? '',
    family_name: (activeAccount?.idTokenClaims?.family_name as string) ?? '',
  })
  const [notifications, setNotifications] = React.useState('yes')

  const handleNotificationChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setNotifications(event.target.value)
  };

  React.useEffect(() => {
    dispatch(setTitle('Settings'))
  }, [])

  
  return (<Box sx={{ width: '100%', padding: '10px 30px 30px'  }}>
    <Typography variant="h6" gutterBottom align="center" >
      Manage your details and preferences
    </Typography>
    <UserUpdateForm/>
    <Divider />
    <TagsChipArray/>
    <Divider />

    <Box sx={{ marginTop: '40px' }}>
      <Box sx={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <FormControl component="fieldset">
            <Typography variant="h6" sx={{ fontSize: '1.125rem' }} gutterBottom>
              Email Notifications
            </Typography>
            <RadioGroup
              aria-label="notifications"
              name="notifications"
              value={notifications}
              onChange={handleNotificationChange}
            >
              <FormControlLabel value="yes" control={<Radio/>} label="Yes, send me notifications" />
              <FormControlLabel value="no" control={<Radio/>} label="No, I don't want notifications" />
            </RadioGroup>
          </FormControl>
      </Box>
    </Box>
  </Box>
  );
}
