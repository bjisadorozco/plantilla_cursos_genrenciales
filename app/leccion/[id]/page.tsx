'use client'

import { SlideContainer } from '@/components/core-slides'
import { MainLayout } from '@/components/layout'
import { useRouter } from 'next/navigation'
import { useCallback, useState, use, useEffect } from 'react'
import { getLessonSlides, getGlobalSlideIndex } from '@/components/lessons'
import { useTracking } from '@/hooks/useTracking'

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const lessonId = parseInt(resolvedParams.id)
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
      slideIndicator={slideIndicator}
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
