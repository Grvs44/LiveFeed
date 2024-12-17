import React from 'react'
import ShakaPlayer from 'shaka-player-react'
import 'shaka-player/dist/controls.css'

export type VideoPlayerProps = {
  src?: string
  autoPlay?: boolean
  width?: number
  height?: number
}

export default function VideoPlayer(props: VideoPlayerProps) {
  return <ShakaPlayer {...props} />
}
