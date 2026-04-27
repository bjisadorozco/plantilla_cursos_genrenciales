'use client'

import { ReactNode } from 'react'
import { TranslatedText } from '@/contexts/TranslationContext'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { AudioPlayer } from '@/components/course/AudioPlayer'
import { VideoPlayer } from '@/components/course/VideoPlayer'
import { Accordion, CourseSwiper, type SwiperItem } from '@/components/course'
import { DecisionActivity, type DecisionOption } from '@/components/activities'
import { HighlightBox as BaseHighlightBox, QuoteCard } from '@/components/course/InfoCard'

export function SlideTitle({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <h1 className={cn("text-2xl md:text-3xl font-bold text-primary text-balance", className)}>
      <TranslatedText>{children}</TranslatedText>
    </h1>
  )
}

export function SlideSubtitle({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <h2 className={cn("text-xl md:text-2xl font-bold text-primary/80 text-balance", className)}>
      <TranslatedText>{children}</TranslatedText>
    </h2>
  )
}

export function SlideParagraph({ 
  children, 
  className, 
  align = 'left' 
}: { 
  children: ReactNode, 
  className?: string,
  align?: 'left' | 'center' | 'right' | 'justify'
}) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  }

  const parseContent = (text: ReactNode) => {
    if (typeof text !== 'string') return text
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold">
            <TranslatedText>{part.slice(2, -2)}</TranslatedText>
          </strong>
        )
      }
      return <TranslatedText key={index}>{part}</TranslatedText>
    })
  }

  return (
    <div className={cn(
      "text-gray-dark leading-relaxed text-base md:text-lg readable", 
      alignmentClasses[align],
      className
    )}>
      {parseContent(children)}
    </div>
  )
}

export function SlideImage({ src, alt = "Slide illustration", className }: { src: string, alt?: string, className?: string }) {
  return (
    <div className={cn("flex justify-center pt-8", className)}>
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  )
}

export function SlideHighlight({ children, direction = 'down', className }: { children: ReactNode, direction?: 'up' | 'down' | 'left' | 'right', className?: string }) {
  return (
    <BaseHighlightBox direction={direction} className={cn("readable", className)}>
      <TranslatedText>{children}</TranslatedText>
    </BaseHighlightBox>
  )
}

export function SlideAudio({ src, title, subtitle }: { src?: string, title?: string, subtitle?: string }) {
  return <AudioPlayer variant="default" src={src} title={title} subtitle={subtitle} />
}

export function SlideVideo({ src, poster, title, label }: { src: string, poster?: string, title?: string, label?: string }) {
  return <VideoPlayer src={src} poster={poster} title={title} label={label} />
}

export function SlideAccordion({ items }: { items: { title: string, content: React.ReactNode }[] }) {
  return <Accordion items={items} />
}

export function SlideSwiper({ items }: { items: SwiperItem[] }) {
  return <CourseSwiper items={items} />
}

export function SlideDecisionActivity({ title, options }: { title: string, options: DecisionOption[] }) {
  return <DecisionActivity title={title} options={options} />
}

export function SlidePodcast({ src, title, subtitle }: { src?: string, title?: string, subtitle?: string }) {
  return <AudioPlayer variant="podcast" src={src} title={title} subtitle={subtitle} />
}

export function SlideQuote({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <QuoteCard className={cn("readable", className)}>
      <TranslatedText>{children}</TranslatedText>
    </QuoteCard>
  )
}

export function Slide({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {children}
    </div>
  )
}
