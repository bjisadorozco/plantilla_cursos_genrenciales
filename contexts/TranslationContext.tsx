'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

type Language = 'es' | 'en'

interface TranslationContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

// Simple translation cache
const translationCache: Record<string, string> = {}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es')

  // Initialize language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('app-language') as Language
    if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
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

    if (translationCache[originalText]) {
      setTranslatedText(translationCache[originalText])
      return
    }

    const translate = async () => {
      setLoading(true)
      try {
        // Using a free Google Translate endpoint (unofficial, but works for small projects)
        const response = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=en&dt=t&q=${encodeURIComponent(originalText)}`
        )
        const data = await response.json()
        const translated = data[0].map((item: any) => item[0]).join('')
        translationCache[originalText] = translated
        setTranslatedText(translated)
      } catch (error) {
        console.error('Translation error:', error)
        setTranslatedText(originalText) // Fallback to original
      } finally {
        setLoading(false)
      }
    }

    translate()
  }, [originalText, language])

  if (!originalText) return <>{children}</>

  return <span className={className}>{translatedText}</span>
}
