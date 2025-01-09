import React from 'react'
import { Box, CircularProgress, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import VideoPlayer from '../components/VideoPlayer'
import ChatBox from '../containers/ChatBox'
import RecipeBox from '../containers/RecipeBox'
import ShoppingListBox from '../containers/ShoppingListBox'
import StreamEndMessage from '../containers/StreamEndMessage'
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
          onStepUpdate={({ id }) => setCurrentStep(id)}
        >
          <Grid container spacing={2}>
            <Grid size={8}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 'bold', mb: 1, color: '#FDA448' }}
              >
                {data?.name}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontStyle: 'italic', color: '#555' }}
              >
                By {data?.streamer}
              </Typography>
              <VideoPlayer autoPlay={true} src={data?.stream} />
              <StreamEndMessage />
              <ChatBox sx={{ height: 200 }} />
            </Grid>
            <Grid size={4}>
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  borderRadius: '8px',
                  boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#fff',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 'bold', mb: 1, color: '#FDA448' }}
                >
                  Shopping List
                </Typography>
                <ShoppingListBox list={data.shopping} />
              </Box>
              <Box
                sx={{
                  p: 2,
                  borderRadius: '8px',
                  boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#fff',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 'bold', mb: 1, color: '#FDA448' }}
                >
                  Recipe Steps
                </Typography>
                <RecipeBox steps={recipe} currentStep={currentStep} />
              </Box>
            </Grid>
          </Grid>
        </PubSubClientProvider>
      )}
    </Container>
  )
}
