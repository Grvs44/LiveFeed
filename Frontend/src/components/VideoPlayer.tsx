import React from 'react'
import ShakaPlayer from 'shaka-player-react'
import 'shaka-player/dist/controls.css'

export type VideoPlayerProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  ref?: React.MutableRefObject<HTMLVideoElement | null>
}

export default function VideoPlayer(props: VideoPlayerProps) {
  return <ShakaPlayer {...props} />
}
