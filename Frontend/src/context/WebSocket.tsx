import React, { createContext } from 'react'
import { WebPubSubClient } from '@azure/web-pubsub-client'
import { useDispatch } from 'react-redux'
import { setClientReady } from '../redux/chatSlice'

type ContextType = { client: WebPubSubClient | null }

const WebSocketContext = createContext<ContextType>({ client: null })

export { WebSocketContext }

export default ({ children }: { children: any }) => {
  const dispatch = useDispatch()

  const client = new WebPubSubClient({
    getClientAccessUrl: async () => {
      let value = await (
        await fetch(
          `${import.meta.env.VITE_API_URL}/chat/negotiate?userid=user2&channelid=channel1`,
        )
      ).json()
      console.log('pubsub URL')
      console.log(value)
      return value.url
    },
  })
  React.useEffect(() => {
    console.log('starting...')
    ws.client.start().then(() => {
      dispatch(setClientReady(true))
    })
  }, [])

  const ws = {
    client,
  }

  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  )
}
