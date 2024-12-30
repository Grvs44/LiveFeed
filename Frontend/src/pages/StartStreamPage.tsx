import React from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import VideoPlayer from '../components/VideoPlayer'
import { setTitle } from '../redux/titleSlice'

export default function StartStreamPage() {
  const dispatch = useDispatch()
  const { id } = useParams()

  React.useEffect(() => {
    dispatch(setTitle('Start stream'))
  }, [])

  const onPlay: React.ReactEventHandler<HTMLVideoElement> = (event) => {
    console.log(
      `Video time: ${event.currentTarget.currentTime}s, epoch time: ${Math.floor(Date.now() / 1000)}s`,
    )
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid size={4}>
          <Typography>Stream {id}</Typography>
        </Grid>
        <Grid size={8}>
          <VideoPlayer src={'/' + id} autoPlay={true} onPlay={onPlay} />
        </Grid>
      </Grid>
    </Container>
  )
}
