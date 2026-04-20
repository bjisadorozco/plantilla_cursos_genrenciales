'use client'

import { Slide, SlideTitle, SlideSubtitle, SlideParagraph, SlideImage, SlideHighlight, SlideAudio } from '@/components/core-slides/base/SlideAtoms'

export function Slide2() {
  return (
    <Slide>
      <div className="flex flex-col gap-2 pt-4">
        <SlideTitle>Alcance del DS 44 y deber de protección del empleador</SlideTitle>
        <SlideSubtitle>Lección 1 - Marco legal</SlideSubtitle>
      </div>
      <SlideParagraph>
        El **Decreto Supremo 44** define la gestión preventiva como un aliado de la productividad, estableciendo responsabilidades claras para quienes lideran las organizaciones.
      </SlideParagraph>
      <SlideHighlight>
        Escuchemos atentamente cómo se entiende para los perfiles gerenciales en su empresa.
      </SlideHighlight>
      <SlideImage src="/images/worker-female.jpg" />
    </Slide>
  )
}
