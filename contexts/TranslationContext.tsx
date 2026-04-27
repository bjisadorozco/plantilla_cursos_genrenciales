'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

type Language = 'es' | 'en'

interface TranslationContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

// Simple translation cache keyed by language and original text
const translationCache: Record<string, string> = {}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es')

  // Initialize language from localStorage or window.COURSE_DATA
  useEffect(() => {
    const savedLang = localStorage.getItem('app-language') as Language
    const courseData = (window as any).COURSE_DATA
    const backendLang = courseData?.language as Language

    // Check if there's a language in the URL (highest priority)
    const urlParams = new URLSearchParams(window.location.search)
    const urlLang = urlParams.get('lang') as Language

    if (urlLang && (urlLang === 'es' || urlLang === 'en')) {
      setLanguageState(urlLang)
      localStorage.setItem('app-language', urlLang)
    } else if (backendLang && (backendLang === 'es' || backendLang === 'en')) {
      // Only use backend lang if we don't have a saved preference or if it's explicitly provided
      setLanguageState(backendLang)
      localStorage.setItem('app-language', backendLang)
    } else if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
      setLanguageState(savedLang)
    }
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('app-language', lang)
  }, [])

  return (
    <TranslationContext.Provider value={{
      language,
      setLanguage,
    }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useAppTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useAppTranslation must be used within a TranslationProvider')
  }
  return context
}

/**
 * Component to wrap text and translate it automatically if needed.
 */
export function TranslatedText({ children, className }: { children: ReactNode, className?: string }) {
  const { language } = useAppTranslation()
  const originalText = typeof children === 'string' ? children : ''
  const [translatedText, setTranslatedText] = useState<string>(originalText)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (language === 'es' || !originalText) {
      setTranslatedText(originalText)
      return
    }

    const cacheKey = `${language}:${originalText}`

    if (translationCache[cacheKey]) {
      setTranslatedText(translationCache[cacheKey])
      return
    }

    const translate = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `/api/translate?text=${encodeURIComponent(originalText)}&lang=${language}`
        )
        const data = await response.json()
        const translated = data.translatedText || originalText
        translationCache[cacheKey] = translated
        setTranslatedText(translated)
      } catch (error) {
        console.error('Translation error:', error)
        setTranslatedText(originalText)
      } finally {
        setLoading(false)
      }
    }

    translate()
  }, [originalText, language])

  if (!originalText) return <>{children}</>

  return <span className={className}>{translatedText}</span>
}
