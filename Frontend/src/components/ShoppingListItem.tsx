import React from 'react'
import { ListItem, Typography, Box } from '@mui/material'
import { ShoppingListEntry } from '../redux/types'
import '../assets/StreamPage.css'

export type ShoppingListItemProps = {
  item: ShoppingListEntry
};

export default function ShoppingListItem({ item }: ShoppingListItemProps) {
  return (
    <ListItem className="list-item">
      {/* Quantity and Unit */}
      <Box className="quantity-unit-box">
      <Typography id="quantity">{item.quantity}</Typography>
      <Typography id="unit">{item.unit}</Typography>
      </Box>

      {/* Name */}
      <Typography id="name">{item.name}</Typography>
    </ListItem>
  )
}
