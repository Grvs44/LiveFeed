import React from 'react'
import { List, Box } from '@mui/material'
import ShoppingListItem from '../components/ShoppingListItem'
import { ShoppingListEntry } from '../redux/types'

export type ShoppingListBoxProps = {
  list: ShoppingListEntry[]
}

export default function ShoppingListBox(props: ShoppingListBoxProps) {
  return (
    <Box>
      <List>
        {props.list.map((item) => (
          <ShoppingListItem key={item.id} item={item} />
        ))}
      </List>
    </Box>
  )
}
