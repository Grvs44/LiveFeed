import React from 'react'
import { LoginContext } from '../context/LoginProvider';
import { UserInfo } from '../context/types';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function UserUpdateForm() {
    const { activeAccount } = React.useContext(LoginContext);
    const [userDetails, setUserDetails] = React.useState<UserInfo>({
      name: '',
      given_name: '',
      family_name: '',
    });
  
    React.useEffect(() => {
      if (activeAccount?.idTokenClaims) {
        setUserDetails({
          name: (activeAccount.idTokenClaims.name as string) ?? '',
          given_name: (activeAccount.idTokenClaims.given_name as string) ?? '',
          family_name: (activeAccount.idTokenClaims.family_name as string) ?? '',
        });
      }
    }, [activeAccount]);

    return (
    <Box sx={{ marginBottom: '40px' }}>
      <Box sx={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <Typography variant="h6" sx={{ fontSize: '1.125rem' }} gutterBottom>
        Your Details
      </Typography>
        <form>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
              fullWidth 
              label="Display Name" 
              variant="outlined"
              value={userDetails.name}
              //onChange={(e) => setName(e.target.value)}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField 
                fullWidth 
                label="First Name" 
                variant="outlined" 
                value={userDetails.given_name}
              />
              <TextField 
                fullWidth 
                label="Surname" 
                variant="outlined"
                value={userDetails.family_name}
              />
            </Box>
          </Box>
          <Box sx={{ marginTop: 3, textAlign: 'right' }}>
            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
    );
  }