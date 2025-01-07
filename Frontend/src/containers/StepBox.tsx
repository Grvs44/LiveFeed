import React from 'react'
import Button from '@mui/material/Button'
import { PubSubClientContext } from '../context/PubSubClientProvider'
import RecipeBox, { RecipeBoxProps } from './RecipeBox'

export type StepBoxProps = {
  show?: boolean
  steps: RecipeBoxProps['steps']
}

export default function StepBox(props: StepBoxProps) {
  const { currentStep, changeStep, ready } =
    React.useContext(PubSubClientContext)
  const [step, setStep] = React.useState<number>(0)

  React.useEffect(() => {
    if (ready && changeStep) changeStep(1)
  }, [ready])

  const onChange = (change: number) => {
    if (changeStep) {
      setStep((step) => {
        const newStep = step + change
        changeStep(newStep)
        return newStep
      })
    }
  }

  return (
    <>
      {props.show ? (
        <div>
          <p>{currentStep}</p>
          <Button variant="contained" onClick={() => onChange(-1)}>
            Previous
          </Button>
          <Button variant="contained" onClick={() => onChange(1)}>
            Next
          </Button>
        </div>
      ) : null}
      <RecipeBox steps={props.steps} currentStep={step} />
    </>
  )
}
