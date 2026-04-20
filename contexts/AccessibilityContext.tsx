'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAppTranslation } from './TranslationContext'

interface AccessibilityState {
  fontSizeMultiplier: number
  lineHeightMultiplier: number
  saturation: boolean
  highContrast: boolean
  lowContrast: boolean
  negative: boolean
  grayscale: boolean
  legibleFont: boolean
  linksHighlighted: boolean
  headingsHighlighted: boolean
  bigCursor: boolean
  keyboardNav: boolean
  voiceNav: boolean
  imagesHidden: boolean
  soundsStopped: boolean
  focusMode: boolean
  dyslexiaStyle: number // 0: none, 1: OpenDyslexic, 2: Comic Sans, 3: Verdana, 4: Roboto
  position: 'left' | 'right'
}

interface AccessibilityContextType extends AccessibilityState {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  setPosition: (pos: 'left' | 'right') => void
  increaseFontSize: () => void
  decreaseFontSize: () => void
  increaseLineHeight: () => void
  resetAll: () => void
  toggleSaturation: () => void
  toggleHighContrast: () => void
  toggleLowContrast: () => void
  toggleNegative: () => void
  toggleGrayscale: () => void
  toggleLegibleFont: () => void
  toggleLinksHighlighted: () => void
  toggleHeadingsHighlighted: () => void
  toggleBigCursor: () => void
  toggleKeyboardNav: () => void
  toggleVoiceNav: () => void
  toggleImagesHidden: () => void
  toggleSoundsStopped: () => void
  toggleFocusMode: () => void
  setDyslexiaStyle: (style: number) => void
  toggleTextToSpeech: () => void
  isTextToSpeechOn: boolean
}

