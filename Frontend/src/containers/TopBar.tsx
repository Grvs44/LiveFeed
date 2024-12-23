// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/containers/TopBar.tsx
import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu'
import Search  from '@mui/icons-material/Search'
import { AppBar, Toolbar, Typography, IconButton, InputBase } from '@mui/material'
import { useSelector } from 'react-redux'
import MenuDrawer from '../components/MenuDrawer'
import { LoginContext } from '../context/LoginProvider'
import { State } from '../redux/types'
import logo from '../assets/LogoClear.png'

export default function TopBar() {
  const [open, setOpen] = React.useState(false)
  const { title } = useSelector(({ title }: State) => title)
  const { handleLogin } = React.useContext(LoginContext)

  return (
    <>
      <AppBar position="sticky" style={{ backgroundColor: '#ff5722' }}>
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
          {/* Logo */}
          <img src={logo} alt="Live Feed Logo" style={{ width: '100px', marginRight: '10px' }} />

          {/* Removed "Title" */}
          {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography> */}

          <div style={{ flex: 1, marginLeft: '150px', marginRight: '450px', display: 'flex' }}>
          <Search style={{ alignSelf: 'center', marginRight: '10px' }} />
          <InputBase
            placeholder=" Search"
            style={{
              backgroundColor: 'white',
              padding: '5px 10px',
              borderRadius: '5px',
              width: '100%',
            }}
          />
        </div>
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
