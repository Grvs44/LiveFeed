import React from 'react'
import {
  OnGroupDataMessageArgs,
  WebPubSubClient,
} from '@azure/web-pubsub-client'
import { Chat } from '../redux/types'
import { MessageContent, MessageType } from './types'

export type ProviderValueType = {
  ready: boolean
  chats: Chat[]
  sending: boolean
  start?: () => void
  sendMessage?: (message: string) => Promise<void>
}

export type PubSubClientProviderProps = {
  children: React.ReactNode
  userId: string
  channelId: string
  groupName: string
}

export const PubSubClientContext = React.createContext<ProviderValueType>({
  ready: false,
  chats: [],
  sending: false,
})

// Adapted from https://learn.microsoft.com/en-us/javascript/api/overview/azure/web-pubsub-client-readme?view=azure-node-latest
export default function PubSubClientProvider(props: PubSubClientProviderProps) {
  const [client, setClient] = React.useState<WebPubSubClient | null>(null)
  const [ready, setReady] = React.useState<boolean>(false)
  const [chats, setChats] = React.useState<Chat[]>([])
  const [sending, setSending] = React.useState<boolean>(false)

  React.useEffect(() => {
    const client = new WebPubSubClient({
      getClientAccessUrl: async () => {
        let value = await (
          await fetch(
            `${import.meta.env.VITE_API_URL}/chat/negotiate?userId=${props.userId}&channelId=${props.channelId}`,
          )
        ).json()
        console.log('pubsub URL')
        console.log(value)
        return value.url
      },
    })
    client.on('group-message', (e: OnGroupDataMessageArgs) => {
      console.log('received msg')
      console.log(e)
      if (e.message.dataType == 'json') {
        const messageData = e.message.data as MessageContent
        if (
          messageData.type == MessageType.Message &&
          messageData.message !== undefined
        ) {
          setChats((chats) =>
            chats.concat([
              {
                id: e.message.sequenceId || Date.now(),
                username: e.message.fromUserId,
                message: messageData.message || '',
                time: messageData.time || 'no-time',
              },
            ]),
          )
        }
      } else {
        console.error('Unkown message received:')
        console.error(e.message)
      }
    })
    setClient(client)
    client?.start().then(() => {
      setReady(true)
    })
  }, [])

  const start: ProviderValueType['start'] = () => {}

  const sendMessage: ProviderValueType['sendMessage'] = async (message) => {
    console.log('Sending message: ' + message)
    setSending(true)
    await client?.sendToGroup(
      props.groupName,
      { message, time: new Date().toISOString(), type: MessageType.Message },
      'json',
    )
    setSending(false)
  }

  const value: ProviderValueType = {
    ready,
    chats,
    start,
    sending,
    sendMessage,
  }

  return (
    <PubSubClientContext.Provider value={value}>
      {props.children}
    </PubSubClientContext.Provider>
  )
}
