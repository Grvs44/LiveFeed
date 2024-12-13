import React from 'react'
import { Outlet } from 'react-router-dom'
import TopBar from './containers/TopBar'
import Box from '@mui/material/Box'

export default function App() {
  return (
    <div>
      <TopBar />
      <Box sx={{ my: 4 }}>
        <Outlet />
      </Box>
    </div>
  )
}
