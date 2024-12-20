import React from 'react'
import { ListItem, Typography } from '@mui/material'
import { ShoppingListEntry } from '../redux/types'

export type ShoppingListItemProps = {
  item: ShoppingListEntry
}

export default function ShoppingListItem({ item }: ShoppingListItemProps) {
  return (
    <ListItem>
      <Typography>{item.quantity}</Typography>
      <Typography>{item.name}</Typography>
    </ListItem>
  )
}
