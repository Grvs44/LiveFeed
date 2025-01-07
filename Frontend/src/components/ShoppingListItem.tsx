import React from 'react'
import { ListItem, ListItemText } from '@mui/material'
import { ShoppingListEntry } from '../redux/types'

export type ShoppingListItemProps = {
  item: ShoppingListEntry
}

export default function ShoppingListItem({ item }: ShoppingListItemProps) {
  const blankUndefined = (s: string | undefined) => (s == undefined ? '' : s)

  const getSubtitle = () =>
    item.quantity == undefined && item.unit == undefined
      ? undefined
      : blankUndefined(item.quantity) + blankUndefined(item.unit)

  return (
    <ListItem>
      <ListItemText primary={item.item} secondary={getSubtitle()} />
    </ListItem>
  )
}
