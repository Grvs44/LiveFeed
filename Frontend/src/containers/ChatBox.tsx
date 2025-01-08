import React from 'react'
import { SxProps, Theme } from '@mui/material'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import ChatInput from '../components/ChatInput'
import ChatItem from '../components/ChatItem'
import { LoginContext } from '../context/LoginProvider'
import { PubSubClientContext } from '../context/PubSubClientProvider'

// Considered to be at the bottom of the chat list if within this value of the bottom (in pixels)
const SCROLL_OFFSET = 50

export type ChatBoxProps = {
  sx?: SxProps<Theme>
}

export default function ChatBox({ sx }: ChatBoxProps) {
  const { handleLogin } = React.useContext(LoginContext)
  const { ready, canSend, chats, sendMessage, sending } =
    React.useContext(PubSubClientContext)
  const [autoScroll, setAutoScroll] = React.useState<boolean>(true)
  const listRef = React.useRef<HTMLUListElement | null>(null)

  const onScroll: React.UIEventHandler<HTMLUListElement> = (event) =>
    setAutoScroll(
      event.currentTarget.scrollTop +
        event.currentTarget.clientHeight +
        SCROLL_OFFSET >=
        event.currentTarget.scrollHeight,
    )

  React.useEffect(() => {
    if (autoScroll && listRef.current != null) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [chats])

  return (
    <Box>
      <List sx={{ overflow: 'auto', ...sx }} onScroll={onScroll} ref={listRef}>
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
