import React from 'react'
import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import TopBar from './containers/TopBar'
import addNotification, { Notifications } from 'react-push-notification'
import SignalRProvider from './context/SignalRProvider'

export default function App() {
  const onNotification = (notification: string) => {
    console.log("Notification received:", notification)
    addNotification({
      title: 'Notification',
      message: notification,
      theme: 'darkblue',
      native: false
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar />
      <Box sx={{ my: 4 }}>
        <SignalRProvider
          onNotification={onNotification}
        >
          <Notifications position='top-right'/>
        </SignalRProvider>
        <Outlet />
      </Box>
    </div>
  )
}
