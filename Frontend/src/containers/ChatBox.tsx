import React from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ChatInput from '../components/ChatInput'
import ChatItem from '../components/ChatItem'
import { WebSocketContext } from '../context/WebSocket'
import { Chat } from '../redux/types'

const testChats: Chat[] = [
  { id: 1, username: 'user1', message: 'Hello', time: '12:00' },
  { id: 2, username: 'New user', message: 'Hello user1', time: '12:01' },
  { id: 3, username: 'Chef1', message: 'Hello everyone!', time: '12:02' },
]

export default function ChatBox() {
  // TODO: replace with Redux hook:
  const [chats, setChats] = React.useState(testChats)
  const ws: any = React.useContext(WebSocketContext)

  React.useEffect(() => {
    ws.client.on('msg', (e: any) => {
      console.log('received msg')
      console.log(e)
      setChats(
        chats.concat([
          {
            id: Date.now(),
            username: e.message.fromUserId,
            message: e.message.data,
            time: '',
          },
        ]),
      )
    })
  })

  const submitChat = (message: string) => {
    ws.client.sendToGroup('channel name', message, 'msg')
  }

  return (
    <Box>
      <List sx={{ overflow: 'auto' }}>
        {chats.map((chat) => (
          <ChatItem key={chat.id} chat={chat} />
        ))}
      </List>
      <ChatInput onSubmit={submitChat} />
    </Box>
  )
}
