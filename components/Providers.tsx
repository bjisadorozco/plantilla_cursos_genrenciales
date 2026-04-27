'use client'

import { TranslationProvider } from '@/contexts/TranslationContext'
import { AccessibilityProvider } from '@/contexts/AccessibilityContext'
import { AudioProvider } from '@/contexts/AudioContext'
import { type ReactNode, useEffect } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Mark as hydrated once React is active
    document.body.setAttribute('data-hydrated', 'true');
    console.log('Providers: React Hydration Initialized Successfully');
  }, []);

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
