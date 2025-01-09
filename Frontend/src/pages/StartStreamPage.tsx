import React from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import VideoPlayer, { VideoPlayerElement } from '../components/VideoPlayer'
import ChatBox from '../containers/ChatBox'
import ShoppingListBox from '../containers/ShoppingListBox'
import StepBox from '../containers/StepBox'
import PubSubClientProvider from '../context/PubSubClientProvider'
import {
  useEndStreamMutation,
  useGetLiveStreamQuery,
  useSendStreamStartTimeMutation,
  useStartStreamMutation,
} from '../redux/apiSlice'
import { setTitle } from '../redux/titleSlice'
import { LiveStatus } from '../redux/types'

export default function StartStreamPage() {
  const dispatch = useDispatch()
  const { id } = useParams()
  const { data, isLoading } = useGetLiveStreamQuery(id || '')
  const [startStream] = useStartStreamMutation()
  const [sendStreamStartTime] = useSendStreamStartTimeMutation()
  const [endStream] = useEndStreamMutation()
  const [streamState, setStreamState] = React.useState<LiveStatus | undefined>(
    undefined,
  )
  const video = React.useRef<VideoPlayerElement | null>(null)
  const [videoStarted, setVideoStarted] = React.useState<boolean>(false)

  React.useEffect(() => {
    dispatch(setTitle(data?.name || 'Start stream'))
    if (data) setStreamState(data.liveStatus)
  }, [isLoading])

  const onStartStream = () => {
    console.log('Start stream button clicked')
    if (!id) return
    startStream(id)
    setStreamState(LiveStatus.Started)
  }
  const onStreamStart: React.ReactEventHandler<HTMLVideoElement> = (event) => {
    if (!id || streamState !== LiveStatus.Initial) return
    console.log(`Started at: ${event.currentTarget.currentTime}s`)
    sendStreamStartTime({ id, time: Math.floor(Date.now() / 1000) })
    setStreamState(LiveStatus.Started)
    setVideoStarted(true)
  }
  const onStopStream = () => {
    if (!id) return
    endStream(id)
    setStreamState(LiveStatus.Stopped)
  }

  const getStreamControl = () => {
    switch (streamState) {
      case LiveStatus.Initial:
        return (
          <Button onClick={onStartStream} variant="contained">
            Start stream
          </Button>
        )
      case LiveStatus.Started:
        return (
          <Button onClick={onStopStream} variant="contained">
            Stop stream
          </Button>
        )
      case LiveStatus.Stopped:
        return <Typography>Stream stopped</Typography>
      default:
        return <Typography>Loading...</Typography>
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
              <Typography variant="h3" component="h1">
                {data.name}
              </Typography>
              <Typography>URL: {data.input}</Typography>
              {videoStarted || streamState == LiveStatus.Stopped ? null : (
                <Button
                  variant="outlined"
                  onClick={() => window.location.reload()}
                >
                  Refresh video
                </Button>
              )}
              {getStreamControl()}
              <StepBox
                steps={data.recipe}
                show={streamState == LiveStatus.Started}
                getVideoTime={() => {
                  const time = video.current?.videoElement?.currentTime
                  console.log(`videotime:${time}`)
                  return time
                }}
              />
              <ShoppingListBox list={data.shopping} />
            </Grid>
            <Grid size={8}>
              <VideoPlayer
                src={data.stream}
                onLoadedData={onStreamStart}
                ref={video}
                autoPlay={true}
              />
              <ChatBox sx={{ height: 200 }} />
            </Grid>
          </Grid>
        </PubSubClientProvider>
      )}
    </Container>
  )
}
