import React, { createContext, useContext, useState } from 'react'

type Episode = {
  title: string
  members: string
  thumbnail: string
  duration: number
  url: string
}

type PlayerContextData = {
  episodeList: Episode[]
  currentEpisodeIndex: number
  isPlaying: boolean
  isLooping: boolean
  isShuffling: boolean
  play: (episode: Episode) => void
  playList: (list: Episode[], index: number) => void
  togglePlay: () => void
  toggleLoop: () => void
  toggleShuffle: () => void
  playNext: () => void
  playPrevius: () => void
  setPlayingState: (state: boolean) => void
  clearPlayerState: () => void
  hasNext: boolean
  hasPrevius: boolean
}

type PlayerContentProviderProps = {
  children: React.ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider ({ children }: PlayerContentProviderProps) {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  function togglePlay(){
    setIsPlaying(state => !state)
  }
  
  function toggleLoop(){
    setIsLooping(state => !state)
  }

  function toggleShuffle(){
    setIsShuffling(state => !state)
  }

  function play (episode: Episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }
  
  function setPlayingState ( state: boolean ) {
    setIsPlaying(state)
  }

  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length
  const hasPrevius = currentEpisodeIndex > 0
  
  function playNext () {

    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)

      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  function playPrevius () {
    if (hasPrevius) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  function clearPlayerState () {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  return (
    <PlayerContext.Provider value={{ 
      episodeList, 
      currentEpisodeIndex, 
      play, 
      playList,
      togglePlay, 
      toggleLoop,
      toggleShuffle,
      isPlaying, 
      isLooping,
      isShuffling,
      setPlayingState,
      playNext,
      playPrevius,
      hasNext,
      hasPrevius,
      clearPlayerState
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}