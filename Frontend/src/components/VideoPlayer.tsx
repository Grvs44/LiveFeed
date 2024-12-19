import React from 'react'
import ShakaPlayer from 'shaka-player-react'
import 'shaka-player/dist/controls.css'

export type VideoPlayerProps = React.VideoHTMLAttributes<HTMLVideoElement>

export default function VideoPlayer(props: VideoPlayerProps) {
  return <ShakaPlayer {...props} />
}
