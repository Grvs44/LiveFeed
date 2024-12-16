import React from 'react'
import { ListItem, Typography } from '@mui/material'
import { Chat } from '../redux/types'

export type ChatItemProps = {
  chat: Chat
}

export default function ChatItem({ chat }: ChatItemProps) {
  return (
    <ListItem>
      <Typography>{chat.username}</Typography>
      <Typography>{chat.message}</Typography>
      <Typography>{getTime(chat.time)}</Typography>
    </ListItem>
  )
}

function getTime(time: number) {
  const date = new Date(time)
  return `${date.getHours()}:${date.getMinutes()}`
}
