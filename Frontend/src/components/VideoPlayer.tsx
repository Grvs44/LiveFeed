import React from 'react'
import ShakaPlayer from 'shaka-player-react'
import 'shaka-player/dist/controls.css'

export type VideoPlayerProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  src?: string
  autoPlay?: boolean
  width?: number
  height?: number
}

export default function VideoPlayer(props: VideoPlayerProps) {
  console.log(props)
  return <ShakaPlayer onTimeUpdate={props.onTimeUpdate} {...props} />
}
