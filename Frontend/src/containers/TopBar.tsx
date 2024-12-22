// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/containers/TopBar.tsx
import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useSelector } from 'react-redux'
import MenuDrawer from '../components/MenuDrawer'
import { LoginContext } from '../context/LoginProvider'
import { State } from '../redux/types'

export default function TopBar() {
  const [open, setOpen] = React.useState(false)
  const { title } = useSelector(({ title }: State) => title)
  const { handleLogin, activeAccount } = React.useContext(LoginContext)

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
          {activeAccount ? (
            <Typography
              variant="subtitle1" component="div" sx={{ mr: 2 }}>
              {activeAccount.name}
            </Typography>
            ) : (
            <Typography variant="subtitle1" component="div" sx={{ mr: 2, cursor: 'pointer' }}
              onClick={handleLogin}
            >
              Log In / Sign Up
            </Typography>
            )}
          <IconButton
            aria-label="account"
            color="inherit"
            onClick={handleLogin}
          >
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
