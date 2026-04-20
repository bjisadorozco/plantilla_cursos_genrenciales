'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Play, Pause, Volume2, CheckCircle2, XCircle, Info } from 'lucide-react'
import { TranslatedText } from '@/contexts/TranslationContext'
import { useAccessibility } from '@/contexts/AccessibilityContext'
import { useAudio } from '@/contexts/AudioContext'

export interface DecisionOption {
  id: string
  letter: string
  text: string
  correctAnswer: 'yes' | 'no'
  feedback: {
    correct: string
    incorrect: string
    keyMessage: string
  }
}

interface DecisionActivityProps {
  title: string
  options: DecisionOption[]
  className?: string
}

export function DecisionActivity({ title, options, className }: DecisionActivityProps) {
  const { soundsStopped } = useAccessibility()
  const { isSpeaking, setIsSpeaking, registerPlaying } = useAudio()
  const [selections, setSelections] = useState<Record<string, 'yes' | 'no' | null>>({})
  const [speakingOptionId, setSpeakingOptionId] = useState<string | null>(null)

  const handleDecision = (optionId: string, answer: 'yes' | 'no') => {
    setSelections(prev => ({ ...prev, [optionId]: answer }))
    
    // Auto-play feedback audio
    if (!soundsStopped) {
      const option = options.find(o => o.id === optionId)
      if (option) {
        const isCorrect = answer === option.correctAnswer
        const feedbackText = isCorrect ? option.feedback.correct : option.feedback.incorrect
        const fullText = `${isCorrect ? 'Correcto' : 'Incorrecto'}. ${feedbackText}.`
        speakFeedback(fullText, optionId)
      }
    }
  }

  const speakFeedback = (text: string, optionId: string) => {
    if (soundsStopped) return

    // Notify AudioContext that speech is starting
    registerPlaying(null) // This will stop any HTML audio
    setIsSpeaking(true)
    setSpeakingOptionId(optionId)

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-MX'
    utterance.rate = 1.0
    
    utterance.onend = () => {
      setIsSpeaking(false)
      setSpeakingOptionId(null)
    }
    utterance.onerror = () => {
      setIsSpeaking(false)
      setSpeakingOptionId(null)
    }

    window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    if (soundsStopped && isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setSpeakingOptionId(null)
    }
  }, [soundsStopped, isSpeaking, setIsSpeaking])

  const playManualFeedback = (optionId: string) => {
    if (soundsStopped) return
    
    if (isSpeaking && speakingOptionId === optionId) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setSpeakingOptionId(null)
      return
    }

    const selection = selections[optionId]
    const option = options.find(o => o.id === optionId)
    if (selection && option) {
      const isCorrect = selection === option.correctAnswer
      const feedbackText = isCorrect ? option.feedback.correct : option.feedback.incorrect
      const fullText = `${isCorrect ? 'Correcto' : 'Incorrecto'}. ${feedbackText}.`
      speakFeedback(fullText, optionId)
    }
  }

  return (
    <div className={cn('my-8', className)}>
      <div className="relative border-2 border-primary rounded-3xl p-8 pt-12 bg-white/80 backdrop-blur-md shadow-xl shadow-primary/5">
        <div className="absolute -top-5 left-8 bg-gradient-to-r from-primary to-primary-light text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg">
          <TranslatedText>{title}</TranslatedText>
        </div>

        <div className="space-y-8">
          {options.map((option) => {
            const selection = selections[option.id]
            const isCorrect = selection === option.correctAnswer
            const isCurrentlySpeaking = isSpeaking && speakingOptionId === option.id

            return (
              <div key={option.id} className="pb-8 border-b border-gray-lighter last:border-0 last:pb-0">
                <div className="text-lg text-gray-dark mb-4">
                  <span className="font-bold text-primary mr-2">{option.letter}:</span>
                  <TranslatedText>{option.text}</TranslatedText>
                </div>

                <div className="flex items-center gap-4 ml-6 mb-4">
                  <button
                    onClick={() => handleDecision(option.id, 'yes')}
                    className={cn(
                      'w-16 h-10 rounded-xl font-bold transition-all border-2',
                      selection === 'yes'
                        ? 'bg-primary border-primary text-white shadow-md'
                        : 'bg-transparent border-primary text-primary hover:bg-primary/5'
                    )}
                  >
                    <TranslatedText>SI</TranslatedText>
                  </button>
                  <button
                    onClick={() => handleDecision(option.id, 'no')}
                    className={cn(
                      'w-16 h-10 rounded-xl font-bold transition-all border-2',
                      selection === 'no'
                        ? 'bg-primary border-primary text-white shadow-md'
                        : 'bg-transparent border-primary text-primary hover:bg-primary/5'
                    )}
                  >
                    <TranslatedText>NO</TranslatedText>
                  </button>
                </div>

                {/* Individual Feedback Section */}
                {selection && (
                  <div className={cn(
                    "mt-6 p-6 rounded-3xl animate-in fade-in slide-in-from-top-3 duration-500 border",
                    isCorrect 
                      ? "bg-green-50/30 border-green-100" 
                      : "bg-secondary/5 border-secondary/10"
                  )}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="shrink-0 mt-1">
                        {isCorrect ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" strokeWidth={2.5} />
                        ) : (
                          <XCircle className="w-6 h-6 text-secondary" strokeWidth={2.5} />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className={cn(
                          "text-lg font-extrabold block mb-1",
                          isCorrect ? "text-green-700" : "text-secondary"
                        )}>
                          <TranslatedText>{isCorrect ? '¡Correcto!' : 'Retroalimentación'}</TranslatedText>
                        </span>
                        <div className="text-gray-dark text-lg leading-relaxed">
                          <TranslatedText>
                            {isCorrect ? option.feedback.correct : option.feedback.incorrect}
                          </TranslatedText>
                        </div>
                      </div>
                    </div>
                    
                    {/* Audio Control / Progress Section */}
                    <div className="flex items-center gap-4 p-3 bg-white rounded-2xl shadow-sm border border-gray-lighter/50">
                      <button
                        onClick={() => playManualFeedback(option.id)}
                        className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md active:scale-90 transition-all shrink-0"
                      >
                        {isCurrentlySpeaking ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </button>
                      
                      <div className="flex-1 flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest ml-1">
                          {isCurrentlySpeaking ? 'Reproduciendo' : 'Escuchar audio'}
                        </span>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden relative">
                          {isCurrentlySpeaking ? (
                            <div className="h-full bg-primary animate-progress-indefinite rounded-full" />
                          ) : (
                            <div className="h-full bg-primary/20 w-0" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
