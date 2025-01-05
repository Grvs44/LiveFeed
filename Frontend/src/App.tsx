import React from 'react'
import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import TopBar from './containers/TopBar'
import addNotification, { Notifications } from 'react-push-notification'
import SignalRProvider from './context/SignalRProvider'

export default function App() {
  const onNotification = (notification: string) => {
    addNotification({
      title: 'Notification',
      message: notification,
      theme: 'darkblue',
      native: true
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SignalRProvider
        onNotification={onNotification}
      >
        <Notifications/>
      </SignalRProvider>
      <TopBar />
      <Box sx={{ my: 4 }}>
        <Outlet />
      </Box>
    </div>
  )
}
