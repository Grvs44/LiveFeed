import React from 'react'
import { ListItem, Typography } from '@mui/material'
import { RecipeStep } from '../redux/types'

export type RecipeStepProps = {
  step: RecipeStep
  current?: boolean
}

export default function RecipeStepItem(props: RecipeStepProps) {
  return (
    <ListItem
      style={{ backgroundColor: props.current ? '#e1e1e1' : 'inherit' }}
    >
      <Typography>{props.step.text}</Typography>
    </ListItem>
  )
}
