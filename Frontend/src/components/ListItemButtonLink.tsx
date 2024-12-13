// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/components/ListItemButtonLink.tsx
import React from 'react'
import { Link as RouteLink } from 'react-router-dom'
import type { LinkProps } from 'react-router-dom'
import { ListItemButton } from '@mui/material'
import type { ListItemButtonProps } from '@mui/material'

const ListItemButtonLink = (props: LinkProps & ListItemButtonProps) => {
  return (
    <ListItemButton
      component={RouteLink}
      {...props}
      to={import.meta.env.BASE_URL + props.to.valueOf()}
    />
  )
}

export default ListItemButtonLink
