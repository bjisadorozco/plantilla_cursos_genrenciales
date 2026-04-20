'use client'

import { Slide, SlideTitle, SlideSubtitle, SlideParagraph, SlideDecisionActivity } from '@/components/core-slides/base/SlideAtoms'

export function Slide6() {
  const activityOptions = [
    {
      id: 'opt-1',
      letter: 'A',
      text: '¿Reconocer que la falta de decisión fue gerencial?',
      correctAnswer: 'yes' as const,
      feedback: {
        correct: 'Correcto. La alta dirección debe asumir la responsabilidad de las decisiones estratégicas en SST.',
        incorrect: 'Incorrecto. Según el DS 44, la responsabilidad final de la gestión preventiva es de la gerencia.',
        keyMessage: 'La rendición de cuentas comienza en la alta dirección.'
      }
    },
    {
      id: 'opt-2',
      letter: 'B',
      text: '¿Modificar indicadores de desempeño de jefaturas?',
      correctAnswer: 'no' as const,
      feedback: {
        correct: 'Correcto. Cambiar solo indicadores sin un cambio cultural no resuelve el problema de fondo.',
        incorrect: 'Incorrecto. Modificar indicadores es una medida reactiva que no sustituye el liderazgo preventivo.',
        keyMessage: 'La gestión se basa en liderazgo, no solo en números.'
      }
    },
    {
      id: 'opt-3',
      letter: 'C',
      text: '¿Cambiar el modelo de liderazgo en SST?',
      correctAnswer: 'no' as const,
      feedback: {
        correct: 'Correcto. El modelo debe integrarse a la operación existente, no necesariamente cambiarse por completo.',
        incorrect: 'Incorrecto. Antes de cambiar el modelo, se debe evaluar la implementación del actual bajo el DS 44.',
        keyMessage: 'La mejora continua evalúa antes de transformar.'
      }
    }
  ]

  return (
    <Slide>
      <div className="flex flex-col gap-2 pt-4">
        <SlideTitle>Toma de Decisiones</SlideTitle>
        <SlideSubtitle>Lección 1 - Actividad Práctica</SlideSubtitle>
      </div>
      
      <SlideParagraph>
        Analiza las siguientes situaciones y decide cuál es la acción más adecuada para un perfil gerencial según la normativa vigente.
      </SlideParagraph>

      <SlideDecisionActivity 
        title="Opciones para decisión gerencial" 
        options={activityOptions} 
      />

      <SlideParagraph>
        Recuerda que cada decisión impacta directamente en la cultura preventiva de tu organización.
      </SlideParagraph>
    </Slide>
  )
}
