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


export default function SettingsPage() {
  const dispatch = useDispatch()
  const { activeAccount } = React.useContext(LoginContext);
  const [userDetails] = React.useState<UserInfo>({
    name: (activeAccount?.idTokenClaims?.name as string) ?? '',
    given_name: (activeAccount?.idTokenClaims?.given_name as string) ?? '',
    family_name: (activeAccount?.idTokenClaims?.family_name as string) ?? '',
  });

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
      <Typography variant="h6" sx={{ fontSize: '1.125rem' }} gutterBottom>
        Notifications
      </Typography>
      <Box sx={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        {/* Need to add content */}
      </Box>
    </Box>
  </Box>
  );
}
