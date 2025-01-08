import React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import '../assets/StreamPage.css'

export type ChatInputProps = {
  disabled: boolean
  onSubmit?: (message: string) => void
}

export default function ChatInput(props: ChatInputProps) {
  const [message, setMessage] = React.useState('')
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    if (message && props.onSubmit) {
      props.onSubmit(message)
      setMessage('')
    }
  }
  return (
    <form onSubmit={onSubmit} className="chat-input-form">
      <TextField
        value={message}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setMessage(event.target.value);
        }}
        placeholder="Type a message..."
        disabled={props.disabled}
        className="chat-input-textfield"
        size="small"
      />
      <Button
        variant="contained"
        type="submit"
        disabled={props.disabled}
        sx={{
          backgroundColor: '#FDA448',
        }}
        className="chat-input-button"
      >
        Chat
      </Button>
    </form>
  );
}
