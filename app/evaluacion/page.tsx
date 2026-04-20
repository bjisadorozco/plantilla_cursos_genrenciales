'use client'

import { MainLayout } from '@/components/layout'
import { Title, SmallText } from '@/components/ui/typography'
import { Info, ChevronRight, Lock, CheckCircle2 } from 'lucide-react'
import { TranslatedText } from '@/contexts/TranslationContext'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import useTrackingStore from '@/store/useTrackingStore'
import { useEffect, useState } from 'react'

// Parámetro de progreso mínimo para habilitar la evaluación
const MIN_PROGRESS_REQUIRED = 70;

const instructions = [
  "Lee cuidadosamente cada pregunta antes de responder.",
  "Selecciona solo una respuesta por cada pregunta (marcando el círculo correspondiente).",
  "No puedes regresar a preguntas anteriores una vez que hayas avanzado.",
  "Tienes 20 minutos para completar la evaluación."
];

export default function EvaluacionPage() {
  const [mounted, setMounted] = useState(false);
  const currentProgress = useTrackingStore((state) => state.currentProgress);
  const isLocked = currentProgress < MIN_PROGRESS_REQUIRED;

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayProgress = mounted ? currentProgress : 0;

  return (
    <MainLayout>
      <div className="py-8 px-4 flex flex-col gap-8 max-w-[700px] mx-auto">
        
        {/* Header Section */}
        <div className="text-center flex flex-col items-center gap-4">
          <div className="relative w-full h-48 md:h-56 rounded-3xl overflow-hidden shadow-lg border border-border bg-muted">
            <Image 
              src="/images/worker-female.jpg" 
              alt="Evaluación Final"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-6">
              <h1 className="text-white text-3xl font-bold tracking-tight">
                <TranslatedText>Evaluación Final</TranslatedText>
              </h1>
            </div>
          </div>
          
          <div className="max-w-md">
            <SmallText className="text-lg leading-relaxed text-gray-medium">
              <TranslatedText>
                Has llegado al final del recorrido. Es momento de poner a prueba los conocimientos adquiridos durante el curso.
              </TranslatedText>
            </SmallText>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-lighter">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Info className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-dark">
              <TranslatedText>Instrucciones</TranslatedText>
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {instructions.map((text, index) => (
              <div 
                key={index}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl transition-colors",
                  index % 2 === 0 ? "bg-gray-50" : "bg-[#f8f6ff]"
                )}
              >
                <div className="w-8 h-8 rounded-full border-2 border-primary/30 flex items-center justify-center flex-shrink-0 bg-white">
                  <span className="text-primary font-bold">{index + 1}</span>
                </div>
                <p className="text-gray-medium font-medium text-base">
                  <TranslatedText>{text}</TranslatedText>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Section */}
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="text-center flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-primary">
              <TranslatedText>¿Estás listo para comenzar?</TranslatedText>
            </h3>
            <p className="text-gray-medium text-base">
              <TranslatedText>Una vez que inicies, el temporizador comenzará a correr.</TranslatedText>
            </p>
          </div>

          {isLocked ? (
            <div className="w-full flex flex-col gap-4 items-center">
              <div className="w-full bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
                <Lock className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800 text-sm font-medium">
                  <TranslatedText>Debes completar al menos el</TranslatedText> {MIN_PROGRESS_REQUIRED}% <TranslatedText>del curso para habilitar la evaluación. Tu progreso actual es de</TranslatedText> {displayProgress}%.
                </p>
              </div>
              
              <button
                disabled
                className="w-full max-w-sm bg-gray-200 text-gray-400 font-bold py-4 px-8 rounded-full cursor-not-allowed flex items-center justify-center gap-2"
              >
                <TranslatedText>Iniciar Evaluación</TranslatedText>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                // Lógica para iniciar evaluación
                console.log("Iniciando evaluación...");
              }}
              className="w-full max-w-sm bg-gradient-to-r from-[#6a11cb] via-[#91208a] to-[#d52b5e] hover:opacity-90 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <TranslatedText>Iniciar Evaluación</TranslatedText>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-medium font-medium">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span><TranslatedText>Necesitas un 70% de respuestas correctas para aprobar.</TranslatedText></span>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
