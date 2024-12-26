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

export default function WatchOndemandPage() {
  const dispatch = useDispatch()
  const [currentStep, setCurrentStep] = React.useState<number | undefined>(
    undefined,
  )
  const { id } = useParams()
  const { data, isLoading } = useGetOndemandStreamQuery(id || '')

  React.useEffect(() => {
    dispatch(setTitle(data?.name || 'On-demand'))
    if (data) setCurrentStep(data.recipe[0].id)
  }, [isLoading])

  const onTimeUpdate: React.ReactEventHandler<HTMLVideoElement> = (event) => {
    const step = data?.recipe.findLast(
      ({ time }) => time <= event.currentTarget.currentTime,
    )
    if (step) setCurrentStep(step.id)
  }

  return (
    <Container>
      {isLoading || data === undefined ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          <Grid size={8}>
            <Typography>{data?.name}</Typography>
            <Typography>{data?.streamer}</Typography>
            <VideoPlayer
              autoPlay={true}
              src={data?.stream}
              onTimeUpdate={onTimeUpdate}
            />
          </Grid>
          <Grid size={4}>
            <ShoppingListBox list={data.shopping} />
            <RecipeBox steps={data.recipe} currentStep={currentStep} />
          </Grid>
        </Grid>
      )}
    </Container>
  )
}
