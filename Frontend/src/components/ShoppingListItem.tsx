import React from 'react'
import { ListItem, Typography, Box } from '@mui/material'
import { ShoppingListEntry } from '../redux/types'
import '../assets/StreamPage.css'

export type ShoppingListItemProps = {
  item: ShoppingListEntry
};

export default function ShoppingListItem({ item }: ShoppingListItemProps) {
  const blankUndefined = (s: string | undefined) => (s == undefined ? '' : s)

  const getSubtitle = () =>
    item.quantity == undefined && item.unit == undefined
      ? undefined
      : blankUndefined(item.quantity) + blankUndefined(item.unit)

  return (
    <ListItem className="list-item">
      {/* Quantity and Unit */}
      <Box className="quantity-unit-box">
      <Typography id="quantity">{item.quantity}</Typography>
      <Typography id="unit">{item.unit}</Typography>
      </Box>

      {/* Name */}
      <Typography id="name">{item.item}</Typography>
    </ListItem>
  )
}
