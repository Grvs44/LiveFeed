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
import { useGetLiveStreamQuery } from '../redux/apiSlice'
import { setTitle } from '../redux/titleSlice'

export default function WatchLivePage() {
  const dispatch = useDispatch()
  const { id } = useParams()
  const { data, isLoading } = useGetLiveStreamQuery(id || '')

  React.useEffect(() => {
    dispatch(setTitle('Live'))
  }, [])

  return (
    <Container>
      {isLoading || data === undefined ? (
        <CircularProgress />
      ) : (
        <PubSubClientProvider
          groupName={data.group}
          userId="user2"
          channelId={data.channel}
        >
          <Grid container spacing={2}>
            <Grid size={8}>
              <Typography>{data?.name}</Typography>
              <VideoPlayer autoPlay={true} src={data?.stream} />
              <ChatBox />
            </Grid>
            <Grid size={4}>
              <ShoppingListBox />
              <RecipeBox />
            </Grid>
          </Grid>
        </PubSubClientProvider>
      )}
    </Container>
  )
}
