import React from 'react'
import ShakaPlayer from 'shaka-player-react'
import 'shaka-player/dist/controls.css'

const exampleManifestUri =
  'https://storage.googleapis.com/livefeed-bucket/output/manifest.m3u8'

export default function Player() {
  return <ShakaPlayer autoPlay src={exampleManifestUri} />
}
