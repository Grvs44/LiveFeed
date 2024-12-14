import React from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import RecipeStepItem from '../components/RecipeStepItem'
import { RecipeStep } from '../redux/types'

const testSteps: RecipeStep[] = [
  { id: 1, text: 'step 1' },
  { id: 2, text: 'step 2' },
]

export default function RecipeBox() {
  return (
    <Box>
      <List sx={{ overflow: 'auto' }}>
        {testSteps.map((step) => (
          <RecipeStepItem key={step.id} step={step} />
        ))}
      </List>
    </Box>
  )
}
