import React from 'react'
import { useDispatch } from 'react-redux'
import { setTitle } from '../redux/titleSlice'
import { useParams } from 'react-router-dom'
import { CircularProgress, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import VideoPlayer from '../components/VideoPlayer'
import ChatBox from '../containers/ChatBox'

export default function WatchLivePage() {
  const dispatch = useDispatch()
  const { id } = useParams()
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    dispatch(setTitle('Live'))
    setTimeout(() => setLoading(false), 2000) // Pretend loading
  }, [])

  return loading ? (
    <Container>
      <CircularProgress />
    </Container>
  ) : (
    <Container>
      <Grid container spacing={2}>
        <Grid size={8}>
          <Typography>Stream {id}</Typography>
          <VideoPlayer />
          <ChatBox />
        </Grid>
        <Grid size={4}>
          <p>Shopping list</p>
          <p>Recipe steps</p>
        </Grid>
      </Grid>
    </Container>
  )
}
