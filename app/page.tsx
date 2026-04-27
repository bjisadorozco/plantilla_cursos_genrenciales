'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { TranslatedText } from '@/contexts/TranslationContext'
import { LanguageToggle } from '@/components/layout/TopNavbar'

export default function LandingPage() {
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-[800px] mx-auto px-4 h-14 flex items-center justify-end">
          <LanguageToggle />
        </div>
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
      <div className="relative z-10 min-h-screen flex flex-col justify-between p-6 md:p-12 lg:p-16 transition-opacity duration-700 acc-exclude-color opacity-100">
        {/* Top Badge */}
        <div className="flex items-center gap-2 pt-20 md:pt-16">
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

// LanguageFlag component removed to use global TopNavbar instead

