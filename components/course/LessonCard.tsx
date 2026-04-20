'use client'

import { cn } from '@/lib/utils'
import { Check, Play, FileText, Lock, Clock, Award } from 'lucide-react'
import Link from 'next/link'
import { TranslatedText } from '@/contexts/TranslationContext'

export type LessonStatus = 'completed' | 'in-progress' | 'locked'

interface LessonCardProps {
  lessonNumber: number
  title: string
  duration: string
  status: LessonStatus
  href: string
  className?: string
  isEvaluation?: boolean
}

const statusConfig = {
  completed: {
    icon: Check,
    iconBg: 'bg-background border-2 border-primary',
    iconColor: 'text-primary',
    cardBorder: 'border-l-4 border-l-primary',
    badge: 'Completado',
    badgeClass: 'text-success font-medium',
  },
  'in-progress': {
    icon: Play,
    iconBg: 'bg-background border-2 border-primary',
    iconColor: 'text-primary',
    cardBorder: 'border-l-4 border-l-primary',
    badge: 'EN CURSO',
    badgeClass: 'bg-success text-white px-2.5 py-1 rounded-full text-xs font-semibold',
  },
  locked: {
    icon: Lock,
    iconBg: 'bg-gray-lighter',
    iconColor: 'text-gray-light',
    cardBorder: '',
    badge: 'No disponible',
    badgeClass: 'text-gray-light',
  },
}

export function LessonCard({
  lessonNumber,
  title,
  duration,
  status,
  href,
  className,
  isEvaluation = false,
}: LessonCardProps) {
  const config = statusConfig[status]
  const Icon = isEvaluation ? Award : config.icon
  const isLocked = status === 'locked'

  const CardContent = (
    <div className="flex items-start gap-4">
      {/* Timeline Icon */}
      <div className="relative flex flex-col items-center">
        <div className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
          isEvaluation && status === 'locked' ? 'bg-gray-lighter' : config.iconBg
        )}>
          <Icon className={cn('w-5 h-5', config.iconColor)} />
        </div>
        {/* Vertical Line - connects to next card */}
        <div className="w-0.5 flex-1 bg-gray-lighter mt-3 min-h-[24px]" />
      </div>

      {/* Card Content */}
      <div className={cn(
        'flex-1 bg-card rounded-2xl p-5 shadow-sm border border-border',
        config.cardBorder,
        isLocked && 'opacity-60',
        className
      )}>
        <span className={cn(
          'text-xs font-semibold uppercase tracking-wider',
          isLocked ? 'text-gray-light' : 'text-primary'
        )}>
          {isEvaluation ? (
            <TranslatedText>EVALUACIÓN</TranslatedText>
          ) : (
            <><TranslatedText>LECCIÓN</TranslatedText> {lessonNumber}</>
          )}
        </span>
        
        <h3 className={cn(
          'text-lg font-semibold mt-2 leading-snug text-balance',
          isLocked ? 'text-gray-light' : 'text-foreground'
        )}>
          <TranslatedText>{title}</TranslatedText>
        </h3>
        
        <div className="flex items-center gap-3 mt-4">
          <div className={cn(
            'flex items-center gap-1.5 text-base',
            isLocked ? 'text-gray-light' : 'text-gray-medium'
          )}>
            <Clock className="w-4 h-4" />
            <span><TranslatedText>{duration}</TranslatedText></span>
          </div>
          
          <span className={config.badgeClass}>
            <TranslatedText>{config.badge}</TranslatedText>
          </span>
        </div>
      </div>
    </div>
  )

  if (isLocked) {
    return <div className="cursor-not-allowed">{CardContent}</div>
  }

  return (
    <Link href={href} className="block hover:opacity-90 transition-opacity">
      {CardContent}
    </Link>
  )
}
