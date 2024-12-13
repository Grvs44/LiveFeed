// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/components/MenuDrawer.tsx
import React from 'react'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemButtonLink from './ListItemButtonLink'
import ListItemIcon from '@mui/material/ListItemIcon'
import SwipeableDrawer, {
  SwipeableDrawerProps,
} from '@mui/material/SwipeableDrawer'
import HomeIcon from '@mui/icons-material/Home'
import LiveTvIcon from '@mui/icons-material/LiveTv'
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo'
import BookmarksIcon from '@mui/icons-material/Bookmarks'
import BlenderIcon from '@mui/icons-material/Blender'
import SettingsIcon from '@mui/icons-material/Settings'

export default function MenuDrawer(props: SwipeableDrawerProps) {
  return (
    <SwipeableDrawer anchor="left" {...props}>
      <List onClick={props.onClose}>
        <ListItem>
          <ListItemButtonLink to="">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText>Home</ListItemText>
          </ListItemButtonLink>
        </ListItem>
        <ListItem>
          <ListItemButtonLink to="live">
            <ListItemIcon>
              <LiveTvIcon />
            </ListItemIcon>
            <ListItemText>Live</ListItemText>
          </ListItemButtonLink>
        </ListItem>
        <ListItem>
          <ListItemButtonLink to="ondemand">
            <ListItemIcon>
              <OndemandVideoIcon />
            </ListItemIcon>
            <ListItemText>On-demand</ListItemText>
          </ListItemButtonLink>
        </ListItem>
        <ListItem>
          <ListItemButtonLink to="saved">
            <ListItemIcon>
              <BookmarksIcon />
            </ListItemIcon>
            <ListItemText>Saved</ListItemText>
          </ListItemButtonLink>
        </ListItem>
        <ListItem>
          <ListItemButtonLink to="recipes">
            <ListItemIcon>
              <BlenderIcon />
            </ListItemIcon>
            <ListItemText>Recipe Manager</ListItemText>
          </ListItemButtonLink>
        </ListItem>
        <Divider component="li" />
        <ListItem>
          <ListItemButtonLink to="settings">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </ListItemButtonLink>
        </ListItem>
      </List>
    </SwipeableDrawer>
  )
}
