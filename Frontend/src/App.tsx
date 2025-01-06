import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Outlet, useLocation } from 'react-router-dom';
import TopBar from './containers/TopBar';
import MenuDrawer from './components/MenuDrawer';
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

  const [searchQuery, setSearchQuery] = useState(''); // Shared state for search

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <MenuDrawer
        open={false} // Adjust based on your logic
        onClose={() => {}}
        onOpen={() => {}}
        setSearchQuery={setSearchQuery} // Pass the setSearchQuery function
      />
      <Box sx={{ my: 4 }}>
        <SignalRProvider
          onNotification={onNotification}
        >
          <Notifications position='top-right'/>
        </SignalRProvider>
        <Outlet context={{ searchQuery, setSearchQuery }} />
      </Box>
    </div>
  );
}
