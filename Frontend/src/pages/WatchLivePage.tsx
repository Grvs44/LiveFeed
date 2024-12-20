import React from 'react'
import { CircularProgress, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import VideoPlayer from '../components/VideoPlayer'
import ChatBox from '../containers/ChatBox'
import LiveRecipeBox from '../containers/LiveRecipeBox'
import ShoppingListBox from '../containers/ShoppingListBox'
import TempNextBox from '../containers/TempNextBox'
import { LoginContext } from '../context/LoginProvider'
import PubSubClientProvider from '../context/PubSubClientProvider'
import { useGetLiveStreamQuery } from '../redux/apiSlice'
import { setTitle } from '../redux/titleSlice'

export default function WatchLivePage() {
  const dispatch = useDispatch()
  const { id } = useParams()
  const { data, isLoading } = useGetLiveStreamQuery(id || '')
  const { activeAccount } = React.useContext(LoginContext)

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
          userId={activeAccount?.name}
          channelId={data.channel}
          minStepId={data.recipe[0]?.id}
          maxStepId={data.recipe.at(-1)?.id}
        >
          <Grid container spacing={2}>
            <Grid size={8}>
              <Typography>{data?.name}</Typography>
              <VideoPlayer autoPlay={true} src={data?.stream} />
              <ChatBox />
            </Grid>
            <Grid size={4}>
              <ShoppingListBox list={data.shopping} />
              <LiveRecipeBox steps={data.recipe} />
              <TempNextBox />
            </Grid>
          </Grid>
        </PubSubClientProvider>
      )}
    </Container>
  )
}
