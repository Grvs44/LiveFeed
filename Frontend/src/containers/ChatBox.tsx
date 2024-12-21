import React from 'react'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import ChatInput from '../components/ChatInput'
import ChatItem from '../components/ChatItem'
import { LoginContext } from '../context/LoginProvider'
import { PubSubClientContext } from '../context/PubSubClientProvider'

export default function ChatBox() {
  const { handleLogin } = React.useContext(LoginContext)
  const { ready, canSend, chats, sendMessage, sending } =
    React.useContext(PubSubClientContext)

  return (
    <Box>
      <List sx={{ overflow: 'auto' }}>
        {chats.map((chat) => (
          <ChatItem key={chat.id} chat={chat} />
        ))}
      </List>
      {canSend || !ready ? (
        <ChatInput onSubmit={sendMessage} disabled={sending || !ready} />
      ) : (
        <Typography>
          You must be{' '}
          <Link component="button" onClick={handleLogin}>
            signed in
          </Link>{' '}
          to send messages
        </Typography>
      )}
    </Box>
  )
}
