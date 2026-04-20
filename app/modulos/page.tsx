'use client'

import { MainLayout } from '@/components/layout'
import { Title, SmallText } from '@/components/ui/typography'
import { LessonCard } from '@/components/course'
import { courseData } from '@/data/courseContent'
import { TranslatedText } from '@/contexts/TranslationContext'

export default function ModulosPage() {
  return (
    <MainLayout>
      <div className="py-6 px-4 flex flex-col gap-6">
        {/* Header */}
        <div>
          <Title>
            <TranslatedText>Módulos del Curso</TranslatedText>
          </Title>
          <SmallText className="mt-1">
            <TranslatedText>Explora todos los contenidos disponibles</TranslatedText>
          </SmallText>
        </div>

        {/* Course Title Card */}
        <div className="bg-gradient-to-br from-primary via-primary to-primary-light rounded-2xl p-6 text-white">
          <h2 className="text-lg font-bold">
            <TranslatedText>Gestión gerencial del riesgo con DS44</TranslatedText>
          </h2>
          <p className="text-base opacity-90 mt-1">
            {courseData.totalLessons} <TranslatedText>lecciones disponibles</TranslatedText>
          </p>
        </div>

        {/* Lessons List */}
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
