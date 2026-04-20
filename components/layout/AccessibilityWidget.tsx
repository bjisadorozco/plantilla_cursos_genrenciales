'use client'

import React from 'react'
import { 
  Accessibility, 
  RotateCcw, 
  ArrowLeft, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp,
  Plus,
  Minus,
  Eye,
  Type,
  Sun,
  Moon,
  Palette,
  Volume2,
  VolumeX,
  Link as LinkIcon,
  Heading,
  MousePointer2,
  Image as ImageIcon,
  Target,
  BookOpen,
  Keyboard,
  Mic,
  Languages,
  MinusCircle,
  CircleOff,
  ScanText
} from 'lucide-react'
import { useAccessibility } from '@/contexts/AccessibilityContext'
import { cn } from '@/lib/utils'
import { TranslatedText } from '@/contexts/TranslationContext'

export function AccessibilityWidget() {
  const { 
    isOpen, 
    setIsOpen, 
    position,
    setPosition,
    resetAll,
    fontSizeMultiplier,
    increaseFontSize,
    decreaseFontSize,
    increaseLineHeight,
    saturation,
    toggleSaturation,
    highContrast,
    toggleHighContrast,
    lowContrast,
    toggleLowContrast,
    negative,
    toggleNegative,
    grayscale,
    toggleGrayscale,
    legibleFont,
    toggleLegibleFont,
    linksHighlighted,
    toggleLinksHighlighted,
    headingsHighlighted,
    toggleHeadingsHighlighted,
    bigCursor,
    toggleBigCursor,
    keyboardNav,
    toggleKeyboardNav,
    voiceNav,
    toggleVoiceNav,
    imagesHidden,
    toggleImagesHidden,
    soundsStopped,
    toggleSoundsStopped,
    focusMode,
    toggleFocusMode,
    dyslexiaStyle,
    setDyslexiaStyle,
    isTextToSpeechOn,
    toggleTextToSpeech
  } = useAccessibility()

  if (!isOpen) return null

  return (
    <div 
      id="accessibility-widget-root"
      className={cn(
        "fixed top-20 z-[9999] w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[85vh] acc-exclude-color",
        position === 'left' ? "left-4" : "right-4"
      )}
    >
      {/* Header */}
      <div className="bg-blue-600 p-4 flex items-center justify-center gap-2 text-white relative">
        <Accessibility className="w-6 h-6" />
        <h2 className="font-bold text-lg">
          <TranslatedText>Accesibilidad de Sofactia</TranslatedText>
        </h2>
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-blue-700 p-1 rounded-full transition-colors"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      </div>

      <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
        {/* Reset Button */}
        <button 
          onClick={resetAll}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors shadow-md mb-6"
        >
          <RotateCcw className="w-6 h-6" />
          <span className="font-semibold text-sm text-center">
            <TranslatedText>Restablecer todas las configuraciones de accesibilidad</TranslatedText>
          </span>
        </button>

        {/* Navigation Arrows */}
        <div className="flex gap-2 mb-6">
          <button 
            onClick={() => setPosition('left')}
            className={cn(
              "p-2 rounded-lg border transition-colors shadow-sm",
              position === 'left' ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 hover:bg-gray-50 text-blue-600"
            )}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setPosition('right')}
            className={cn(
              "p-2 rounded-lg border transition-colors shadow-sm",
              position === 'right' ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 hover:bg-gray-50 text-blue-600"
            )}
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-4 pb-4">
          <AccessibilitySection 
            title="Ajustes Visuales" 
            icon={<Eye className="w-5 h-5 text-blue-600" />}
            defaultOpen={true}
          >
            <OptionRow 
              label="Aumentar Texto" 
              icon={<Type className="w-5 h-5 text-blue-600" />}
              control={<ControlButton icon={<Plus />} onClick={increaseFontSize} />}
            />
            <OptionRow 
              label="Disminuir Texto" 
              icon={<Type className="w-5 h-5 text-blue-600" />}
              control={<ControlButton icon={<Minus />} onClick={decreaseFontSize} />}
            />
            <OptionRow 
              label="Aumentar Espaciado" 
              icon={<Type className="w-5 h-5 text-blue-600" />}
              control={<ControlButton icon={<Plus />} onClick={increaseLineHeight} />}
            />
            <OptionRow 
              label="Saturación" 
              icon={<Palette className="w-5 h-5 text-blue-600" />}
              control={<Toggle checked={saturation} onChange={toggleSaturation} />}
              onClick={toggleSaturation}
            />
            <OptionRow 
              label="Contraste Alto" 
              icon={<Sun className="w-5 h-5 text-blue-600" />}
              control={<Toggle checked={highContrast} onChange={toggleHighContrast} />}
              onClick={toggleHighContrast}
            />
            <OptionRow 
              label="Contraste Bajo" 
              icon={<Moon className="w-5 h-5 text-blue-600" />}
              control={<Toggle checked={lowContrast} onChange={toggleLowContrast} />}
              onClick={toggleLowContrast}
            />
            <OptionRow 
              label="Invertir Colores" 
              icon={<CircleOff className="w-5 h-5 text-blue-600" />}
              control={<Toggle checked={negative} onChange={toggleNegative} />}
              onClick={toggleNegative}
            />
            <OptionRow 
              label="Escala de Grises" 
              icon={<Palette className="w-5 h-5 text-blue-600" />}
              control={<Toggle checked={grayscale} onChange={toggleGrayscale} />}
              onClick={toggleGrayscale}
            />
          </AccessibilitySection>

          <AccessibilitySection 
            title="Lectura y Dislexia" 
            icon={<BookOpen className="w-5 h-5 text-blue-600" />}
          >
            <OptionRow 
              label="Fuente Legible" 
              icon={<ScanText className="w-5 h-5 text-blue-600" />}
              control={<Toggle checked={legibleFont} onChange={toggleLegibleFont} />}
              onClick={toggleLegibleFont}
            />
            <div className="p-4 pt-0">
              <span className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
                <TranslatedText>Fuentes para Dislexia</TranslatedText>
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 1, name: 'OpenDyslexic' },
                  { id: 2, name: 'Comic Sans' },
                  { id: 3, name: 'Verdana' },
                  { id: 4, name: 'Roboto' }
                ].map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setDyslexiaStyle(dyslexiaStyle === font.id ? 0 : font.id)}
                    className={cn(
                      "text-xs p-2 rounded-lg border transition-all text-center",
                      dyslexiaStyle === font.id 
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                        : "bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>
            <OptionRow 
              label="Escuchar Texto" 
              icon={<Volume2 className="w-5 h-5 text-blue-600" />}
              control={<Toggle checked={isTextToSpeechOn} onChange={toggleTextToSpeech} />}
              onClick={toggleTextToSpeech}
            />
          </AccessibilitySection>

          <AccessibilitySection 
            title="Navegación" 
            icon={<Target className="w-5 h-5 text-blue-600" />}
          >
            <OptionRow 
              label="Resaltar Enlaces" 
              icon={<LinkIcon className="w-5 h-5 text-blue-600" />}
              control={<Toggle checked={linksHighlighted} onChange={toggleLinksHighlighted} />}
              onClick={toggleLinksHighlighted}
            />
            <OptionRow 
              label="Resaltar Encabezados" 
              icon={<Heading className="w-5 h-5 text-blue-600" />}
              control={<Toggle checked={headingsHighlighted} onChange={toggleHeadingsHighlighted} />}
              onClick={toggleHeadingsHighlighted}
            />
            <OptionRow 
              label="Cursor Grande" 
              icon={<MousePointer2 className="w-5 h-5 text-blue-600" />}
              control={<Toggle checked={bigCursor} onChange={toggleBigCursor} />}
              onClick={toggleBigCursor}
            />
            <OptionRow 
              label="Navegación Teclado" 
              icon={<Keyboard className="w-5 h-5 text-blue-600" />}
              control={<Toggle checked={keyboardNav} onChange={toggleKeyboardNav} />}
              onClick={toggleKeyboardNav}
            />
            <OptionRow 
              label="Navegación Voz" 
              icon={<Mic className="w-5 h-5 text-blue-600" />}
              control={<Toggle checked={voiceNav} onChange={toggleVoiceNav} />}
              onClick={toggleVoiceNav}
            />
          </AccessibilitySection>

          <AccessibilitySection 
            title="Otros Ajustes" 
            icon={<MinusCircle className="w-5 h-5 text-blue-600" />}
          >
            <OptionRow 
              label="Ocultar Imágenes" 
              icon={<ImageIcon className="w-5 h-5 text-blue-600" />}
              control={<Toggle checked={imagesHidden} onChange={toggleImagesHidden} />}
              onClick={toggleImagesHidden}
            />
            <OptionRow 
              label="Detener Sonidos" 
              icon={<VolumeX className="w-5 h-5 text-blue-600" />}
              control={<Toggle checked={soundsStopped} onChange={toggleSoundsStopped} />}
              onClick={toggleSoundsStopped}
            />
            <OptionRow 
              label="Modo Enfoque" 
              icon={<Target className="w-5 h-5 text-blue-600" />}
              control={<Toggle checked={focusMode} onChange={toggleFocusMode} />}
              onClick={toggleFocusMode}
            />
          </AccessibilitySection>
        </div>
      </div>
    </div>
  )
}

