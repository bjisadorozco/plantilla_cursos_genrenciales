'use client'

import { MainLayout } from '@/components/layout'
import { Title, SmallText } from '@/components/ui/typography'
import { CourseProgress, InfoCard, LessonCard } from '@/components/course'
import { courseData } from '@/data/courseContent'
import { Lightbulb } from 'lucide-react'
import { TranslatedText } from '@/contexts/TranslationContext'
import useTrackingStore from '@/store/useTrackingStore'

export default function RutaPage() {
  const currentProgress = useTrackingStore((state) => state.currentProgress)
  
  // Calculate completed lessons based on total lessons and percentage
  // This is an approximation for UI consistency
  const totalLessons = courseData.totalLessons
  const completedLessons = Math.round((currentProgress / 100) * totalLessons)

  return (
    <MainLayout>
      <div className="py-6 px-4 flex flex-col gap-6">
        {/* Header */}
        <div>
          <Title><TranslatedText>Ruta de Aprendizaje</TranslatedText></Title>
          <SmallText className="mt-1"><TranslatedText>Tu progreso paso a paso</TranslatedText></SmallText>
        </div>

        {/* Progress Bar */}
        <CourseProgress
          completedLessons={completedLessons}
          totalLessons={totalLessons}
        />

        {/* Info Card */}
        <InfoCard
          icon={<Lightbulb className="w-6 h-6 text-primary" />}
          variant="default"
        >
          <TranslatedText>Este curso está estructurado en tres microlecciones. Haz clic en cada lección para avanzar en tu aprendizaje.</TranslatedText>
        </InfoCard>

        {/* Lessons Timeline */}
        <div className="flex flex-col gap-6">
          {courseData.lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lessonNumber={lesson.id}
              title={lesson.title}
              duration={lesson.duration}
              status={lesson.status}
              href={`/leccion/${lesson.id}`}
            />
          ))}

          {/* Evaluacion Final */}
          <LessonCard
            lessonNumber={4}
            title="Evaluación Final"
            duration="20 min"
            status="locked"
            href="/evaluacion"
            isEvaluation
          />
        </div>
      </div>
    </MainLayout>
  )
}
