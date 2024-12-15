import React, { createContext } from 'react'
import { WebPubSubClient } from '@azure/web-pubsub-client'
import { useDispatch } from 'react-redux'
import { setClientReady } from '../redux/chatSlice'

export const PubSubClientContext = createContext<WebPubSubClient | null>(null)

// Adapted from https://learn.microsoft.com/en-us/javascript/api/overview/azure/web-pubsub-client-readme?view=azure-node-latest
export default function PubSubClientProvider({ children }: { children: any }) {
  const dispatch = useDispatch()
  const [client, setClient] = React.useState<WebPubSubClient | null>(null)

  React.useEffect(() => {
    const client = new WebPubSubClient({
      getClientAccessUrl: async () => {
        let value = await (
          await fetch(
            `${import.meta.env.VITE_API_URL}/chat/negotiate?userId=user2&channelId=channel1`,
          )
        ).json()
        console.log('pubsub URL')
        console.log(value)
        return value.url
      },
    })

    client.start().then(() => {
      setClient(client)
      dispatch(setClientReady(true))
    })
  }, [])

  return (
    <PubSubClientContext.Provider value={client}>
      {children}
    </PubSubClientContext.Provider>
  )
}
