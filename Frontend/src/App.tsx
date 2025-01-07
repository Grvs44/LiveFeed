import React, { useState } from 'react'
import Box from '@mui/material/Box'
import toast, { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation } from 'react-router-dom'
import MenuDrawer from './components/MenuDrawer'
import TopBar from './containers/TopBar'
import SignalRProvider from './context/SignalRProvider'
import { useGetPreferencesQuery } from './redux/apiSlice'
import { setNotif } from './redux/notifSlice'
import { State } from './redux/types'

export default function App() {
  const notificationsEnabled = useSelector(
    (state: State) => state.notif.enabled,
  )
  const onNotification = (notification: string) => {
    console.log('Notification received:', notification)
    toast(notification, {
      duration: 5000,
      position: 'top-right',
    })
  }

  const [searchQuery, setSearchQuery] = useState('') // Shared state for search

  const dispatch = useDispatch()
  const token = useSelector((state: State) => state.token.token)
  const { data, isLoading } = useGetPreferencesQuery(undefined, {
    skip: token === undefined,
  })

  React.useEffect(() => {
    if (data && data.notifications !== undefined) {
      dispatch(setNotif(data.notifications))
    }
  }, [data, dispatch])

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
        <SignalRProvider onNotification={onNotification}>
          <Toaster />
        </SignalRProvider>
        <Outlet context={{ searchQuery, setSearchQuery }} />
      </Box>
    </div>
  )
}
