import React from 'react'
import BlenderIcon from '@mui/icons-material/Blender'
import BookmarksIcon from '@mui/icons-material/Bookmarks'
import HomeIcon from '@mui/icons-material/Home'
import LiveTvIcon from '@mui/icons-material/LiveTv'
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import SettingsIcon from '@mui/icons-material/Settings'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import SwipeableDrawer, {
  SwipeableDrawerProps,
} from '@mui/material/SwipeableDrawer'
import { LoginContext } from '../context/LoginProvider'
import ListItemButtonLink from './ListItemButtonLink'

interface CustomMenuDrawerProps extends SwipeableDrawerProps {
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}

export default function MenuDrawer(props: CustomMenuDrawerProps) {
  const { handleLogout, activeAccount } = React.useContext(LoginContext)
  console.log('handleLogout in MenuDrawer:', handleLogout)

  // Handler to reset the search query
  const handleTabSwitch = () => {
    props.setSearchQuery('') // Reset searchQuery whenever a tab is switched
  }

  return (
    <SwipeableDrawer anchor="left" {...props}>
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="space-between"
      >
        <List onClick={props.onClose}>
          <ListItem>
            <ListItemButtonLink to="" onClick={handleTabSwitch}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText>Home</ListItemText>
            </ListItemButtonLink>
          </ListItem>
          <ListItem>
            <ListItemButtonLink to="live" onClick={handleTabSwitch}>
              <ListItemIcon>
                <LiveTvIcon />
              </ListItemIcon>
              <ListItemText>Live</ListItemText>
            </ListItemButtonLink>
          </ListItem>
          <ListItem>
            <ListItemButtonLink to="ondemand" onClick={handleTabSwitch}>
              <ListItemIcon>
                <OndemandVideoIcon />
              </ListItemIcon>
              <ListItemText>On-demand</ListItemText>
            </ListItemButtonLink>
          </ListItem>
          <ListItem>
            <ListItemButtonLink to="upcoming" onClick={handleTabSwitch}>
              <ListItemIcon>
                <RestaurantIcon />
              </ListItemIcon>
              <ListItemText>Upcoming Recipe</ListItemText>
            </ListItemButtonLink>
          </ListItem>
          <ListItem>
            <ListItemButtonLink to="saved" onClick={handleTabSwitch}>
              <ListItemIcon>
                <BookmarksIcon />
              </ListItemIcon>
              <ListItemText>Saved</ListItemText>
            </ListItemButtonLink>
          </ListItem>
          <ListItem>
            <ListItemButtonLink to="recipes" onClick={handleTabSwitch}>
              <ListItemIcon>
                <BlenderIcon />
              </ListItemIcon>
              <ListItemText>Recipe Manager</ListItemText>
            </ListItemButtonLink>
          </ListItem>
          <Divider component="li" />
          {activeAccount && (
            <ListItem>
              <ListItemButtonLink to="settings" onClick={handleTabSwitch}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </ListItemButtonLink>
            </ListItem>
          )}
        </List>
        <Box p={2}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleLogout}
            sx={{
              backgroundColor: '#FDA448',
              '&:hover': {
                backgroundColor: '#D48936', // Slightly darker shade for hover effect
              },
            }}
          >
            Log Out
          </Button>
        </Box>
      </Box>
    </SwipeableDrawer>
  )
}
