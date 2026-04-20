'use client'

import { Slide, SlideTitle, SlideSubtitle, SlideParagraph, SlideVideo } from '@/components/core-slides/base/SlideAtoms'

export function Slide3() {
  return (
    <Slide>
      <div className="flex flex-col gap-2 pt-4">
        <SlideTitle>Visualización del Riesgo</SlideTitle>
        <SlideSubtitle>Lección 1 - Casos prácticos</SlideSubtitle>
      </div>
      <SlideParagraph>
        A continuación, veremos un video explicativo sobre la implementación de las medidas de seguridad según el **DS 44** en entornos industriales de alto riesgo.
      </SlideParagraph>
      
      <SlideVideo 
        src="/sliders/slider2/video/ds4_video_1.mp4" 
        poster="/images/portada_video_2_slide_11.webp"
        title="Las decisiones gerenciales si tienen consecuencias"
        label="Video de apoyo"
      />

      <SlideParagraph>
        Es fundamental que los perfiles gerenciales comprendan estos procesos para garantizar la continuidad operacional y la seguridad de sus colaboradores.
      </SlideParagraph>
    </Slide>
  )
}
