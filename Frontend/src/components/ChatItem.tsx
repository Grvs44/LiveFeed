import React from 'react'
import { Chat } from '../context/types'
import '../assets/StreamPage.css'

export type ChatItemProps = {
  chat: Chat;
};

export default function ChatItem({ chat }: ChatItemProps) {
  return (
    <div className="chat-item-container">
      <div className="chat-item-username">{chat.username}</div>
      <div className="chat-item-message">{chat.message}</div>
      <div className="chat-item-time">{getTime(chat.time)}</div>
    </div>
  );
}

function getTime(time: number) {
  const date = new Date(time);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
