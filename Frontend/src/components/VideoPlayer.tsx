import React from 'react'
import ShakaPlayer from 'shaka-player-react'
import 'shaka-player/dist/controls.css'

export type VideoPlayerProps = React.VideoHTMLAttributes<HTMLVideoElement>

export interface VideoPlayerElement {
  videoElement: HTMLVideoElement
}

const VideoPlayer = React.forwardRef<VideoPlayerElement, VideoPlayerProps>(
  (props, ref) => <ShakaPlayer {...props} ref={ref} />,
)

export default VideoPlayer
