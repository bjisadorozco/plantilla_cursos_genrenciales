export interface Slide {
  id: string
  type: 'welcome' | 'info' | 'podcast' | 'quiz' | 'tip'
  title?: string
  subtitle?: string
  content?: string
  highlightText?: string
  image?: string
  audio?: string
  quote?: string
  tipContent?: string
}

export interface Lesson {
  id: number
  title: string
  subtitle?: string
  duration: string
  status: 'completed' | 'in-progress' | 'locked'
  slides: Slide[]
}

export interface Course {
  id: string
  title: string
  description: string
  totalLessons: number
  completedLessons: number
  lessons: Lesson[]
  introMessage: string
}

export const courseData: Course = {
  id: 'ds44-gestion-riesgo',
  title: 'Gestión gerencial del riesgo con DS44',
  description: 'Tu progreso paso a paso',
  totalLessons: 5,
  completedLessons: 1,
  introMessage: 'Este curso está estructurado en tres microlecciones. Haz clic en cada lección para avanzar en tu aprendizaje.',
  lessons: [
    {
      id: 0,
      title: 'Introducción',
      duration: '5 min',
      status: 'completed',
      slides: [
        {
          id: 'intro-1',
          type: 'welcome',
          title: '¡¡Bienvenidos y Bienvenidas!!',
          subtitle: 'Gerentes al Curso Gestión gerencial del riesgo con DS44',
          content: 'Este programa ha sido diseñado especialmente para quienes toman decisiones estratégicas y lideran equipos, con el propósito de fortalecer su capacidad para **apoyar la toma de decisiones de alto nivel en la gestión de riesgos laborales**, conforme al **DS 44** y la normativa chilena vigente',
          image: '/images/worker-male.jpg',
        },
      ],
    },
    {
      id: 1,
      title: 'Marco legal y responsabilidad directiva',
      duration: '15 min',
      status: 'completed',
      slides: [
        {
          id: 'lesson1-1',
          type: 'info',
          title: 'Alcance del DS 44 y deber de protección del empleador',
          subtitle: 'Lección 1 - Marco legal',
          content: 'El Decreto Supremo 44 define la gestión preventiva como un aliado de la productividad, estableciendo responsabilidades claras para quienes lideran las organizaciones.',
          highlightText: 'Escuchemos atentamente cómo se entiende para los perfiles gerenciales en su empresa.',
          image: '/images/worker-female.jpg',
        },
        {
          id: 'lesson1-2',
          type: 'podcast',
          title: 'PODCAST',
          subtitle: 'Momento de escuchar',
          audio: '/audio/lesson1-podcast.mp3',
          quote: 'La prevención se integra a la gestión del negocio, favoreciendo la continuidad operacional.',
        },
        {
          id: 'lesson1-3',
          type: 'info',
          title: 'Visualización del Riesgo',
          subtitle: 'Lección 1 - Casos prácticos',
          content: 'A continuación, veremos un video explicativo sobre la implementación de las medidas de seguridad según el **DS 44** en entornos industriales de alto riesgo.',
        },
        {
          id: 'lesson1-4',
          type: 'info',
          title: 'Delegación de Funciones',
          subtitle: 'Lección 1 - Responsabilidades',
          content: 'Es vital distinguir qué aspectos de la gestión preventiva pueden ser delegados y cuáles requieren la atención directa de la alta dirección.',
        },
        {
          id: 'lesson1-5',
          type: 'info',
          title: 'Gestión de Riesgos Paso a Paso',
          subtitle: 'Lección 1 - Metodología',
          content: 'A continuación, exploraremos los tres pilares fundamentales para una gestión preventiva eficaz según los estándares internacionales.',
        },
        {
          id: 'lesson1-6',
          type: 'quiz',
          title: 'Toma de Decisiones',
          subtitle: 'Lección 1 - Actividad Práctica',
          content: 'Analiza las siguientes situaciones y decide cuál es la acción más adecuada para un perfil gerencial según la normativa vigente.',
        },
        {
          id: 'lesson1-7',
          type: 'info',
          title: 'Visión Estratégica',
          subtitle: 'Lección 1 - Reflexión final',
          content: 'Para cerrar esta primera etapa, es fundamental recordar el impacto que tiene la prevención en la salud financiera y operativa de la compañía.',
        },
      ],
    },
    {
      id: 2,
      title: 'SST como sistema de gestión',
      duration: '15 min',
      status: 'in-progress',
      slides: [
        {
          id: 'lesson2-1',
          type: 'info',
          title: 'Sistema de Gestión de SST',
          subtitle: 'Lección 2 - SST como sistema de gestión',
          content: 'De acuerdo con el Decreto Supremo 44, se requiere que la gerencia tenga una visión sistémica, desde la perspectiva de un Sistema de Gestión, y que integra estas tres (3) normas chilenas:',
        },
      ],
    },
    {
      id: 3,
      title: 'Decisiones gerenciales críticas',
      duration: '15 min',
      status: 'locked',
      slides: [
        {
          id: 'lesson3-1',
          type: 'info',
          title: 'Decisiones gerenciales críticas',
          subtitle: 'Lección 3 - Marco legal',
          content: 'El Decreto Supremo 44 define la gestión preventiva como un aliado de la productividad, estableciendo responsabilidades claras para quienes lideran las organizaciones.',
        },
      ],
    },
  ],
}

export function getLessonById(id: number): Lesson | undefined {
  return courseData.lessons.find(lesson => lesson.id === id)
}

export function getSlideById(lessonId: number, slideId: string): Slide | undefined {
  const lesson = getLessonById(lessonId)
  return lesson?.slides.find(slide => slide.id === slideId)
}
