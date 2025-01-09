import React, { useState } from 'react'
import Box from '@mui/material/Box'
import toast, { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import MenuDrawer from './components/MenuDrawer'
import TopBar from './containers/TopBar'
import SignalRProvider from './context/SignalRProvider'
import { useGetPreferencesQuery } from './redux/apiSlice'
import { setNotif } from './redux/notifSlice'
import { State } from './redux/types'
import { duration } from '@mui/material'

export default function App() {
  const navigate = useNavigate()

  const onNotification = (notification: string) => {
    console.log('Notification received:', notification)
    toast(notification, {
      duration: 5000,
      position: 'top-right',
    })
  }

  const onStreamNotification = (message: string, recipeId: string) => {
    console.log('Stream notification received:', message)
    toast((t) => (
      <span>
        {message}
        <button className='watchButton' onClick={() => {navigate(`live/${recipeId}`); toast.dismiss(t.id)}}>Watch Live</button>
      </span>
      ), {
      duration: 5000,
      position: 'top-right',
    })
  }

  const [searchQuery, setSearchQuery] = useState('') // Shared state for search

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <TopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <MenuDrawer
        open={false} // Adjust based on your logic
        onClose={() => {}}
        onOpen={() => {}}
        setSearchQuery={setSearchQuery} // Pass the setSearchQuery function
      />
      <Box sx={{ my: 4 }}>
        <SignalRProvider onNotification={onNotification} onStreamNotification={onStreamNotification}>
          <Toaster />
        </SignalRProvider>
        <Outlet context={{ searchQuery, setSearchQuery }} />
      </Box>
    </div>
  )
}
