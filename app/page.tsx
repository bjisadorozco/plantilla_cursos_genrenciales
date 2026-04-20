'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useAppTranslation, TranslatedText } from '@/contexts/TranslationContext'
import { TopNavbar } from '@/components/layout/TopNavbar'

export default function LandingPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Top Navbar with language flag */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <nav className="max-w-[800px] mx-auto px-4 h-14 flex items-center justify-end">
          <LanguageFlag />
        </nav>
      </div>

      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="/images/video-poster.jpg"
          suppressHydrationWarning
        >
          <source src="/videos/corporate-bg.mp4" type="video/mp4" />
        </video>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      {/* Content */}
      <div className={`relative z-10 min-h-screen flex flex-col justify-between p-6 md:p-12 lg:p-16 transition-opacity duration-700 acc-exclude-color ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Top Badge */}
        <div className="flex items-center gap-2 pt-10">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-secondary font-semibold text-sm tracking-wider uppercase">
            <TranslatedText>Inicia tu formación</TranslatedText>
          </span>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
            <TranslatedText>Título del curso</TranslatedText>
          </h1>

          {/* Accent Line */}
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-primary mt-6" />

          {/* Description */}
          <p className="text-gray-300 text-base md:text-lg mt-6 leading-relaxed max-w-xl">
            <TranslatedText>Descripción del curso</TranslatedText>
          </p>
        </div>

        {/* Bottom Section */}
        <div className="flex items-end justify-between">
          <Link
            href="/ruta"
            className="group bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-full flex items-center gap-3 transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
          >
            <span className="uppercase tracking-wider text-sm">
              <TranslatedText>Comenzar curso</TranslatedText>
            </span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}

// Flag component for landing page
function LanguageFlag() {
  const { language, setLanguage } = useAppTranslation()
  
  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es')
  }

  return (
    <button
      onClick={toggleLanguage}
      className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors flex items-center gap-1.5"
      aria-label={language === 'es' ? 'Switch to English' : 'Cambiar a Espanol'}
    >
      {language === 'es' ? (
        <svg width="24" height="18" viewBox="0 0 24 18" className="rounded-sm">
          <rect width="24" height="18" fill="#c60b1e"/>
          <rect width="24" height="9" y="4.5" fill="#ffc400"/>
        </svg>
      ) : (
        <svg width="24" height="18" viewBox="0 0 24 18" className="rounded-sm">
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
      )}
      <span className="text-xs font-semibold text-white uppercase">
        {language}
      </span>
    </button>
  )
}
