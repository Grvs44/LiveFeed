import React, { createContext } from 'react'
import { WebPubSubClient } from '@azure/web-pubsub-client'
import { useDispatch } from 'react-redux'
import { setClientReady } from '../redux/chatSlice'

const WebSocketContext = createContext(null)

export { WebSocketContext }

export default ({ children }) => {
  const dispatch = useDispatch()

  const client = new WebPubSubClient({
    getClientAccessUrl: async () => {
      let value = await (
        await fetch(
          import.meta.env.VITE_API_URL +
            `/chat/negotiate?userid=user2&channelid=channel1`,
        )
      ).json()
      console.log('pubsub URL')
      console.log(value)
      return value.url
    },
  })
  React.useEffect(async () => {
    await client.start()
    dispatch(setClientReady(true))
  }, [])

  const ws = {
    client,
  }

  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  )
}
