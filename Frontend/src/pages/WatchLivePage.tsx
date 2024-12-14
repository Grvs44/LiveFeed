import React from 'react'
import { CircularProgress, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import VideoPlayer from '../components/VideoPlayer'
import ChatBox from '../containers/ChatBox'
import RecipeBox from '../containers/RecipeBox'
import ShoppingListBox from '../containers/ShoppingListBox'
import WebSocketProvider, { WebSocketContext } from '../context/WebSocket'
import { setClientReady } from '../redux/chatSlice'
import { setTitle } from '../redux/titleSlice'
import { State } from '../redux/types'

export default function WatchLivePage() {
  const dispatch = useDispatch()
  const { id } = useParams()
  const ws = React.useContext(WebSocketContext)
  const ready = useSelector((state: State) => state.chat.clientReady)

  React.useEffect(() => {
    dispatch(setTitle('Live'))
  }, [])

  return ready ? (
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
  ) : (
    <Container>
      <CircularProgress />
    </Container>
  )
}
