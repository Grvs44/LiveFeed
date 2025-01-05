import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Outlet, useLocation } from 'react-router-dom';
import TopBar from './containers/TopBar';
import MenuDrawer from './components/MenuDrawer';

export default function App() {
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
        <Outlet context={{ searchQuery, setSearchQuery }} />
      </Box>
    </div>
  );
}
