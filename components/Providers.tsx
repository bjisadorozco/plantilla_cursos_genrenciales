'use client'

import { TranslationProvider } from '@/contexts/TranslationContext'
import { AccessibilityProvider } from '@/contexts/AccessibilityContext'
import { AudioProvider } from '@/contexts/AudioContext'
import { type ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TranslationProvider>
      <AccessibilityProvider>
        <AudioProvider>
          {children}
        </AudioProvider>
      </AccessibilityProvider>
    </TranslationProvider>
  )
}
