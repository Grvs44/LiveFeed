// Temporary button for testing next-step on WatchLivePage
import React from 'react'
import { PubSubClientContext } from '../context/PubSubClientProvider'

export default function TempNextBox() {
  const { currentStep, changeStep, ready } =
    React.useContext(PubSubClientContext)

  React.useEffect(() => {
    if (ready && changeStep) changeStep(1)
  }, [ready])

  const onPrevious = () => {
    if (changeStep) changeStep((currentStep || 0) - 1)
  }

  const onNext = () => {
    if (changeStep) changeStep((currentStep || 0) + 1)
  }

  return (
    <div>
      <p>{currentStep}</p>
      <button onClick={onPrevious}>Previous</button>
      <button onClick={onNext}>Next</button>
    </div>
  )
}
