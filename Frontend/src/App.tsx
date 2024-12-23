import React from 'react'
import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import TopBar from './containers/TopBar'

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar />
      <Box sx={{ my: 4 }}>
        <Outlet />
      </Box>
    </div>
  )
}
