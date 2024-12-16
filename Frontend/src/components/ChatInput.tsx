import React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

export type ChatInputProps = {
  sending: boolean
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
    <form onSubmit={onSubmit}>
      <TextField
        value={message}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setMessage(event.target.value)
        }}
      />
      <Button variant="contained" type="submit" disabled={props.sending}>
        Send
      </Button>
    </form>
  )
}
