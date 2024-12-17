import React from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ShoppingListItem from '../components/ShoppingListItem'
import { ShoppingListEntry } from '../redux/types'

const testEntries: ShoppingListEntry[] = [
  { id: 1, name: 'Spoon' },
  { id: 2, name: 'Oats', quantity: '40g' },
  { id: 3, name: 'Milk', quantity: '250g' },
]

export default function ShoppingListBox() {
  return (
    <Box>
      <List sx={{ overflow: 'auto' }}>
        {testEntries.map((item) => (
          <ShoppingListItem key={item.id} item={item} />
        ))}
      </List>
    </Box>
  )
}
