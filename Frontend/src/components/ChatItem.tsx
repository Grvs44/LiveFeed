import React from 'react'
import { Chat } from '../redux/types'
import { ListItem, Typography } from '@mui/material'

export type ChatItemProps = {
  chat: Chat
}

export default function ChatItem({ chat }: ChatItemProps) {
  return (
    <ListItem>
      <Typography>{chat.username}</Typography>
      <Typography>{chat.message}</Typography>
      <Typography>{chat.time}</Typography>
    </ListItem>
  )
}
