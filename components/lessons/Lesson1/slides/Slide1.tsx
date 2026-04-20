'use client'

import { Slide, SlideTitle, SlideSubtitle, SlideParagraph, SlideAudio, SlideImage } from '@/components/core-slides/base/SlideAtoms'
import { AudioButton } from '@/components/course/AudioPlayer'

export function Slide1() {
  return (
    <Slide>
      <div className="text-center flex flex-col gap-2 pt-4">
        <SlideTitle>¡¡Bienvenidos y Bienvenidas!!</SlideTitle>
        <SlideSubtitle>Gerentes al Curso Gestión gerencial del riesgo con DS44</SlideSubtitle>
      </div>
      <SlideParagraph>
        Este programa ha sido diseñado especialmente para quienes toman decisiones estratégicas y lideran equipos, con el propósito de fortalecer su capacidad para **apoyar la toma de decisiones de alto nivel en la gestión de riesgos laborales**, conforme al **DS 44** y la normativa chilena vigente.
      </SlideParagraph>
      <SlideImage src="/images/worker-male.jpg" alt="Character illustration" />
      <div className="flex justify-center pt-2">
        <AudioButton />
      </div>
    </Slide>
  )
}
