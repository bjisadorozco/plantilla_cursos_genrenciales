'use client'

import { cn } from '@/lib/utils'
import { TranslatedText } from '@/contexts/TranslationContext'
import useTrackingStore from '@/store/useTrackingStore'
import { useEffect, useState } from 'react'

interface ProgressBarProps {
  progress?: number
  total?: number
  showLabel?: boolean
  variant?: 'default' | 'small'
  className?: string
}

export function ProgressBar({
  progress: propsProgress,
  total: propsTotal,
  showLabel = true,
  variant = 'default',
  className,
}: ProgressBarProps) {
  const [mounted, setMounted] = useState(false)
  const storeProgress = useTrackingStore((state) => state.currentProgress)
  const storeTotal = useTrackingStore((state) => state.totalSlides)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const progress = propsProgress ?? (mounted ? storeProgress : 0)
  const total = propsTotal ?? (propsProgress !== undefined ? 100 : (mounted ? storeTotal : 100))
  
  const percentage = total > 0 ? Math.min(Math.round((progress / total) * 100), 100) : 0

  return (
    <div className={cn('w-full', className)}>
      {showLabel && variant === 'default' && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-base font-semibold text-foreground">
            {percentage}% <TranslatedText>Completado</TranslatedText>
          </span>
          <span className="text-base font-medium text-primary uppercase">
            {progress} <TranslatedText>de</TranslatedText> {total} <TranslatedText>LECCIONES</TranslatedText>
          </span>
        </div>
      )}
      
      <div className={cn(
        'w-full bg-gray-lighter rounded-full overflow-hidden',
        variant === 'default' ? 'h-2' : 'h-1.5'
      )}>
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 animate-progress"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

interface CourseProgressProps {
  completedLessons: number
  totalLessons: number
  className?: string
}

export function CourseProgress({
  completedLessons,
  totalLessons,
  className,
}: CourseProgressProps) {
  const percentage = Math.round((completedLessons / totalLessons) * 100)

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between text-base">
        <span className="font-semibold text-foreground">
          {percentage}% <TranslatedText>Completado</TranslatedText>
        </span>
        <span className="font-medium text-primary uppercase">
          {completedLessons} <TranslatedText>de</TranslatedText> {totalLessons} <TranslatedText>LECCIONES</TranslatedText>
        </span>
      </div>
      <div className="h-2 bg-gray-lighter rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
