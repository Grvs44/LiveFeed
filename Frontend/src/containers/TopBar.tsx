// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/containers/TopBar.tsx
import React from 'react'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import MenuDrawer from '../components/MenuDrawer'
import { useSelector } from 'react-redux'
import { State } from '../redux/types'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { loginRequest, b2cPolicies } from '../auth/authConfig';

export default function TopBar() {
  const [open, setOpen] = React.useState(false)
  const { title } = useSelector(({ title }: State) => title)
  const { instance, inProgress } = useMsal();
  let activeAccount;

  if (instance) {
      activeAccount = instance.getActiveAccount();
  }
  
  const handleLoginRedirect = () => {
      instance.loginRedirect(loginRequest).catch((error) => console.log(error));
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton aria-label="account" color="inherit" onClick={handleLoginRedirect}>
            <Typography variant="body2" sx={{ marginRight: 1 }}>
            {activeAccount?.username || "Guest"}
            </Typography>
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <MenuDrawer
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      />
    </>
  )
}
