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
import { setTitle } from '../redux/titleSlice'

export default function WatchLivePage() {
  const dispatch = useDispatch()
  const { id } = useParams()
  const ready = true

  React.useEffect(() => {
    dispatch(setTitle('Live'))
  }, [])

  return (
    <PubSubClientProvider
      groupName="channel1"
      userId="user2"
      channelId="channel1"
    >
      <Container>
        {ready ? (
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
        ) : (
          <CircularProgress />
        )}
      </Container>
    </PubSubClientProvider>
  )
}
