import React from 'react'
import { PubSubClientContext } from '../context/PubSubClientProvider'
import RecipeBox, { RecipeBoxProps } from './RecipeBox'

export default function LiveRecipeBox(props: RecipeBoxProps) {
  const { currentStep } = React.useContext(PubSubClientContext)
  return <RecipeBox currentStep={currentStep} {...props} />
}
