'use client'

import { Home, LayoutGrid, Trophy, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { TranslatedText } from '@/contexts/TranslationContext'

interface NavItem {
  href: string
  icon: React.ReactNode
  label: string
}

const navItems: NavItem[] = [
  {
    href: '/ruta',
    icon: <Home className="w-5 h-5" />,
    label: 'Inicio',
  },
  {
    href: '/modulos',
    icon: <LayoutGrid className="w-5 h-5" />,
    label: 'Modulos',
  },
  {
    href: '/logros',
    icon: <Trophy className="w-5 h-5" />,
    label: 'Logros',
  },
  {
    href: '/perfil',
    icon: <User className="w-5 h-5" />,
    label: 'Perfil',
  },
]

export function BottomNavbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border acc-exclude-color">
      <div className="max-w-[800px] mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-lg transition-colors',
                  isActive 
                    ? 'text-[#6e3cd2]' 
                    : 'text-gray-medium hover:text-[#6e3cd2]'
                )}
              >
                <div className={cn(
                  'transition-colors',
                  isActive && 'text-[#6e3cd2]'
                )}>
                  {item.icon}
                </div>
                <span className={cn(
                  'text-xs font-medium',
                  isActive ? 'text-[#6e3cd2]' : 'text-gray-medium'
                )}>
                  <TranslatedText>{item.label}</TranslatedText>
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
