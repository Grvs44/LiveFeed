import React from 'react'
import { Typography } from '@mui/material'
import { PubSubClientContext } from '../context/PubSubClientProvider'

export default function StreamEndMessage() {
  const { endReceived } = React.useContext(PubSubClientContext)
  return endReceived ? (
    <Typography sx={{ fontWeight: 'bold' }}>
      The live stream has now ended
    </Typography>
  ) : (
    <></>
  )
}
