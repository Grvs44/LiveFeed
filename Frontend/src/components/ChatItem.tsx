import React from 'react'
import { ListItem, ListItemText } from '@mui/material'
import { Chat } from '../context/types'

export type ChatItemProps = {
  chat: Chat
}

export default function ChatItem({ chat }: ChatItemProps) {
  return (
    <ListItem>
      <ListItemText secondary={chat.username} />
      <ListItemText primary={chat.message} />
      <ListItemText secondary={getTime(chat.time)} />
    </ListItem>
  )
}

function getTime(time: number) {
  const date = new Date(time)
  return `${date.getHours()}:${date.getMinutes()}`
}
