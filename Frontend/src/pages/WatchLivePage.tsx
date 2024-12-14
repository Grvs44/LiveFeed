import React from 'react'
import { CircularProgress, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import VideoPlayer from '../components/VideoPlayer'
import ChatBox from '../containers/ChatBox'
import RecipeBox from '../containers/RecipeBox'
import ShoppingListBox from '../containers/ShoppingListBox'
import WebSocketProvider from '../context/WebSocket'
import { setTitle } from '../redux/titleSlice'

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
    <WebSocketProvider>
      <Container>
        <Grid container spacing={2}>
          <Grid size={8}>
            <Typography>Stream {id}</Typography>
            <VideoPlayer />
            <ChatBox />
          </Grid>
          <Grid size={4}>
            <ShoppingListBox />
            <RecipeBox />
          </Grid>
        </Grid>
      </Container>
    </WebSocketProvider>
  )
}
