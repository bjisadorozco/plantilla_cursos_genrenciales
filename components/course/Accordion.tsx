'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Plus, Minus } from 'lucide-react'
import { TranslatedText } from '@/contexts/TranslationContext'

interface AccordionItem {
  title: string
  content: React.ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  className?: string
}

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className={cn('flex flex-col gap-3 my-6', className)}>
      {items.map((item, index) => (
        <div 
          key={index} 
          className={cn(
            'rounded-2xl border transition-all duration-300 overflow-hidden',
            openIndex === index 
              ? 'border-primary shadow-md' 
              : 'border-gray-lighter shadow-sm'
          )}
        >
          {/* Header */}
          <button
            onClick={() => toggleItem(index)}
            className={cn(
              'w-full flex items-center justify-between p-4 text-left transition-colors',
              openIndex === index 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-dark hover:bg-gray-50'
            )}
          >
            <span className="font-bold text-lg">
              <TranslatedText>{item.title}</TranslatedText>
            </span>
            {openIndex === index ? (
              <Minus className="w-5 h-5 flex-shrink-0" />
            ) : (
              <Plus className="w-5 h-5 flex-shrink-0 text-primary" />
            )}
          </button>

          {/* Content */}
          <div 
            className={cn(
              'transition-all duration-300 ease-in-out',
              openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="p-5 bg-white text-gray-dark text-base leading-relaxed">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
