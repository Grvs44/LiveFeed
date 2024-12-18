import React from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
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
