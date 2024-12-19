import React from 'react'
import { CircularProgress, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import VideoPlayer from '../components/VideoPlayer'
import RecipeBox from '../containers/RecipeBox'
import ShoppingListBox from '../containers/ShoppingListBox'
import { useGetOndemandStreamQuery } from '../redux/apiSlice'
import { setTitle } from '../redux/titleSlice'
import { OndemandStream, TimedRecipeStep } from '../redux/types'

export type RecipeStepElement = TimedRecipeStep & {
  index: number
}

export default function WatchOndemandPage() {
  const dispatch = useDispatch()
  const [currentStep, setCurrentStep] = React.useState<
    RecipeStepElement | undefined
  >(undefined)
  const [nextStep, setNextStep] = React.useState<RecipeStepElement | undefined>(
    undefined,
  )
  const { id } = useParams()
  const { data, isLoading } = useGetOndemandStreamQuery(id || '')

  const resetCurrentStep = (data: OndemandStream) => {
    setCurrentStep({ index: 0, ...data.recipe[0] })
    setNextStep({ index: 1, ...data.recipe[1] })
  }

  React.useEffect(() => {
    dispatch(setTitle(data?.name || 'On-demand'))
    if (data) resetCurrentStep(data)
  }, [isLoading])

  const onTimeUpdate: React.ReactEventHandler<HTMLVideoElement> = (event) => {
    console.log(`currentTime=${event.currentTarget.currentTime}`)
    if (!data) {
      console.error('No data on time update')
    } else if (nextStep && nextStep.time <= event.currentTarget.currentTime) {
      const index = nextStep.index + 1
      setCurrentStep(nextStep)
      setNextStep({ index, ...data.recipe[index] })
      console.log('Updated step')
    } else if (!currentStep) {
      resetCurrentStep(data)
    }
  }

  return (
    <Container>
      {isLoading || data === undefined ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          <Grid size={8}>
            <Typography>{data?.name}</Typography>
            <VideoPlayer
              autoPlay={true}
              src={data?.stream}
              onTimeUpdate={onTimeUpdate}
            />
          </Grid>
          <Grid size={4}>
            <ShoppingListBox list={data.shopping} />
            <RecipeBox steps={data.recipe} currentStep={currentStep?.id} />
          </Grid>
        </Grid>
      )}
    </Container>
  )
}
