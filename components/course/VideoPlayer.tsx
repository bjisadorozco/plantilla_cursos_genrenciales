'use client'

import { cn } from '@/lib/utils'
import { TranslatedText } from '@/contexts/TranslationContext'

interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  label?: string
  className?: string
}

export function VideoPlayer({
  src,
  poster,
  title,
  label,
  className,
}: VideoPlayerProps) {
  return (
    <div className={cn('my-6 acc-exclude-color', className)}>
      <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-[9/16] max-w-[320px] mx-auto">
        <video
          className="w-full h-full object-cover"
          controls
          poster={poster}
          preload="metadata"
        >
          <source src={src} type="video/mp4" />
          <TranslatedText>Tu navegador no soporta el elemento de video.</TranslatedText>
        </video>

        {/* Top Title Overlay - White Box Style */}
        {title && (
          <div className="absolute top-8 left-0 right-0 px-4">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-sm shadow-sm border border-white/20">
              <h3 className="text-[#333333] text-lg md:text-xl font-bold text-center leading-tight">
                <TranslatedText>{title}</TranslatedText>
              </h3>
            </div>
          </div>
        )}

        {/* Floating Label (if provided) */}
        {label && (
          <div className="absolute bottom-20 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-[0.7rem] font-bold tracking-wider flex items-center gap-2 border border-white/10 pointer-events-none uppercase">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <TranslatedText>{label}</TranslatedText>
          </div>
        )}
      </div>
    </div>
  )
}
