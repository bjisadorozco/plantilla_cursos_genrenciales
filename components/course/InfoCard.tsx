import { cn } from '@/lib/utils'
import { Lightbulb, CornerRightDown, CornerRightUp, ArrowLeft, ArrowRight, Quote } from 'lucide-react'
import { ReactNode } from 'react'
import { TranslatedText } from '@/contexts/TranslationContext'

interface InfoCardProps {
  children: ReactNode
  icon?: ReactNode
  variant?: 'default' | 'tip' | 'warning'
  className?: string
}

export function InfoCard({
  children,
  icon,
  variant = 'default',
  className,
}: InfoCardProps) {
  const variants = {
    default: 'bg-muted border-gray-lighter',
    tip: 'bg-primary/5 border-primary/20',
    warning: 'bg-warning-light border-warning/20',
  }

  return (
    <div className={cn(
      'rounded-2xl border p-5 flex gap-4',
      variants[variant],
      className
    )}>
      {icon && (
        <div className="flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1 text-base text-gray-dark leading-relaxed">
        {children}
      </div>
    </div>
  )
}

interface TipCardProps {
  children: ReactNode
  className?: string
}

export function TipCard({ children, className }: TipCardProps) {
  return (
    <InfoCard
      variant="tip"
      icon={<Lightbulb className="w-6 h-6 text-primary" />}
      className={className}
    >
      {children}
    </InfoCard>
  )
}

interface QuoteCardProps {
  children: ReactNode
  className?: string
}

export function QuoteCard({ children, className }: QuoteCardProps) {
  return (
    <div className={cn(
      'bg-primary/5 border border-primary/10 rounded-[2rem] p-8 flex items-start gap-6 shadow-sm my-6 acc-exclude-color',
      className
    )}>
      <Quote className="w-10 h-10 text-primary/40 shrink-0 mt-1 fill-primary/10" />
      <div className="flex-1">
        <p className="text-primary italic text-lg leading-relaxed text-left font-medium">
          <TranslatedText>{children as string}</TranslatedText>
        </p>
      </div>
    </div>
  )
}


interface HighlightBoxProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
}

export function HighlightBox({ children, direction = 'down', className }: HighlightBoxProps) {
  const getIcon = () => {
    const iconProps = { className: "w-4 h-4 flex-shrink-0", strokeWidth: 3 }
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
    <div className={cn(
      'bg-[#71828C] rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-sm acc-exclude-color',
      direction === 'left' && 'flex-row-reverse',
      className
    )}>
      <p className="text-white text-base leading-relaxed italic flex items-center gap-2">
        {children}
        {getIcon()}
      </p>
    </div>
  )
}
