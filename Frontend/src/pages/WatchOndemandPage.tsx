import React from 'react'
import { CircularProgress, Container, Typography, Box } from '@mui/material'
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
            <VideoPlayer
              autoPlay={true}
              src={data?.stream}
              onTimeUpdate={onTimeUpdate}
            />
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
              <RecipeBox steps={data.recipe} currentStep={currentStep} />
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  )
}
