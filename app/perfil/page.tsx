'use client'

import { MainLayout } from '@/components/layout'
import { Title, SmallText } from '@/components/ui/typography'
import { courseData } from '@/data/courseContent'
import { User, BookOpen, Clock, Award, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TranslatedText } from '@/contexts/TranslationContext'

interface StatCardProps {
  icon: React.ReactNode
  value: string | number
  label: string
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="bg-card rounded-2xl p-4 border border-border shadow-sm text-center">
      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
        {icon}
      </div>
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-gray-medium">
        <TranslatedText>{label}</TranslatedText>
      </p>
    </div>
  )
}

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  danger?: boolean
}

function MenuItem({ icon, label, onClick, danger }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
        danger 
          ? 'text-destructive hover:bg-destructive/10' 
          : 'text-gray-dark hover:bg-muted'
      )}
    >
      {icon}
      <span className="font-medium text-base">
        <TranslatedText>{label}</TranslatedText>
      </span>
    </button>
  )
}

export default function PerfilPage() {
  const completedPercentage = Math.round(
    (courseData.completedLessons / courseData.totalLessons) * 100
  )

  return (
    <MainLayout>
      <div className="py-6 px-4 flex flex-col gap-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <Title className="text-xl">
              <TranslatedText>Usuario</TranslatedText>
            </Title>
            <SmallText>usuario@email.com</SmallText>
          </div>
        </div>

        {/* Course Progress */}
        <div className="bg-gradient-to-br from-primary via-primary to-primary-light rounded-2xl p-5 text-white">
          <h3 className="font-semibold mb-3">
            <TranslatedText>Gestión gerencial del riesgo con DS44</TranslatedText>
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-base">
              <span><TranslatedText>Tu progreso</TranslatedText></span>
              <span>{completedPercentage}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full"
                style={{ width: `${completedPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<BookOpen className="w-5 h-5 text-primary" />}
            value={courseData.completedLessons}
            label="Lecciones completadas"
          />
          <StatCard
            icon={<Clock className="w-5 h-5 text-primary" />}
            value={4}
            label="horas"
          />
          <StatCard
            icon={<Award className="w-5 h-5 text-primary" />}
            value={1}
            label="Logros"
          />
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-2">
          <MenuItem
            icon={<User className="w-5 h-5" />}
            label="Información Personal"
          />
          <MenuItem
            icon={<Settings className="w-5 h-5" />}
            label="Editar Perfil"
          />
          <MenuItem
            icon={<LogOut className="w-5 h-5" />}
            label="Cerrar sesión"
            danger
          />
        </div>
      </div>
    </MainLayout>
  )
}
