import React from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import RecipeStepItem from '../components/RecipeStepItem'
import { RecipeStep } from '../redux/types'

export type RecipeBoxProps = {
  steps: RecipeStep[]
}

export default function RecipeBox(props: RecipeBoxProps) {
  return (
    <Box>
      <List sx={{ overflow: 'auto' }}>
        {props.steps.map((step) => (
          <RecipeStepItem key={step.id} step={step} />
        ))}
      </List>
    </Box>
  )
}
