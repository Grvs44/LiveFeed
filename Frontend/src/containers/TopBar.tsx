import React, { Dispatch, SetStateAction, useState } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu'
import Search from '@mui/icons-material/Search'
import {
  AppBar,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
} from '@mui/material'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/LogoClear.png'
import MenuDrawer from '../components/MenuDrawer'
import { LoginContext } from '../context/LoginProvider'
import { State } from '../redux/types'

interface TopBarProps {
  searchQuery: string
  setSearchQuery: Dispatch<SetStateAction<string>>
}

export default function TopBar({ searchQuery, setSearchQuery }: TopBarProps) {
  const [open, setOpen] = useState(false)
  const [tempQuery, setTempQuery] = useState('') // Temporary query for input
  const { title } = useSelector(({ title }: State) => title)
  const user = useSelector((state: State) => state.user)
  const { handleLogin, activeAccount } = React.useContext(LoginContext)
  const navigate = useNavigate()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tempQuery != '') {
      setSearchQuery(tempQuery) // Apply the filter
      setTempQuery('') // Clear the input field
      navigate('/') // Redirect to the main dashboard (if not already there)
    }
  }

  return (
    <>
      <AppBar position="sticky" style={{ backgroundColor: '#FDA448' }}>
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
          <img
            src={logo}
            alt="Live Feed Logo"
            style={{ width: '100px', marginRight: '10px' }}
          />

          {/* Search Bar */}
          <div
            style={{
              flex: 1,
              marginLeft: '150px',
              marginRight: '450px',
              display: 'flex',
            }}
          >
            <Search style={{ alignSelf: 'center', marginRight: '10px' }} />
            <InputBase
              placeholder="Search"
              value={tempQuery} // Controlled by tempQuery
              onKeyDown={handleKeyDown} // Handle Enter key press
              onChange={(e) => setTempQuery(e.target.value)} // Track user input
              style={{
                backgroundColor: 'white',
                padding: '5px 10px',
                borderRadius: '5px',
                width: '100%',
              }}
            />
          </div>

          {/* User Info */}
          {activeAccount ? (
            <Typography variant="subtitle1" component="div" sx={{ mr: 2 }}>
              {user.displayName}
            </Typography>
          ) : (
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ mr: 2, cursor: 'pointer' }}
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
        setSearchQuery={setSearchQuery}
      />
    </>
  )
}