function AccessibilitySection({ 
  title, 
  icon, 
  children, 
  defaultOpen = false 
}: { 
  title: string, 
  icon: React.ReactNode, 
  children: React.ReactNode,
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  const handleToggle = () => {
    console.log(`SECTION TOGGLE: ${title}`, !isOpen)
    setIsOpen(!isOpen)
  }

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <button 
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-bold text-gray-800">
            <TranslatedText>{title}</TranslatedText>
          </span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-blue-600" />}
      </button>
      {isOpen && (
        <div className="bg-white divide-y divide-gray-50">
          {children}
        </div>
      )}
    </div>
  )
}

function OptionRow({ 
  label, 
  icon, 
  control,
  onClick
}: { 
  label: string, 
  icon: React.ReactNode, 
  control: React.ReactNode,
  onClick?: () => void
}) {
  return (
    <div 
      className={cn(
        "flex items-center justify-between p-4",
        onClick && "cursor-pointer hover:bg-gray-100 transition-colors active:bg-gray-200"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 pointer-events-none">
        {icon}
        <span className="text-gray-700 font-medium">
          <TranslatedText>{label}</TranslatedText>
        </span>
      </div>
      {control}
    </div>
  )
}

function ControlButton({ icon, onClick }: { icon: React.ReactNode, onClick: () => void }) {
  return (
    <button 
      onClick={(e) => {
        e.stopPropagation() // Prevent row click if any
        onClick()
      }}
      className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all active:scale-90 shadow-sm"
    >
      <span className="w-5 h-5 flex items-center justify-center pointer-events-none">
        {icon}
      </span>
    </button>
  )
}

function Toggle({ checked, onChange }: { checked: boolean, onChange: () => void }) {
  return (
    <button 
      onClick={(e) => {
        e.stopPropagation() // Prevent double toggle if row is clicked
        onChange()
      }}
      className={cn(
        "relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none shadow-inner",
        checked ? "bg-blue-600" : "bg-gray-200"
      )}
    >
      <div className={cn(
        "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 shadow-sm",
        checked ? "translate-x-6" : "translate-x-0"
      )} />
    </button>
  )
}
