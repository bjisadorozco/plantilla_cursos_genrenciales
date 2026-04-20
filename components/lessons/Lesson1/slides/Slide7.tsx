'use client'

import { Slide, SlideTitle, SlideSubtitle, SlideParagraph, SlideQuote } from '@/components/core-slides/base/SlideAtoms'

export function Slide7() {
  return (
    <Slide>
      <div className="flex flex-col gap-2 pt-4">
        <SlideTitle>Visión Estratégica</SlideTitle>
        <SlideSubtitle>Lección 1 - Reflexión final</SlideSubtitle>
      </div>
      
      <SlideParagraph>
        Para cerrar esta primera etapa, es fundamental recordar el impacto que tiene la prevención en la salud financiera y operativa de la compañía.
      </SlideParagraph>

      <SlideQuote>
        La prevención se integra a la gestión del negocio, favoreciendo la continuidad operacional.
      </SlideQuote>

      <SlideParagraph>
        Un gerente que lidera con prevención no solo protege a su gente, sino que asegura el futuro de su organización.
      </SlideParagraph>
    </Slide>
  )
}
