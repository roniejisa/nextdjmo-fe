"use client"
import MusicProvider from './MusicProvider'
import MusicPlayer from './MusicPlayer'

const page = () => {
  return (
    <MusicProvider>
      <MusicPlayer />
    </MusicProvider>
  )
}

export default page