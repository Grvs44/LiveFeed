import React from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ChatInput from '../components/ChatInput'
import ChatItem from '../components/ChatItem'
import { PubSubClientContext } from '../context/PubSubClientProvider'

export default function ChatBox() {
  const { ready, chats, sendMessage, sending, stop } =
    React.useContext(PubSubClientContext)

  return (
    <Box>
      <List sx={{ overflow: 'auto' }}>
        {chats.map((chat) => (
          <ChatItem key={chat.id} chat={chat} />
        ))}
      </List>
      <ChatInput onSubmit={sendMessage} disabled={sending || !ready} />
    </Box>
  )
}
