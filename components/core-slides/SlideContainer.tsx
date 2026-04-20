'use client'

import { useState, useCallback, ReactNode, Children, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { TranslatedText } from '@/contexts/TranslationContext'
import { AudioPlayer } from '@/components/course/AudioPlayer'
import { useAudio } from '@/contexts/AudioContext'

interface SlideContainerProps {
  children: ReactNode
  lessonTitle?: string
  audioSrc?: string
  onComplete?: () => void
  onSlideChange?: (index: number) => void
  className?: string
}

export function SlideContainer({
  children,
  lessonTitle,
  audioSrc,
  onComplete,
  onSlideChange,
  className,
}: SlideContainerProps) {
  const { stopAll } = useAudio()
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const slides = Children.toArray(children)
  const totalSlides = slides.length
  const currentSlide = slides[currentSlideIndex]

  // Stop all audios when changing slides
  useEffect(() => {
    stopAll()
    onSlideChange?.(currentSlideIndex)
  }, [currentSlideIndex, stopAll, onSlideChange])

  const goToNextSlide = useCallback(() => {
    if (currentSlideIndex < totalSlides - 1) {
      const nextIndex = currentSlideIndex + 1
      setCurrentSlideIndex(nextIndex)
      onSlideChange?.(nextIndex)
    } else {
      onComplete?.()
    }
  }, [currentSlideIndex, totalSlides, onComplete, onSlideChange])

  const goToPrevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      const prevIndex = currentSlideIndex - 1
      setCurrentSlideIndex(prevIndex)
      onSlideChange?.(prevIndex)
    }
  }, [currentSlideIndex, onSlideChange])

  return (
    <div className={cn('relative pb-24', className)}>
      {/* Global Audio and Progress Section */}
      <div className="max-w-[800px] mx-auto bg-background">
        <AudioPlayer 
          src={audioSrc} 
          variant="default" 
          className="mb-0" 
          currentSlideIndex={currentSlideIndex}
        />
        
        {/* Segmented Progress Bar */}
        <div className="flex gap-1.5 py-4 px-6">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div 
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-300",
                i <= currentSlideIndex ? "bg-primary" : "bg-gray-lighter"
              )}
            />
          ))}
        </div>
      </div>

      {/* Slide Content */}
      <div id="active-slide-content" className="max-w-[800px] mx-auto px-4">
        {currentSlide}
      </div>

      {/* Sticky Navigation Buttons with Blur Background */}
      <div id="slide-navigation-container" className="fixed bottom-0 left-0 right-0 z-40 acc-exclude-color">
        <div className="max-w-[800px] mx-auto">
          <div className="py-4 flex justify-center gap-4 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-sm px-4">
            {currentSlideIndex > 0 && (
              <button
                onClick={goToPrevSlide}
                className="bg-white border-2 border-primary text-primary hover:bg-primary/5 font-semibold py-3.5 px-5 min-w-[160px] rounded-full flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>
                  <TranslatedText>Anterior</TranslatedText>
                </span>
              </button>
            )}
            
            <button
              onClick={goToNextSlide}
              className="bg-gradient-to-r from-[#6a11cb] via-[#91208a] to-[#d52b5e] hover:opacity-90 text-white font-semibold py-3.5 px-5 min-w-[160px] rounded-full flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/30"
            >
              <span>
                {currentSlideIndex === totalSlides - 1 ? (
                  <TranslatedText>Continuar</TranslatedText>
                ) : (
                  <TranslatedText>Siguiente</TranslatedText>
                )}
              </span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
