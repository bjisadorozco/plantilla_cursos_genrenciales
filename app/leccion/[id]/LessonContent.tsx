'use client'

import { SlideContainer } from '@/components/core-slides'
import { MainLayout } from '@/components/layout'
import { LanguageToggle } from '@/components/layout/TopNavbar'
import { useRouter } from 'next/navigation'
import { useCallback, useState, use, useEffect } from 'react'
import { getLessonSlides, getGlobalSlideIndex } from '@/components/lessons'
import { useTracking } from '@/hooks/useTracking'

interface LessonContentProps {
  lessonId: number;
}

export default function LessonContent({ lessonId }: LessonContentProps) {
  const router = useRouter()
  const slides = getLessonSlides(lessonId)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const { updateProgress, initTracking } = useTracking()

  useEffect(() => {
    initTracking()
  }, [initTracking])

  if (!slides) {
    return (
      <MainLayout showBottomNav={false}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <h1 className="text-2xl font-bold">Lección no encontrada</h1>
          <button 
            onClick={() => router.push('/ruta')}
            className="text-primary font-semibold hover:underline"
          >
            Volver a la ruta
          </button>
        </div>
      </MainLayout>
    )
  }

  const slideIndicator = `Slide ${currentSlideIndex + 1} de ${slides.length}`

  const handleComplete = useCallback(() => {
    router.push('/ruta')
  }, [router])

  const handleSlideChange = useCallback((index: number) => {
    setCurrentSlideIndex(index)
    const globalIndex = getGlobalSlideIndex(lessonId, index)
    updateProgress(globalIndex)
  }, [lessonId, updateProgress])

  return (
    <MainLayout
      showBottomNav={false}
      showTopNav={true}
      slideIndicator={slideIndicator}
      topNavProps={{
        showBack: true,
        showHome: true,
        showAccessibility: true,
        showMenu: true
      }}
    >
      <SlideContainer
        onComplete={handleComplete}
        onSlideChange={handleSlideChange}
        className=""
      >
        {slides}
      </SlideContainer>
    </MainLayout>
  )
}
