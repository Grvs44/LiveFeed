import React from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import VideoPlayer from '../components/VideoPlayer'
import RecipeBox from '../containers/RecipeBox'
import ShoppingListBox from '../containers/ShoppingListBox'
import PubSubClientProvider from '../context/PubSubClientProvider'
import {
  useEndStreamMutation,
  useGetLiveStreamQuery,
  useSendStreamStartTimeMutation,
  useStartStreamMutation,
} from '../redux/apiSlice'
import { setTitle } from '../redux/titleSlice'

enum StreamState {
  Initial,
  Started,
  Streaming,
  Stopped,
}

export default function StartStreamPage() {
  const dispatch = useDispatch()
  const { id } = useParams()
  const { data, isLoading } = useGetLiveStreamQuery(id || '')
  const [startStream] = useStartStreamMutation()
  const [sendStreamStartTime] = useSendStreamStartTimeMutation()
  const [endStream] = useEndStreamMutation()
  const [currentStep, setCurrentStep] = React.useState<number>(0)
  const [streamState, setStreamState] = React.useState<StreamState>(
    StreamState.Initial,
  )

  React.useEffect(() => {
    dispatch(setTitle('Start stream'))
  }, [])

  const onStartStream = () => {
    if (!id) return
    startStream(id)
    setStreamState(StreamState.Started)
  }
  const onStreamStart: React.ReactEventHandler<HTMLVideoElement> = (event) => {
    if (!id) return
    console.log(`Started at: ${event.currentTarget.currentTime}s`)
    sendStreamStartTime({ id, time: Math.floor(Date.now() / 1000) })
    setStreamState(StreamState.Streaming)
  }
  const onStopStream = () => {
    if (!id) return
    endStream(id)
    setStreamState(StreamState.Stopped)
  }

  const getStreamControl = () => {
    switch (streamState) {
      case StreamState.Initial:
        return (
          <Button onClick={onStartStream} variant="contained">
            Start
          </Button>
        )
      case StreamState.Started:
        return (
          <Button onClick={onStopStream} variant="contained">
            Stop stream
          </Button>
        )
      default:
        return <Typography>Stream stopped</Typography>
    }
  }

  return (
    <Container>
      {isLoading || !data ? (
        <CircularProgress />
      ) : (
        <PubSubClientProvider
          groupName={data.group}
          minStepId={data.recipe[0]?.id}
          maxStepId={data.recipe.at(-1)?.id}
        >
          <Grid container spacing={2}>
            <Grid size={4}>
              <Typography>Stream {id}</Typography>
              {getStreamControl()}
              <ShoppingListBox list={data.shopping} />
              <RecipeBox steps={data.recipe} currentStep={currentStep} />
            </Grid>
            <Grid size={8}>
              <VideoPlayer src={data.stream} onLoadedData={onStreamStart} />
            </Grid>
          </Grid>
        </PubSubClientProvider>
      )}
    </Container>
  )
}
