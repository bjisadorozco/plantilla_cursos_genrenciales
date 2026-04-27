'use client'

import { ChevronLeft, Home, Accessibility, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppTranslation, TranslatedText } from '@/contexts/TranslationContext'

interface TopNavbarProps {
  showBack?: boolean
  showHome?: boolean
  showLanguage?: boolean
  showAccessibility?: boolean
  showMenu?: boolean
  slideIndicator?: string
  onMenuClick?: () => void
  onAccessibilityClick?: () => void
  transparent?: boolean
}

// Flag SVG components
function SpainFlag() {
  return (
    <svg width="24" height="18" viewBox="0 0 24 18" className="rounded-sm shadow-sm">
      <rect width="24" height="18" fill="#c60b1e"/>
      <rect width="24" height="9" y="4.5" fill="#ffc400"/>
    </svg>
  )
}

function USFlag() {
  return (
    <svg width="24" height="18" viewBox="0 0 24 18" className="rounded-sm shadow-sm">
      <rect width="24" height="18" fill="#fff"/>
      <rect width="24" height="1.38" y="0" fill="#b22234"/>
      <rect width="24" height="1.38" y="2.77" fill="#b22234"/>
      <rect width="24" height="1.38" y="5.54" fill="#b22234"/>
      <rect width="24" height="1.38" y="8.31" fill="#b22234"/>
      <rect width="24" height="1.38" y="11.08" fill="#b22234"/>
      <rect width="24" height="1.38" y="13.85" fill="#b22234"/>
      <rect width="24" height="1.38" y="16.62" fill="#b22234"/>
      <rect width="9.6" height="9.69" fill="#3c3b6e"/>
    </svg>
  )
}

export function LanguageToggle() {
  const { language, setLanguage } = useAppTranslation()

  const toggleLanguage = () => {
    const newLang = language === 'es' ? 'en' : 'es'
    setLanguage(newLang)
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="p-1.5 rounded-lg hover:bg-muted transition-colors flex items-center gap-1.5 shadow-sm bg-white border border-border cursor-pointer"
      aria-label={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      {language === 'es' ? <SpainFlag /> : <USFlag />}
      <span className="text-xs font-semibold text-gray-700 uppercase">{language}</span>
    </button>
  )
}

export function TopNavbar({
  showBack = true,
  showHome = true,
  showLanguage = true,
  showAccessibility = true,
  showMenu = true,
  slideIndicator,
  onMenuClick,
  onAccessibilityClick,
  transparent = false,
}: TopNavbarProps) {
  const { language, setLanguage } = useAppTranslation()
  const router = useRouter()

  const toggleLanguage = () => {
    const newLang = language === 'es' ? 'en' : 'es'
    setLanguage(newLang)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 acc-exclude-color ${transparent ? 'bg-transparent border-none backdrop-blur-none' : 'bg-background/95 backdrop-blur-sm border-b border-border'}`}>
      <div className="max-w-[800px] mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-muted transition-colors cursor-pointer"
              aria-label="Volver"
            >
              <ChevronLeft className="w-5 h-5 text-gray-dark" />
            </button>
          )}
          
          {showHome && (
            <a
              href="/"
              className="p-2 rounded-full hover:bg-muted transition-colors cursor-pointer"
              aria-label="Inicio"
            >
              <Home className="w-5 h-5 text-[#6e3cd2]" />
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          {slideIndicator && (
            <span className="text-sm font-semibold text-[#91208a] bg-[#fdf2ff] border border-[#f5d9ff] px-4 py-1.5 rounded-full shadow-sm">
              <TranslatedText>{slideIndicator}</TranslatedText>
            </span>
          )}
          
          {showAccessibility && (
            <button
              onClick={onAccessibilityClick}
              className="p-2.5 rounded-full bg-[#f0f4f8] hover:bg-[#e1e8f0] transition-colors shadow-sm cursor-pointer"
              aria-label="Accessibility options"
            >
              <Accessibility className="w-5 h-5 text-[#91208a]" />
            </button>
          )}
          
          {showLanguage && <LanguageToggle />}
          
          {showMenu && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-full hover:bg-muted transition-colors cursor-pointer"
              aria-label="Menú"
            >
              <Menu className="w-6 h-6 text-[#91208a]" />
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
