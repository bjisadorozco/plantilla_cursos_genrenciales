'use client'

import { useState } from 'react'
import { TopNavbar } from './TopNavbar'
import { BottomNavbar } from './BottomNavbar'
import { Sidebar } from './Sidebar'
import { AccessibilityWidget } from './AccessibilityWidget'
import { useAccessibility } from '@/contexts/AccessibilityContext'

interface MainLayoutProps {
  children: React.ReactNode
  showBottomNav?: boolean
  showTopNav?: boolean
  slideIndicator?: string
  topNavProps?: {
    showBack?: boolean
    showHome?: boolean
    showAccessibility?: boolean
    showMenu?: boolean
  }
}

export function MainLayout({
  children,
  showBottomNav = true,
  showTopNav = true,
  slideIndicator,
  topNavProps = {},
}: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { isOpen: isAccessibilityOpen, setIsOpen: setIsAccessibilityOpen } = useAccessibility()

  return (
    <div className="min-h-screen bg-background">
      {showTopNav && (
        <TopNavbar
          {...topNavProps}
          slideIndicator={slideIndicator}
          onMenuClick={() => setIsSidebarOpen(true)}
          onAccessibilityClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
        />
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <AccessibilityWidget />

      <main
        className={`
          max-w-[800px] mx-auto
          ${showTopNav ? 'pt-14' : ''}
          ${showBottomNav ? 'pb-20' : ''}
        `}
      >
        {children}
      </main>

      {showBottomNav && <BottomNavbar />}
    </div>
  )
}
