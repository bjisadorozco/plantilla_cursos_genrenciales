'use client'

import { X, Home, FileText, BookOpen, GraduationCap, Play, LogOut } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { TranslatedText } from '@/contexts/TranslationContext'
import useTrackingStore from '@/store/useTrackingStore'
import { useEffect, useState } from 'react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface MenuItem {
  href: string
  icon: React.ReactNode
  label: string
  isHighlighted?: boolean
}

const menuItems: MenuItem[] = [
  {
    href: '/ruta',
    icon: <Home className="w-5 h-5" />,
    label: 'Inicio',
    isHighlighted: true,
  },
  {
    href: '/guia',
    icon: <FileText className="w-5 h-5" />,
    label: 'Guía de portada',
  },
  {
    href: '/leccion/1',
    icon: <BookOpen className="w-5 h-5" />,
    label: 'Lección 1',
  },
  {
    href: '/leccion/2',
    icon: <BookOpen className="w-5 h-5" />,
    label: 'Lección 2',
  },
  {
    href: '/leccion/3',
    icon: <BookOpen className="w-5 h-5" />,
    label: 'Lección 3',
  },
  {
    href: '/evaluacion',
    icon: <GraduationCap className="w-5 h-5" />,
    label: 'Evaluación',
  },
  {
    href: '/mis-cursos',
    icon: <Play className="w-5 h-5" />,
    label: 'Mis cursos',
  },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [mounted, setMounted] = useState(false)
  const currentProgress = useTrackingStore((state) => state.currentProgress)
  const userName = useTrackingStore((state) => state.userName)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Para evitar errores de hidratación, usamos valores estáticos que coincidan 
  // con el servidor hasta que el componente se monte en el cliente.
  const displayUserName = mounted ? userName : 'Bienvenido'
  const displayProgress = mounted ? currentProgress : 0
  
  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 right-0 z-[70] h-full w-[85%] max-w-[320px] bg-background shadow-xl transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-primary via-primary to-secondary p-6 pb-8 text-primary-foreground rounded-b-[2rem] acc-exclude-color">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="mt-2 flex flex-col gap-0.5">
            <span className="text-lg opacity-90 font-medium">
              <TranslatedText>Bienvenido</TranslatedText>
            </span>
            <h2 className="text-2xl font-bold leading-tight">
              {displayUserName}
            </h2>
            <p className="text-base opacity-80 mt-1.5 font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(var(--secondary),0.8)]" />
              <TranslatedText>Ruta de Aprendizaje</TranslatedText>
            </p>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between text-base mb-2">
              <span><TranslatedText>Tu Progreso</TranslatedText></span>
              <span>{displayProgress}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-secondary rounded-full transition-all duration-500"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 acc-exclude-color">
          <ul className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                    item.isHighlighted
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-dark hover:bg-muted'
                  )}
                >
                  {item.icon}
                  <span className="font-medium text-base">
                    <TranslatedText>{item.label}</TranslatedText>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {/* Logout */}
          <div className="mt-6 pt-4 border-t border-border">
            <button
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-dark hover:bg-muted transition-colors w-full"
              onClick={() => {
                // Handle logout
                onClose()
              }}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-base">
                <TranslatedText>Cerrar sesión</TranslatedText>
              </span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  )
}
