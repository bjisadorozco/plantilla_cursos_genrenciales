'use client'

import { MainLayout } from '@/components/layout'
import { Title, SmallText } from '@/components/ui/typography'
import { Trophy, Star, Award, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TranslatedText } from '@/contexts/TranslationContext'

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  progress?: number
}

const achievements: Achievement[] = [
  {
    id: 'first-lesson',
    title: 'Primer Paso',
    description: 'Completaste tu primera lección',
    icon: <Star className="w-6 h-6" />,
    unlocked: true,
  },
  {
    id: 'quick-learner',
    title: 'Aprendiz Veloz',
    description: 'Completa 3 lecciones en un día',
    icon: <Trophy className="w-6 h-6" />,
    unlocked: false,
    progress: 33,
  },
  {
    id: 'perfect-quiz',
    title: 'Quiz Perfecto',
    description: 'Responde correctamente todas las preguntas',
    icon: <Award className="w-6 h-6" />,
    unlocked: false,
  },
  {
    id: 'course-complete',
    title: 'Curso Completado',
    description: 'Finaliza todas las lecciones del curso',
    icon: <Target className="w-6 h-6" />,
    unlocked: false,
    progress: 25,
  },
]

export default function LogrosPage() {
  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <MainLayout>
      <div className="py-6 flex flex-col gap-6">
        {/* Header */}
        <div>
          <Title>
            <TranslatedText>Tus Logros</TranslatedText>
          </Title>
          <SmallText className="mt-1">
            {unlockedCount} <TranslatedText>de</TranslatedText> {achievements.length} <TranslatedText>desbloqueados</TranslatedText>
          </SmallText>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-primary via-primary to-secondary rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <p className="text-3xl font-bold">{unlockedCount}</p>
              <p className="text-base opacity-90">
                <TranslatedText>Logros desbloqueados</TranslatedText>
              </p>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="flex flex-col gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={cn(
                'bg-card rounded-2xl p-5 border border-border shadow-sm flex items-start gap-4',
                !achievement.unlocked && 'opacity-60'
              )}
            >
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
                achievement.unlocked 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-lighter text-gray-light'
              )}>
                {achievement.icon}
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-foreground">
                  <TranslatedText>{achievement.title}</TranslatedText>
                </h3>
                <p className="text-sm text-gray-medium mt-1">
                  <TranslatedText>{achievement.description}</TranslatedText>
                </p>
                
                {achievement.progress !== undefined && !achievement.unlocked && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm text-gray-medium mb-1">
                      <span><TranslatedText>Progreso</TranslatedText></span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-lighter rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {achievement.unlocked && (
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
