'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

interface AudioContextType {
  activeAudio: HTMLAudioElement | null
  registerPlaying: (audio: HTMLAudioElement | null) => void
  stopAll: () => void
  isSpeaking: boolean
  setIsSpeaking: (speaking: boolean) => void
  isAudioReaderActive: boolean
  setIsAudioReaderActive: (active: boolean) => void
  voicesLoaded: boolean
  setVoicesLoaded: (loaded: boolean) => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [activeAudio, setActiveAudio] = useState<HTMLAudioElement | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isAudioReaderActive, setIsAudioReaderActiveState] = useState(false)
  const [voicesLoaded, setVoicesLoaded] = useState(false)

  const setIsAudioReaderActive = useCallback((active: boolean) => {
    setIsAudioReaderActiveState(active)
  }, [])

  // Initialize Speech Synthesis and load voices once at the context level
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const synth = window.speechSynthesis
      
      const loadVoices = () => {
        const voices = synth.getVoices()
        if (voices.length > 0) {
          setVoicesLoaded(true)
        }
      }

      loadVoices()
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices
      }

      // Fallback: set voicesLoaded to true after 2 seconds anyway
      const timer = setTimeout(() => {
        setVoicesLoaded(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const stopAll = useCallback(() => {
    // Stop HTML Audio
    if (activeAudio) {
      activeAudio.pause()
      setActiveAudio(null)
    }

    // Stop Speech Synthesis
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }, [activeAudio])

  const registerPlaying = useCallback((audio: HTMLAudioElement | null) => {
    if (audio && audio !== activeAudio) {
      // If another audio was playing, stop it
      if (activeAudio) {
        activeAudio.pause()
      }
      // If speech was playing, stop it
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
      }
      setActiveAudio(audio)
    } else if (!audio) {
      setActiveAudio(null)
    }
  }, [activeAudio])

  // Monitor isSpeaking to stop HTML audio if speech starts elsewhere
  useEffect(() => {
    if (isSpeaking && activeAudio) {
      activeAudio.pause()
      setActiveAudio(null)
    }
  }, [isSpeaking, activeAudio])

  const value = React.useMemo(() => ({
    activeAudio,
    registerPlaying,
    stopAll,
    isSpeaking,
    setIsSpeaking,
    isAudioReaderActive,
    setIsAudioReaderActive,
    voicesLoaded,
    setVoicesLoaded
  }), [activeAudio, registerPlaying, stopAll, isSpeaking, isAudioReaderActive, voicesLoaded])

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}
