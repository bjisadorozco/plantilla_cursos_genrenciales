import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface TypographyProps {
  children: ReactNode
  className?: string
}

export function Title({ children, className }: TypographyProps) {
  return (
    <h1 className={cn(
      'text-2xl font-bold text-foreground leading-tight text-balance',
      className
    )}>
      {children}
    </h1>
  )
}

export function Subtitle({ children, className }: TypographyProps) {
  return (
    <h2 className={cn(
      'text-xl font-semibold text-foreground leading-snug text-balance',
      className
    )}>
      {children}
    </h2>
  )
}

export function SectionTitle({ children, className }: TypographyProps) {
  return (
    <h3 className={cn(
      'text-lg font-semibold text-foreground leading-snug text-balance',
      className
    )}>
      {children}
    </h3>
  )
}

export function Paragraph({ children, className }: TypographyProps) {
  return (
    <p className={cn(
      'text-base text-gray-dark leading-relaxed',
      className
    )}>
      {children}
    </p>
  )
}

export function SmallText({ children, className }: TypographyProps) {
  return (
    <p className={cn(
      'text-base text-gray-medium leading-relaxed',
      className
    )}>
      {children}
    </p>
  )
}

export function Instructions({ children, className }: TypographyProps) {
  return (
    <p className={cn(
      'text-base font-medium text-primary leading-relaxed italic',
      className
    )}>
      {children}
    </p>
  )
}

export function LessonLabel({ children, className }: TypographyProps) {
  return (
    <span className={cn(
      'text-xs font-semibold uppercase tracking-wider text-primary',
      className
    )}>
      {children}
    </span>
  )
}

export function HighlightText({ children, className }: TypographyProps) {
  return (
    <span className={cn(
      'text-primary font-semibold',
      className
    )}>
      {children}
    </span>
  )
}
