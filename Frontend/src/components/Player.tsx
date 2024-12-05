import React from 'react'
import shaka from 'shaka-player'

// Adapted from https://dev.to/vanyaxk/shaka-player-for-media-playback-implementation-use-cases-pros-and-cons-3b87
const exampleManifestUri =
  'https://storage.googleapis.com/livefeed-bucket/output/manifest.m3u8'

async function initPlayer() {
  // Install polyfills to patch out browser incompatibilities
  shaka.polyfill.installAll()
  // Check if your browser supports Shaka at all
  if (!shaka.Player.isBrowserSupported()) {
    console.error('Browser not supported!')
    return
  }

  //Search for available video element and attach the player to it
  const player = new shaka.Player(document.getElementById('video'))
  // listen for errors for further error handling
  player.addEventListener('error', console.error)
  try {
    await player.load(exampleManifestUri)
    console.log('player has loaded the video, you can play it now')
  } catch (error) {
    console.log(error)
  }
}

// TODO: run from Player component
document.addEventListener('DOMContentLoaded', initPlayer)

export default function Player() {
  return <p>Player</p>
}
