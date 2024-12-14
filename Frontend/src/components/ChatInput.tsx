import React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

export type ChatInputProps = {
  onSubmit: (message: string) => void
}

export default function ChatInput(props: ChatInputProps) {
  const [message, setMessage] = React.useState('')
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    if (message) {
      props.onSubmit(message)
      setMessage('')
    }
  }
  return (
    <form onSubmit={onSubmit}>
      <TextField
        defaultValue={message}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setMessage(event.target.value)
        }}
      />
      <Button variant="contained" type="submit">
        Send
      </Button>
    </form>
  )
}
