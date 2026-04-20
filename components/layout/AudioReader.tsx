'use client'

import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useAudio } from '@/contexts/AudioContext'
import { useAccessibility } from '@/contexts/AccessibilityContext'
import { useAppTranslation, TranslatedText } from '@/contexts/TranslationContext'
import { cn } from '@/lib/utils'
import { Volume2 } from 'lucide-react'

interface AudioReaderProps {
  textSelector?: string
  autoplay?: boolean
  className?: string
}

export function AudioReader({ 
  textSelector = '#active-slide-content', 
  autoplay = false,
  className 
}: AudioReaderProps) {
  const { 
    isAudioReaderActive, 
    setIsAudioReaderActive, 
    isSpeaking,
    setIsSpeaking, 
    stopAll,
    registerPlaying,
    voicesLoaded,
    setVoicesLoaded
  } = useAudio()
  
  const { soundsStopped, toggleSoundsStopped } = useAccessibility()
  const { language } = useAppTranslation()
  
  const [currentUtteranceIndex, setCurrentUtteranceIndex] = useState(0)
  const [totalUtterances, setTotalUtterances] = useState(0)
  
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const utterancesRef = useRef<SpeechSynthesisUtterance[]>([])
  const elementsRef = useRef<Element[]>([])
  const isPlayingRef = useRef(false)

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis
    }
    
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  const findNeutralVoice = useCallback((voices: SpeechSynthesisVoice[]) => {
    let voicePriorities
    if (language === 'en') {
      voicePriorities = [
        { lang: "en-US" }, { lang: "en-GB" }, { lang: "en-CA" }, { lang: "en-AU" }, { lang: "en" }
      ]
    } else {
      voicePriorities = [
        { lang: "es-MX" }, { lang: "es-CO" }, { lang: "es-419" }, { lang: "es-AR" }, { lang: "es-CL" }, { lang: "es-PE" },
        { lang: "es", exclude: "es-ES" }, { lang: "es-ES" }
      ]
    }

    for (const priority of voicePriorities) {
      const matchingVoices = voices.filter((voice) => {
        if ('exclude' in priority && voice.lang === priority.exclude) return false
        return voice.lang.startsWith(priority.lang)
      })

      if (matchingVoices.length > 0) {
        const femaleVoice = matchingVoices.find(
          (voice) => voice.name.toLowerCase().includes("female") || !voice.name.toLowerCase().includes("male")
        )
        return femaleVoice || matchingVoices[0]
      }
    }
    return voices.find((voice) => voice.lang.startsWith(language === 'en' ? 'en' : 'es'))
  }, [language])

  const speakFeedback = useCallback((utterance: SpeechSynthesisUtterance) => {
    const synth = synthRef.current
    if (!synth) return
    
    // Some browsers require a small interaction or pause before speaking
    // and speech synthesis can sometimes get "stuck" if cancel is called too fast
    synth.cancel()
    
    setTimeout(() => {
      if (synthRef.current && isPlayingRef.current) {
        synthRef.current.speak(utterance)
      }
    }, 100)
  }, [])

  const prepareContent = useCallback(() => {
    const synth = synthRef.current
    if (!synth) return 0

    // Find only elements within the ACTIVE slide section
    const activeSection = document.querySelector('#active-slide-content') || 
                          document.querySelector('.content-section.active') || 
                          document.querySelector('[data-active="true"]') ||
                          document.querySelector(textSelector)
    
    if (!activeSection) {
      console.log("AudioReader: No active section found for selector", textSelector)
      return 0
    }

    const rawElements = Array.from(activeSection.querySelectorAll(".readable, h1, h2, h3, h4, h5, h6, p, li"))
    
    // Filter nested elements and elements inside audio reader itself
    const elements = rawElements.filter((el, index) => {
      // Don't read the audio reader itself or specific excluded sections
      if (el.closest('.audio-reader-container') || el.closest('.acc-exclude-color')) {
        return false
      }
      // Check if it's hidden (ignore opacity during animations)
      const style = window.getComputedStyle(el)
      if (style.display === 'none' || style.visibility === 'hidden') {
        return false
      }

      // Check if it's already contained in another element from the list
      // This prevents double reading (e.g. parent and child both being in the list)
      return !rawElements.some((otherEl, otherIndex) => {
        return index !== otherIndex && otherEl.contains(el) && otherEl !== el
      })
    })

    elementsRef.current = elements
    
    if (elements.length === 0) {
      console.warn("AudioReader: No readable elements found in active section")
      return 0
    }

    const voices = synth.getVoices()
    const neutralVoice = findNeutralVoice(voices)
    
    const utterances: SpeechSynthesisUtterance[] = []
    
    elements.forEach((el, i) => {
      const text = el.textContent?.trim()
      if (!text || text.length < 2) return

      const utterance = new SpeechSynthesisUtterance(text)
      if (neutralVoice) {
        utterance.voice = neutralVoice
        utterance.lang = neutralVoice.lang
      } else {
        utterance.lang = language === 'en' ? "en-US" : "es-MX"
      }

      // Rates based on element type
      if (el.tagName.match(/^H[1-6]$/)) {
        utterance.rate = 0.85 // Slower for titles
      } else {
        utterance.rate = el.tagName === "LI" ? 0.9 : 0.95
      }

      utterance.onstart = () => {
        el.classList.add("being-read")
        
        // Scroll element into view if needed
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })

        const words = text.split(/\s+/).length
        const estimatedDuration = (words / 150) * 60
        if (el instanceof HTMLElement) {
          el.style.setProperty('--reading-duration', `${estimatedDuration}s`)
        }

        setCurrentUtteranceIndex(i)
      }

      utterance.onend = () => {
        el.classList.remove("being-read")
        if (el instanceof HTMLElement) {
          el.style.removeProperty('--reading-duration')
        }

        // Only proceed if we are still actively playing (not canceled/reset)
        if (!isPlayingRef.current) return

        if (i < utterancesRef.current.length - 1) {
          setTimeout(() => {
            if (isPlayingRef.current) {
              speakFeedback(utterancesRef.current[i + 1])
            }
          }, 600) // Increased delay between paragraphs
        } else {
          isPlayingRef.current = false
          setIsSpeaking(false)
          // Don't turn off the mode, just stop speaking
        }
      }

      utterance.onerror = (event) => {
        // Only log errors that are not 'interrupted' or 'canceled'
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          console.error("SpeechSynthesis Error:", event)
        }
        el.classList.remove("being-read")
        
        // Only proceed if we are still actively playing
        if (!isPlayingRef.current) return

        // If it's a 'not-allowed' error, it might be a user gesture issue
        if (i < utterancesRef.current.length - 1) {
          speakFeedback(utterancesRef.current[i + 1])
        } else {
          isPlayingRef.current = false
          setIsSpeaking(false)
        }
      }

      utterances.push(utterance)
    })

    utterancesRef.current = utterances
    setTotalUtterances(utterances.length)
    setCurrentUtteranceIndex(0)
    return utterances.length
  }, [textSelector, language, findNeutralVoice, setIsSpeaking, setIsAudioReaderActive, speakFeedback])

  // Handle toggle
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newState = !isAudioReaderActive
    
    // If the user is trying to turn ON the audio reader, but sounds are globally stopped
    // automatically turn sounds back ON. This provides a better user experience.
    if (newState && soundsStopped) {
      toggleSoundsStopped()
    }
    
    setIsAudioReaderActive(newState)
    
    if (!newState) {
      isPlayingRef.current = false
      setIsSpeaking(false)
      if (synthRef.current) {
        synthRef.current.cancel()
      }
      elementsRef.current.forEach(el => el.classList.remove("being-read"))
    } else {
      stopAll() // Stop other audios
    }
  }

  // Effect to handle external stops or accessibility
  useEffect(() => {
    if (soundsStopped && isAudioReaderActive) {
      setIsAudioReaderActive(false)
      isPlayingRef.current = false
      setIsSpeaking(false)
      if (synthRef.current) {
        synthRef.current.cancel()
      }
      elementsRef.current.forEach(el => el.classList.remove("being-read"))
    }
  }, [soundsStopped, isAudioReaderActive, setIsAudioReaderActive, setIsSpeaking])

  // Reset when slide changes OR when activated
  useEffect(() => {
    let prepTimer: NodeJS.Timeout | null = null;
    let retryTimer: NodeJS.Timeout | null = null;

    if (isAudioReaderActive && voicesLoaded) {
      // Always clear previous state first
      isPlayingRef.current = false
      if (synthRef.current) {
        synthRef.current.cancel()
      }
      document.querySelectorAll(".being-read").forEach(el => el.classList.remove("being-read"))
      
      prepTimer = setTimeout(() => {
        const count = prepareContent()
        
        if (count > 0) {
          isPlayingRef.current = true
          setIsSpeaking(true)
          if (utterancesRef.current.length > 0) {
            speakFeedback(utterancesRef.current[0])
          }
        } else {
          // If no content found after a delay, maybe reset state?
          // Let's give it one more try if it's zero
          retryTimer = setTimeout(() => {
            const secondCount = prepareContent()
            if (secondCount > 0) {
              isPlayingRef.current = true
              setIsSpeaking(true)
              if (utterancesRef.current.length > 0) {
                speakFeedback(utterancesRef.current[0])
              }
            } else {
              setIsSpeaking(false)
            }
          }, 800)
        }
      }, 500) // Give time for new slide to render
    }

    return () => {
      if (prepTimer) clearTimeout(prepTimer)
      if (retryTimer) clearTimeout(retryTimer)
    }
  }, [isAudioReaderActive, voicesLoaded, prepareContent, setIsSpeaking, setIsAudioReaderActive, speakFeedback])

  return (
    <div className={cn(
      "w-full bg-white rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm border border-gray-lighter transition-all duration-300 audio-reader-container",
      className
    )}>
      <div className="flex items-center gap-4">
        <Volume2 className="w-6 h-6 text-gray-400 transition-colors" />
        <div className="flex flex-col">
          <span className="text-gray-800 font-semibold text-lg whitespace-nowrap">
            <TranslatedText>Modo Lectura Audio</TranslatedText>
          </span>
        </div>
      </div>
      
      <button
        onClick={handleToggle}
        className={cn(
          "w-14 h-7 rounded-full transition-colors relative z-10 cursor-pointer",
          isAudioReaderActive ? "bg-primary" : "bg-gray-200"
        )}
      >
        <span className={cn(
          "absolute top-1 w-5 h-5 rounded-full transition-all shadow-sm bg-white",
          isAudioReaderActive ? "right-1" : "left-1"
        )} />
      </button>
    </div>
  )
}
