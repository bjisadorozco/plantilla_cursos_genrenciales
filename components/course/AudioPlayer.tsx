'use client'

import { Play, Pause, Volume2, CornerRightDown, CornerRightUp, ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useRef, useEffect, useCallback } from 'react'
import { TranslatedText } from '@/contexts/TranslationContext'
import { useAccessibility } from '@/contexts/AccessibilityContext'
import { useAudio } from '@/contexts/AudioContext'
import { AudioReader } from '@/components/layout/AudioReader'

interface AudioPlayerProps {
  src?: string
  title?: string
  subtitle?: string
  variant?: 'default' | 'podcast'
  className?: string
  currentSlideIndex?: number
}

export function AudioPlayer({
  src,
  title,
  subtitle,
  variant = 'default',
  className,
  currentSlideIndex = 0,
}: AudioPlayerProps) {
  const { soundsStopped } = useAccessibility()
  const { registerPlaying, activeAudio } = useAudio()
  const displayTitle = title || 'PODCAST'
  const displaySubtitle = subtitle || 'Momento de escuchar'
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = useCallback(() => {
    if (audioRef.current && !soundsStopped) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
        registerPlaying(null)
      } else {
        registerPlaying(audioRef.current)
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }, [isPlaying, soundsStopped, registerPlaying])

  // Sync internal state with global active audio
  useEffect(() => {
    if (activeAudio !== audioRef.current && isPlaying) {
      setIsPlaying(false)
    }
  }, [activeAudio, isPlaying])

  useEffect(() => {
    if (soundsStopped && isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
      registerPlaying(null)
    }
  }, [soundsStopped, isPlaying, registerPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100)
    }

    const onLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const onEnded = () => {
      setIsPlaying(false)
      setProgress(0)
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setProgress((time / audioRef.current.duration) * 100)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (variant === 'podcast') {
    return (
      <div className={cn(
        'bg-gradient-to-br from-[#6236cc] via-[#5229b4] to-[#1a0b40] rounded-3xl p-8 shadow-2xl relative overflow-hidden acc-exclude-color',
        className
      )}>
        {src && <audio ref={audioRef} src={src} preload="metadata" />}
        
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-white text-2xl font-bold tracking-tight">
            <TranslatedText>{displayTitle}</TranslatedText>
          </h3>
          <p className="text-white/70 text-lg">
            <TranslatedText>{displaySubtitle}</TranslatedText>
          </p>
        </div>

        {/* Waveform Visualization Placeholder */}
        <div className="bg-white/10 rounded-2xl h-32 mb-6 flex items-end justify-between p-4 gap-1">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "w-full bg-white/30 rounded-full transition-all duration-500",
                isPlaying ? "animate-waveform" : "h-[20%]"
              )}
              style={{ 
                height: isPlaying ? `${Math.random() * 80 + 20}%` : '20%',
                animationDelay: `${i * 0.05}s` 
              }}
            />
          ))}
        </div>

        {/* Custom Progress Bar */}
        <div className="mb-6 relative group">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={audioRef.current?.currentTime || 0}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-1.5 opacity-0 cursor-pointer z-10"
          />
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              {/* Playhead dot */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-lg border-2 border-white" />
            </div>
          </div>
          <div className="flex justify-center mt-4 text-white font-medium text-lg">
            <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
            <span className="mx-1">/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Centered Play Button */}
        <div className="flex justify-center">
          <button 
            onClick={togglePlay}
            className="w-16 h-16 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all shadow-xl backdrop-blur-md group active:scale-95"
          >
            <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center text-[#5229b4] shadow-lg group-hover:scale-110 transition-transform">
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-1" />
              )}
            </div>
          </button>
        </div>
      </div>
    )
  }

  // Default variant - audio toggle header
  return (
    <div className={cn(
      'w-full bg-gradient-to-r from-[#6a11cb] via-[#91208a] to-[#d52b5e] rounded-b-[1.5rem] py-8 px-6 mb-6 shadow-lg',
      className
    )}>
      <AudioReader key={currentSlideIndex} />
    </div>
  )
}

interface AudioButtonProps {
  onClick?: () => void
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
}

export function AudioButton({ onClick, className, direction = 'down' }: AudioButtonProps) {
  const getIcon = () => {
    const iconProps = { className: "w-4 h-4", strokeWidth: 3 }
    switch (direction) {
      case 'up':
        return <CornerRightUp {...iconProps} />
      case 'down':
        return <CornerRightDown {...iconProps} />
      case 'left':
        return <ArrowLeft {...iconProps} />
      case 'right':
        return <ArrowRight {...iconProps} />
      default:
        return <CornerRightDown {...iconProps} />
    }
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-[#71828C]/90 text-white italic py-1.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-sm w-fit mx-auto shadow-sm hover:bg-[#71828C] transition-colors',
        direction === 'left' && 'flex-row-reverse',
        className
      )}
    >
      <TranslatedText>Haz clic para escuchar el audio</TranslatedText>
      {getIcon()}
    </div>
  )
}
