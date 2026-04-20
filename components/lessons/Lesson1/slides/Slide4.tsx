'use client'

import { Slide, SlideTitle, SlideSubtitle, SlideParagraph, SlideAccordion } from '@/components/core-slides/base/SlideAtoms'

export function Slide4() {
  const accordionItems = [
    {
      title: "SI Delegar",
      content: (
        <div className="flex flex-col gap-2">
          <p className="font-medium">Qué puede delegar la gerencia</p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>Ejecución técnica (prevencionista, CPHS, jefaturas).</li>
            <li>Operación diaria de controles.</li>
          </ul>
          <p className="text-sm text-gray-medium mt-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      )
    },
    {
      title: "NO Delegable",
      content: (
        <div className="flex flex-col gap-2">
          <p className="font-medium">Responsabilidades exclusivas de la gerencia</p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>Aprobación de recursos para seguridad.</li>
            <li>Liderazgo estratégico del sistema de gestión.</li>
            <li>Rendición de cuentas ante autoridades.</li>
          </ul>
          <p className="text-sm text-gray-medium mt-2">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      )
    },
    {
      title: "Consideraciones Adicionales",
      content: (
        <div className="flex flex-col gap-2">
          <p>
            Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.
          </p>
          <p>
            Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam.
          </p>
        </div>
      )
    }
  ]

  return (
    <Slide>
      <div className="flex flex-col gap-2 pt-4">
        <SlideTitle>Delegación de Funciones</SlideTitle>
        <SlideSubtitle>Lección 1 - Responsabilidades</SlideSubtitle>
      </div>
      
      <SlideParagraph>
        Es vital distinguir qué aspectos de la gestión preventiva pueden ser delegados y cuáles requieren la atención directa de la alta dirección.
      </SlideParagraph>

      <SlideAccordion items={accordionItems} />

      <SlideParagraph>
        Recuerda que, aunque se delegue la ejecución, la **responsabilidad final** siempre recae en la alta dirección de la organización.
      </SlideParagraph>
    </Slide>
  )
}