const initialState: AccessibilityState = {
  fontSizeMultiplier: 1,
  lineHeightMultiplier: 1,
  saturation: false,
  highContrast: false,
  lowContrast: false,
  negative: false,
  grayscale: false,
  legibleFont: false,
  linksHighlighted: false,
  headingsHighlighted: false,
  bigCursor: false,
  keyboardNav: false,
  voiceNav: false,
  imagesHidden: false,
  soundsStopped: false,
  focusMode: false,
  dyslexiaStyle: 0,
  position: 'right',
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { language } = useAppTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [state, setState] = useState<AccessibilityState>(initialState)
  const [isTextToSpeechOn, setIsTextToSpeechOn] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Initial mount and load from localStorage
  useEffect(() => {
    setMounted(true)
    const savedState = localStorage.getItem('accessibility-state')
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        setState(parsed)
        // Apply immediately on mount to avoid flicker
        applyAccessibilityStyles(parsed)
      } catch (e) {
        console.error('Error loading accessibility state', e)
      }
    }
  }, [])

  // Save state to localStorage and apply styles
  useEffect(() => {
    if (!mounted) return
    
    localStorage.setItem('accessibility-state', JSON.stringify(state))
    applyAccessibilityStyles(state)
  }, [state, mounted])

  // Keyboard navigation effect
  useEffect(() => {
    if (!mounted || !state.keyboardNav) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') window.scrollBy(0, 50)
      else if (e.key === 'ArrowUp') window.scrollBy(0, -50)
      else if (e.key === 'ArrowRight') window.scrollBy(50, 0)
      else if (e.key === 'ArrowLeft') window.scrollBy(-50, 0)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.keyboardNav, mounted])

  // Custom cursor effect
  useEffect(() => {
    if (!mounted || !state.bigCursor) return

    const cursorImg = document.createElement('img')
    cursorImg.src = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSIyOS4xODhweCIgaGVpZ2h0PSI0My42MjVweCIgdmlld0JveD0iMCAwIDI5LjE4OCA0My42MjUiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI5LjE4OCA0My42MjUiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxwb2x5Z29uIGZpbGw9IiNGRkZGRkYiIHN0cm9rZT0iI0Q5REFEOSIgc3Ryb2tlLXdpZHRoPSIxLjE0MDYiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgcG9pbnRzPSIyLjgsNC41NDkgMjYuODQ3LDE5LjkwMiAxNi45NjQsMjIuNzAxIDI0LjIzOSwzNy43NDkgMTguMjc4LDQyLjAxNyA5Ljc0MSwzMC43MjQgMS4xMzgsMzUuODA5ICIvPjxnPjxnPjxnPjxwYXRoIGZpbGw9IiMyMTI2MjciIGQ9Ik0yOS4xNzUsMjEuMTU1YzAuMDcxLTAuNjEzLTAuMTY1LTEuMjUzLTAuNjM1LTEuNTczTDIuMTY1LDAuMjU4Yy0wLjQyNC0wLjMyLTAuOTg4LTAuMzQ2LTEuNDM1LTAuMDUzQzAuMjgyLDAuNDk3LDAsMS4wMywwLDEuNjE3djM0LjE3MWMwLDAuNjEzLDAuMzA2LDEuMTQ2LDAuNzc2LDEuNDM5YzAuNDcxLDAuMjY3LDEuMDU5LDAuMjEzLDEuNDgyLTAuMTZsNy40ODItNi4zNDRsNi44NDcsMTIuMTU1YzAuMjU5LDAuNDgsMC43MjksMC43NDYsMS4yLDAuNzQ2YzAuMjM1LDAsMC40OTQtMC4wOCwwLjcwNi0wLjIxM2w2Ljk4OC00LjU4NWMwLjMyOS0wLjIxMywwLjU2NS0wLjU4NiwwLjY1OS0xLjAxM2MwLjA5NC0wLjQyNiwwLjAyNC0wLjg4LTAuMTg4LTEuMjI2bC02LjM3Ni0xMS4zODJsOC42MTEtMi43NDVDMjguNzA1LDIyLjI3NCwyOS4xMDUsMjEuNzY4LDI5LjE3NSwyMS4xNTV6IE0xNi45NjQsMjIuNzAxYy0wLjQyNCwwLjEzMy0wLjc3NiwwLjUwNi0wLjk0MSwwLjk2Yy0wLjE2NSwwLjQ4LTAuMTE4LDEuMDEzLDAuMTE4LDEuNDM5bDYuNTg4LDExLjc4MWwtNC41NDEsMi45ODVsLTYuODk0LTEyLjMxNWMtMC4yMTItMC4zNzMtMC41NDEtMC42NC0wLjk0MS0wLjcyYy0wLjA5NC0wLjAyNy0wLjE2NS0wLjAyNy0wLjI1OS0wLjAyN2MtMC4zMDYsMC0wLjU4OCwwLjEwNy0wLjg0NywwLjMyTDIuOCwzMi41OVY0LjU0OUwyNC40LDIwLjM1NUwxNi45NjQsMjIuNzAxeiIvPjwvZz48L2c+PC9nPjwvZz48L3N2Zz4='
    cursorImg.style.width = '60px'
    cursorImg.style.height = '60px'
    cursorImg.style.position = 'fixed'
    cursorImg.style.pointerEvents = 'none'
    cursorImg.style.zIndex = '2147483647'
    cursorImg.id = 'acc-custom-cursor'
    document.body.appendChild(cursorImg)

    const moveCursor = (e: MouseEvent) => {
      cursorImg.style.left = (e.clientX - 20) + 'px'
      cursorImg.style.top = (e.clientY - 20) + 'px'
    }

    window.addEventListener('mousemove', moveCursor)
    
    return () => {
      window.removeEventListener('mousemove', moveCursor)
      cursorImg.remove()
    }
  }, [state.bigCursor, mounted])

  const applyAccessibilityStyles = (s: AccessibilityState) => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    const body = document.body
    
    console.log('--- ACCESSIBILITY SYNC ---', {
      fontSize: s.fontSizeMultiplier,
      lineHeight: s.lineHeightMultiplier,
      saturation: s.saturation,
      negative: s.negative,
      grayscale: s.grayscale,
      highContrast: s.highContrast,
      lowContrast: s.lowContrast,
      dyslexia: s.dyslexiaStyle,
      legible: s.legibleFont,
      focus: s.focusMode,
      images: s.imagesHidden,
      links: s.linksHighlighted,
      headings: s.headingsHighlighted
    })
    
    // 1. Direct application for text scaling (INSTANT)
    root.style.fontSize = `${100 * s.fontSizeMultiplier}%`
    
    // 2. Build filters string for total coverage
    const filters = []
    if (s.negative) filters.push('invert(100%)')
    if (s.grayscale) filters.push('grayscale(100%)')
    if (s.saturation) filters.push('saturate(0.5)')
    
    const filterString = filters.join(' ') || 'none'
    root.style.filter = filterString
    
    // 3. Special case: Counter-filter for widget and protected elements
    const protectedElements = ['accessibility-widget-root', 'slide-navigation-container']
    protectedElements.forEach(id => {
      const el = document.getElementById(id)
      if (el) {
        let revertFilter = ''
        if (s.negative) revertFilter += 'invert(100%) '
        el.style.filter = revertFilter || 'none'
      }
    })

    // 4. Dynamic Style Tag for Micro-functions that need universal selectors
    let styleTag = document.getElementById('acc-dynamic-styles') as HTMLStyleElement
    if (!styleTag) {
      styleTag = document.createElement('style')
      styleTag.id = 'acc-dynamic-styles'
      document.head.appendChild(styleTag)
    }

    let dynamicCSS = ''

    if (s.lineHeightMultiplier > 1) {
      const actualLineHeight = 1.5 + (s.lineHeightMultiplier - 1)
      dynamicCSS += `body *:not(#accessibility-widget-root, #accessibility-widget-root *, #slide-navigation-container, #slide-navigation-container *) { line-height: ${actualLineHeight} !important; }`
    }

    if (s.legibleFont) {
      dynamicCSS += `*:not(#accessibility-widget-root, #accessibility-widget-root *, #slide-navigation-container, #slide-navigation-container *) { font-family: Arial, sans-serif !important; letter-spacing: 0.05em !important; }`
    }

    if (s.linksHighlighted) {
      dynamicCSS += `a:not(#accessibility-widget-root *, #slide-navigation-container *) { background-color: #FFFF00 !important; color: #000 !important; font-weight: bold !important; padding: 2px !important; border-radius: 4px !important; }`
    }

    if (s.headingsHighlighted) {
      dynamicCSS += `h1:not(#accessibility-widget-root *, #slide-navigation-container *), h2:not(#accessibility-widget-root *, #slide-navigation-container *), h3:not(#accessibility-widget-root *, #slide-navigation-container *), h4:not(#accessibility-widget-root *, #slide-navigation-container *), h5:not(#accessibility-widget-root *, #slide-navigation-container *), h6:not(#accessibility-widget-root *, #slide-navigation-container *) { background-color: #FFFF00 !important; color: #000 !important; border: 2px solid #000 !important; padding: 4px !important; border-radius: 4px !important; }`
    }

    if (s.imagesHidden) {
      dynamicCSS += `img:not(#accessibility-widget-root *), svg:not(#accessibility-widget-root *, #slide-navigation-container *), [style*="background-image"]:not(#accessibility-widget-root *) { visibility: hidden !important; opacity: 0 !important; }`
    }

    if (s.dyslexiaStyle > 0) {
      const fonts = ['', "'OpenDyslexic', sans-serif", "'Comic Sans MS', cursive", "'Verdana', sans-serif", "'Roboto', sans-serif"]
      dynamicCSS += `*:not(#accessibility-widget-root, #accessibility-widget-root *, #slide-navigation-container, #slide-navigation-container *) { font-family: ${fonts[s.dyslexiaStyle]} !important; }`
    }

    styleTag.innerHTML = dynamicCSS

    // 5. Toggle classes on HTML/BODY for the Core CSS in globals.css
    const classes = {
      'acc-high-contrast': s.highContrast,
      'acc-low-contrast': s.lowContrast,
      'acc-focus-mode': s.focusMode,
      'acc-hide-cursor': s.bigCursor,
      'acc-negative': s.negative,
      'acc-grayscale': s.grayscale,
      'acc-desaturated': s.saturation
    }

    Object.entries(classes).forEach(([className, active]) => {
      if (active) {
        root.classList.add(className)
        body.classList.add(className)
      } else {
        root.classList.remove(className)
        body.classList.remove(className)
      }
    })

    // Remove any filter from widget if it's being affected by inheritance
    const widget = document.getElementById('accessibility-widget-root')
    if (widget) {
      widget.style.filter = s.negative ? 'invert(100%)' : 'none'
      if (!s.negative && (s.grayscale || s.saturation)) {
        widget.style.filter = 'none'
      }
    }

    // 6. Stop sounds logic
    if (s.soundsStopped) {
      const audios = document.querySelectorAll('audio, video')
      audios.forEach((a: any) => {
        a.muted = true
        if (typeof a.pause === 'function') a.pause()
      })
    }
  }

  const increaseFontSize = () => {
    console.log('BTN CLICK: Increase Font Size')
    setState(prev => ({ ...prev, fontSizeMultiplier: Math.min(prev.fontSizeMultiplier + 0.1, 2) }))
  }
  
  const decreaseFontSize = () => {
    console.log('BTN CLICK: Decrease Font Size')
    setState(prev => ({ ...prev, fontSizeMultiplier: Math.max(prev.fontSizeMultiplier - 0.1, 0.8) }))
  }

  const increaseLineHeight = () => {
    console.log('BTN CLICK: Increase Line Height')
    setState(prev => ({ ...prev, lineHeightMultiplier: Math.min(prev.lineHeightMultiplier + 0.1, 2) }))
  }
  
  const resetAll = () => {
    console.log('BTN CLICK: Reset All')
    setState(initialState)
    window.speechSynthesis.cancel()
    setIsTextToSpeechOn(false)
  }

  const toggleSaturation = () => {
    console.log('TOGGLE: Saturation')
    setState(prev => ({ ...prev, saturation: !prev.saturation }))
  }
  const toggleHighContrast = () => {
    console.log('TOGGLE: High Contrast')
    setState(prev => ({ ...prev, highContrast: !prev.highContrast, lowContrast: false }))
  }
  const toggleLowContrast = () => {
    console.log('TOGGLE: Low Contrast')
    setState(prev => ({ ...prev, lowContrast: !prev.lowContrast, highContrast: false }))
  }
  const toggleNegative = () => {
    console.log('TOGGLE: Negative')
    setState(prev => ({ ...prev, negative: !prev.negative }))
  }
  const toggleGrayscale = () => {
    console.log('TOGGLE: Grayscale')
    setState(prev => ({ ...prev, grayscale: !prev.grayscale }))
  }
  const toggleLegibleFont = () => {
    console.log('TOGGLE: Legible Font')
    setState(prev => ({ ...prev, legibleFont: !prev.legibleFont }))
  }
  const toggleLinksHighlighted = () => {
    console.log('TOGGLE: Links Highlighted')
    setState(prev => ({ ...prev, linksHighlighted: !prev.linksHighlighted }))
  }
  const toggleHeadingsHighlighted = () => {
    console.log('TOGGLE: Headings Highlighted')
    setState(prev => ({ ...prev, headingsHighlighted: !prev.headingsHighlighted }))
  }
  const toggleBigCursor = () => {
    console.log('TOGGLE: Big Cursor')
    setState(prev => ({ ...prev, bigCursor: !prev.bigCursor }))
  }
  const toggleKeyboardNav = () => {
    console.log('TOGGLE: Keyboard Nav')
    setState(prev => ({ ...prev, keyboardNav: !prev.keyboardNav }))
  }
  const toggleVoiceNav = () => {
    console.log('TOGGLE: Voice Nav')
    const next = !state.voiceNav
    setState(prev => ({ ...prev, voiceNav: next }))
    if (next) {
      alert(language === 'es' ? 'Navegación por voz activada. Di "scroll down" o "scroll up" para navegar.' : 'Voice navigation activated. Say "scroll down" or "scroll up" to navigate.')
    }
  }
  const toggleImagesHidden = () => {
    console.log('TOGGLE: Images Hidden')
    setState(prev => ({ ...prev, imagesHidden: !prev.imagesHidden }))
  }
  const toggleSoundsStopped = () => {
    console.log('TOGGLE: Sounds Stopped')
    setState(prev => ({ ...prev, soundsStopped: !prev.soundsStopped }))
  }
  const toggleFocusMode = () => {
    console.log('TOGGLE: Focus Mode')
    setState(prev => ({ ...prev, focusMode: !prev.focusMode }))
  }
  const setDyslexiaStyle = (style: number) => {
    console.log('SET: Dyslexia Style', style)
    setState(prev => ({ ...prev, dyslexiaStyle: style }))
  }
  const setPosition = (position: 'left' | 'right') => {
    console.log('SET: Position', position)
    setState(prev => ({ ...prev, position }))
  }

  const toggleTextToSpeech = () => {
    console.log('TOGGLE: Text To Speech')
    if (isTextToSpeechOn) {
      window.speechSynthesis.cancel()
      setIsTextToSpeechOn(false)
    } else {
      let allText = document.body.innerText
      // Clean widget text from speech
      const widget = document.getElementById('accessibility-widget-root')
      if (widget) {
        allText = allText.replace(widget.innerText, '')
      }
      
      const speech = new SpeechSynthesisUtterance(allText)
      speech.lang = language === 'es' ? 'es-MX' : 'en-US'
      speech.onend = () => setIsTextToSpeechOn(false)
      window.speechSynthesis.speak(speech)
      setIsTextToSpeechOn(true)
    }
  }

  return (
    <AccessibilityContext.Provider value={{
      ...state,
      isOpen,
      setIsOpen,
      setPosition,
      increaseFontSize,
      decreaseFontSize,
      increaseLineHeight,
      resetAll,
      toggleSaturation,
      toggleHighContrast,
      toggleLowContrast,
      toggleNegative,
      toggleGrayscale,
      toggleLegibleFont,
      toggleLinksHighlighted,
      toggleHeadingsHighlighted,
      toggleBigCursor,
      toggleKeyboardNav,
      toggleVoiceNav,
      toggleImagesHidden,
      toggleSoundsStopped,
      toggleFocusMode,
      setDyslexiaStyle,
      toggleTextToSpeech,
      isTextToSpeechOn,
    }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}
