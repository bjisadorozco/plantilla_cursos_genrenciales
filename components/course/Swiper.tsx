'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TranslatedText } from '@/contexts/TranslationContext'
import Image from 'next/image'
import { AudioPlayer } from './AudioPlayer'
import { useAudio } from '@/contexts/AudioContext'

export interface SwiperItem {
  title?: string
  description?: string
  image?: string
  audio?: string
  content?: React.ReactNode
}

interface SwiperProps {
  items: SwiperItem[]
  className?: string
}

export function CourseSwiper({ items, className }: SwiperProps) {
  const { stopAll } = useAudio()
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'center' })
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    const newIndex = emblaApi.selectedScrollSnap()
    if (newIndex !== selectedIndex) {
      stopAll()
    }
    setSelectedIndex(newIndex)
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [emblaApi, selectedIndex, stopAll])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className={cn('relative w-full max-w-full mx-auto my-8', className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="relative flex-[0_0_100%] min-w-0 px-4"
              id={index === selectedIndex ? "active-slide-content" : undefined}
            >
              <div className="bg-white rounded-3xl border border-gray-lighter shadow-sm overflow-hidden h-full flex flex-col">
                {item.image && (
                  <div className="relative w-full h-48 md:h-64 bg-gray-50">
                    <Image
                      src={item.image}
                      alt={item.title || 'Slide image'}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                )}
                
                <div className="p-6 flex flex-col gap-3 flex-grow">
                  {item.title && (
                    <h3 className="text-xl font-bold text-primary">
                      <TranslatedText>{item.title}</TranslatedText>
                    </h3>
                  )}
                  
                  {item.description && (
                    <p className="text-gray-dark text-base leading-relaxed">
                      <TranslatedText>{item.description}</TranslatedText>
                    </p>
                  )}

                  {item.content && (
                    <div className="mt-2">
                      {item.content}
                    </div>
                  )}

                  {item.audio && (
                    <div className="mt-auto pt-4">
                      <AudioPlayer src={item.audio} variant="default" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6 px-4">
        <div className="flex gap-2">
          <button
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
              prevBtnEnabled 
                ? "border-primary text-primary hover:bg-primary hover:text-white cursor-pointer" 
                : "border-gray-lighter text-gray-lighter cursor-not-allowed"
            )}
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
              nextBtnEnabled 
                ? "border-primary text-primary hover:bg-primary hover:text-white cursor-pointer" 
                : "border-gray-lighter text-gray-lighter cursor-not-allowed"
            )}
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                index === selectedIndex ? "bg-primary w-6" : "bg-gray-lighter"
              )}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
