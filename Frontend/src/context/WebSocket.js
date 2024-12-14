import React, { createContext } from 'react'
import { useDispatch } from 'react-redux'
import { updateChatLog } from './actions'

const WebSocketContext = createContext(null)

export { WebSocketContext }

export default ({ children }) => {
  let socket
  let ws

  const dispatch = useDispatch()

  const sendMessage = (roomId, message) => {
    const payload = {
      roomId: roomId,
      data: message,
    }
    socket.emit('event://send-message', JSON.stringify(payload))
    socket.send(payload)
    dispatch(updateChatLog(payload))
  }

  if (!socket) {
    socket = new WebSocket(import.meta.env.VITE_WS_URL)

    socket.on('event://get-message', (msg) => {
      const payload = JSON.parse(msg)
      dispatch(updateChatLog(payload))
    })
    socket.onmessage = (event) => {}

    ws = {
      socket: socket,
      sendMessage,
      close: socket.close(),
    }
  }

  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  )
}
