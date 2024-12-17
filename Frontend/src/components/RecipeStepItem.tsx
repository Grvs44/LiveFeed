import React from 'react'
import { ListItem, Typography } from '@mui/material'
import { RecipeStep } from '../redux/types'

export type RecipeStepProps = {
  step: RecipeStep
}

export default function RecipeStepItem({ step }: RecipeStepProps) {
  return (
    <ListItem>
      <Typography>{step.text}</Typography>
    </ListItem>
  )
}
