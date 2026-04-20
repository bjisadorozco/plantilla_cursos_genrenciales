'use client'

import { Slide, SlideTitle, SlideSubtitle, SlideParagraph, SlideSwiper } from '@/components/core-slides/base/SlideAtoms'

export function Slide5() {
  const swiperItems = [
    {
      title: "Identificación de Peligros",
      description: "El primer paso es reconocer las condiciones o actos que pueden causar daño en el lugar de trabajo.",
      image: "/images/worker-male.jpg",
    },
    {
      title: "Evaluación del Riesgo",
      description: "Analizar la probabilidad y severidad de los riesgos identificados para priorizar las acciones preventivas.",
      image: "/images/worker-female.jpg",
    },
    {
      title: "Control de Riesgos",
      description: "Implementar medidas para eliminar o mitigar los riesgos, siguiendo la jerarquía de controles.",
      image: "/images/worker-male.jpg",
    }
  ]

  return (
    <Slide>
      <div className="flex flex-col gap-2 pt-4">
        <SlideTitle>Gestión de Riesgos Paso a Paso</SlideTitle>
        <SlideSubtitle>Lección 1 - Metodología</SlideSubtitle>
      </div>
      
      <SlideParagraph>
        A continuación, exploraremos los tres pilares fundamentales para una gestión preventiva eficaz según los estándares internacionales.
      </SlideParagraph>

      <SlideSwiper items={swiperItems} />

      <SlideParagraph>
        Desliza para conocer cada una de las etapas clave que todo líder debe supervisar en su organización.
      </SlideParagraph>
    </Slide>
  )
}
