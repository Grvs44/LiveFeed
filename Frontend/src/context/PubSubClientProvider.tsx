import React from 'react'
import {
  OnGroupDataMessageArgs,
  WebPubSubClient,
} from '@azure/web-pubsub-client'
import { Chat } from '../context/types'
import { MessageContent, MessageType } from './types'

export type ProviderValue = {
  ready: boolean
  chats: Chat[]
  sending: boolean
  sendMessage?: (message: string) => Promise<void>
  stop?: () => void
}

export type PubSubClientProviderProps = {
  children: React.ReactNode
  userId: string
  channelId: string
  groupName: string
}

export const PubSubClientContext = React.createContext<ProviderValue>({
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
                time: messageData.time || 0,
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

  const sendMessage: ProviderValue['sendMessage'] = async (message) => {
    console.log('Sending message: ' + message)
    setSending(true)
    const content: MessageContent = {
      message,
      time: Date.now(),
      type: MessageType.Message,
    }
    await client?.sendToGroup(props.groupName, content, 'json')
    setSending(false)
  }

  const stop = () => {
    client?.stop()
    setClient(null)
  }

  const value: ProviderValue = {
    ready,
    chats,
    sending,
    sendMessage,
    stop,
  }

  return (
    <PubSubClientContext.Provider value={value}>
      {props.children}
    </PubSubClientContext.Provider>
  )
}
