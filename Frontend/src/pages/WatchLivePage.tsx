import React from 'react'
import { CircularProgress, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import VideoPlayer from '../components/VideoPlayer'
import ChatBox from '../containers/ChatBox'
import RecipeBox from '../containers/RecipeBox'
import ShoppingListBox from '../containers/ShoppingListBox'
import PubSubClientProvider from '../context/PubSubClientProvider'
import { StepUpdate } from '../context/types'
import { useGetLiveStreamQuery } from '../redux/apiSlice'
import { setTitle } from '../redux/titleSlice'
import { RecipeStep } from '../redux/types'

export default function WatchLivePage() {
  const dispatch = useDispatch()
  const { id } = useParams()
  const { data, isLoading } = useGetLiveStreamQuery(id || '')
  const [recipe, setRecipe] = React.useState<RecipeStep[] | undefined>(
    undefined,
  )
  const [currentStep, setCurrentStep] = React.useState<number | undefined>(
    undefined,
  )

  const onStepUpdate = ({ id, time }: StepUpdate) =>
    setRecipe((recipe) =>
      recipe?.map((recipe) =>
        recipe.id === id ? { time, ...recipe } : recipe,
      ),
    )

  const onTimeUpdate: React.ReactEventHandler<HTMLVideoElement> = (event) => {
    const step = data?.recipe.findLast(
      ({ time }) => time && time <= event.currentTarget.currentTime,
    )
    if (step) setCurrentStep(step.id)
  }

  React.useEffect(() => {
    dispatch(setTitle(data?.name || 'Live'))
    if (data) setCurrentStep(data.recipe[0].id)
    setRecipe(data?.recipe)
  }, [isLoading])

  return (
    <Container>
      {isLoading || data === undefined || recipe === undefined ? (
        <CircularProgress />
      ) : (
        <PubSubClientProvider
          groupName={data.group}
          minStepId={data.recipe[0]?.id}
          maxStepId={data.recipe.at(-1)?.id}
          onStepUpdate={onStepUpdate}
        >
          <Grid container spacing={2}>
            <Grid size={8}>
              <Typography>{data?.name}</Typography>
              <Typography>{data?.streamer}</Typography>
              <VideoPlayer
                autoPlay={true}
                src={data?.stream}
                onTimeUpdate={onTimeUpdate}
              />
              <ChatBox />
            </Grid>
            <Grid size={4}>
              <ShoppingListBox list={data.shopping} />
              <RecipeBox steps={recipe} currentStep={currentStep} />
            </Grid>
          </Grid>
        </PubSubClientProvider>
      )}
    </Container>
  )
}
