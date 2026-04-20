/**
 * AudioReader Avanzado - Versión Mejorada
 * - Reinicio automático en cambio de sección
 * - Animación al lado del icono
 * - Prevención de repetición de texto
 * - Selección de voz mejorada
 */
class AudioReader {
  constructor(container) {
    this.container = container
    this.synth = window.speechSynthesis
    this.utterances = []
    this.isPlaying = false
    this.currentUtterance = 0
    this.voices = []
    this.processedTexts = new Set() // Para evitar repeticiones
    this.currentSection = null // Para seguimiento de sección actual
    this.processingSection = false // Flag para evitar procesamiento duplicado
    this.progressKey = null // Clave para guardar progreso en localStorage
    this.lastContentHash = null // Para detectar cambios de contenido

    // Configuración de pausas
    this.pauseTitles = Number.parseInt(container.dataset.pauseTitles) || 1000
    this.pauseParagraphs = Number.parseInt(container.dataset.pauseParagraphs) || 800
    this.pauseLists = Number.parseInt(container.dataset.pauseLists) || 500
    this.pauseBetweenElements = Number.parseInt(container.dataset.pauseBetweenElements) || 300

    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search)
    this.mode = urlParams.get("mode") || "read"

    // Configurar propiedades básicas
    this.autoplay = this.container.dataset.autoplay === "true"
    this.textSelector = this.container.dataset.textSelector || "body"

    // Inicializar siempre para permitir toggle
    this.synth.onvoiceschanged = () => {
      this.voices = this.synth.getVoices()
      if (!this.initialized) {
        this.init()
      }
    }

    setTimeout(() => {
      this.voices = this.synth.getVoices()
      if (this.voices.length > 0 && !this.initialized) {
        this.init()
      }
    }, 1000)
  }

  init() {
    this.initialized = true
    this.createUI()
    this.setupEventListeners()
    this.updateUIVisibility()
    this.updateModeToggleTitle()
    this.updateCardBackground()

    // Generar clave única para esta página específica (incluye slider actual)
    const pathParts = window.location.pathname.split('/')
    const sliderName = pathParts[pathParts.length - 1] || 'index'
    // Incluir el slide activo actual en la clave de progreso
    const activeSlide = document.querySelector('.content-section.active')?.dataset?.slideIndex || '0'
    this.progressKey = `audio-reader-progress-${sliderName}-slide-${activeSlide}-${window.location.hash || 'main'}`

    console.log('🔑 Clave de progreso generada:', this.progressKey)

    // Mostrar progreso guardado si existe
    setTimeout(() => this.showSavedProgress(), 1000)

    if (this.autoplay && this.mode === "listen") {
      setTimeout(() => this.togglePlayback(), 500)
    }

    this.keepAliveInterval = setInterval(() => {
      if (this.isPlaying && !this.synth.speaking && this.currentUtterance < this.utterances.length - 1) {
        this.playNextUtterance()
      }
    }, 1000)
  }

  // Guardar progreso actual
  saveProgress() {
    const progressData = {
      currentUtterance: this.currentUtterance,
      totalUtterances: this.utterances.length,
      timestamp: Date.now(),
      sectionCompleted: this._sectionCompleted || false,
      sliderName: this.progressKey
    }
    localStorage.setItem(this.progressKey, JSON.stringify(progressData))
    console.log(`💾 Progreso guardado: ${this.currentUtterance + 1}/${this.utterances.length} en ${this.progressKey}`)
  }

  // Cargar progreso guardado
  loadProgress() {
    try {
      const saved = localStorage.getItem(this.progressKey)
      if (saved) {
        const progressData = JSON.parse(saved)
        // Solo cargar si no han pasado más de 2 horas (más tiempo para debugging)
        const twoHours = 2 * 60 * 60 * 1000
        if (Date.now() - progressData.timestamp < twoHours) {
          console.log(`📖 Progreso cargado: ${progressData.currentUtterance + 1}/${progressData.totalUtterances} desde ${this.progressKey}`)
          return progressData
        } else {
          // Limpiar progreso antiguo
          console.log(`🗑️ Progreso expirado, limpiando: ${this.progressKey}`)
          localStorage.removeItem(this.progressKey)
        }
      } else {
        console.log(`📭 No hay progreso guardado para: ${this.progressKey}`)
      }
    } catch (e) {
      console.warn('Error cargando progreso de audio:', e)
    }
    return null
  }

  // Limpiar progreso guardado
  clearProgress() {
    localStorage.removeItem(this.progressKey)
  }

  createUI() {
    this.container.innerHTML = `
      <div class="audio-control-card" style="display:flex;align-items:center;justify-content:space-between;width:100%;">
        <div class="audio-control-left">
             <i class="bi bi-volume-up text-primary" style="font-size: 1.5rem; margin-right: 10px; color: #6e3cd2;"></i>
             <span class="audio-label" style="font-weight: 600; font-size: 1rem;">Modo Lectura Audio</span>
        </div>
        <label class="audio-switch" style="position: relative; display: inline-block; width: 50px; height: 26px; margin-left: auto;">
          <input type="checkbox" class="mode-toggle-checkbox" ${this.mode === 'listen' ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
          <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
        </label>
      </div>
      
      <!-- Modal de reinicio de sección -->
      <div class="audio-restart-modal-overlay" id="audio-restart-modal">
        <div class="audio-restart-modal-content">
          <h3 data-translate="modal_audio_completed_title">Ya completaste esta sección</h3>
          <p data-translate="modal_audio_completed_message">¿Quieres reiniciar desde el principio?</p>
          <div class="audio-restart-modal-actions">
            <button class="audio-restart-modal-button secondary" id="audio-restart-cancel" data-translate="modal_audio_cancel_button">Cancelar</button>
            <button class="audio-restart-modal-button primary" id="audio-restart-confirm" data-translate="modal_audio_restart_button">Reiniciar</button>
          </div>
        </div>
      </div>
      
      <style>
      .audio-switch input:checked + .slider {
        background: linear-gradient(45deg, #6e3cd2, #c0185d);
      }
      .audio-switch input:focus + .slider {
        box-shadow: 0 0 1px #6e3cd2;
      }
      .audio-switch input:checked + .slider:before {
        transform: translateX(24px);
      }
      .slider:before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }
      </style>
    `;
    this.modeToggleCheckbox = this.container.querySelector(".mode-toggle-checkbox")
    this.controlCard = this.container.querySelector(".audio-control-card")

    // Referencias del modal
    this.restartModal = this.container.querySelector("#audio-restart-modal")
    this.restartCancelBtn = this.container.querySelector("#audio-restart-cancel")
    this.restartConfirmBtn = this.container.querySelector("#audio-restart-confirm")

    // External progress bar
    this.progress = document.getElementById('progressBar');
  }

  setupEventListeners() {
    this.modeToggleCheckbox.addEventListener("change", () => this.toggleMode())

    // Escuchar el evento personalizado de cambio de sección
    document.addEventListener("sectionChanged", (event) => {
      // Obtener la nueva sección activa
      const newSection = document.querySelector(".content-section.active")

      if (newSection && this.currentSection !== newSection) {
        this.currentSection = newSection
        this._hasProcessedSection = false // Reiniciar al cambiar de sección
        this._sectionCompleted = false // Permitir lectura en nueva sección

        // REINICIAR PROGRESO COMPLETAMENTE al cambiar de slide
        this.currentUtterance = 0
        this.clearProgress() // Limpiar progreso guardado
        this.lastContentHash = null // Forzar reprocesamiento de contenido

        // Actualizar clave de progreso para el nuevo slide
        const pathParts = window.location.pathname.split('/')
        const sliderName = pathParts[pathParts.length - 1] || 'index'
        const activeSlide = newSection.dataset?.slideIndex ||
          document.querySelector('[data-slide-index]')?.dataset?.slideIndex || '0'
        this.progressKey = `audio-reader-progress-${sliderName}-slide-${activeSlide}-${window.location.hash || 'main'}`

        //console.log('🔄 Cambiando de slide - Reiniciando progreso de audio')
        //console.log('🔑 Nueva clave de progreso:', this.progressKey)

        // Si estaba reproduciendo, reiniciar la lectura en la nueva sección
        if (this.isPlaying) {
          this.pause()
          setTimeout(() => {
            this.prepareContent()
            this.playNextUtterance(true)
          }, 300)
        }
      }
    })

    // Detectar clics en botones "Continuar"
    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("continue-button") || event.target.closest(".continue-button")) {
        // Si estaba reproduciendo, se reiniciará automáticamente en la nueva sección
        // gracias al evento sectionChanged que se dispara después
      }
    })

    // Detectar cambios de visibilidad de la página
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.isPlaying) {
        this.pause()
      }
    })

    // Detectar cuando se cierra la página
    window.addEventListener("beforeunload", () => {
      if (this.isPlaying) {
        this.pause()
      }
    })

    // Escuchar cambios de idioma
    document.addEventListener('languageChanged', () => {
      // Si está reproduciendo, pausar y preparar para el nuevo idioma
      if (this.isPlaying) {
        this.pause();
      }
      // Limpiar contenido procesado para forzar reprocesamiento con nuevo idioma
      this.lastContentHash = null;
      this.utterances = [];
      this.processedTexts.clear();
      this.currentUtterance = 0;
      this._sectionCompleted = false;
      this.clearProgress();

      // Actualizar título del botón con nuevo idioma
      this.updateModeToggleTitle();
    });

    // Event listeners para el modal de reinicio
    if (this.restartCancelBtn && this.restartConfirmBtn) {
      this.restartCancelBtn.addEventListener("click", () => this.hideRestartModal())
      this.restartConfirmBtn.addEventListener("click", () => this.confirmRestart())

      // Cerrar modal al hacer clic fuera del contenido
      this.restartModal.addEventListener("click", (e) => {
        if (e.target === this.restartModal) {
          this.hideRestartModal()
        }
      })
    }
  }

  togglePlayback() {
    if (this.isPlaying) {
      this.pause()
      this.saveProgress() // Guardar progreso al pausar
    } else {
      // Si la sección ya fue completada, mostrar modal de reinicio
      if (this._sectionCompleted) {
        this.showRestartModal()
        return
      }

      // Usar un flag para evitar procesamiento duplicado
      if (!this.processingSection) {
        this.processingSection = true

        // Preparar contenido (solo si es necesario)
        this.prepareContent()

        // Cargar progreso guardado DESPUÉS de preparar contenido
        const savedProgress = this.loadProgress()
        if (savedProgress && savedProgress.totalUtterances === this.utterances.length && !this._sectionCompleted) {
          this.currentUtterance = Math.min(savedProgress.currentUtterance, this.utterances.length - 1)
          this._sectionCompleted = savedProgress.sectionCompleted
          console.log(`📖 Retomando desde la posición ${this.currentUtterance + 1}/${this.utterances.length}`)

          // Actualizar progreso visual
          this.updateProgress(this.currentUtterance, this.utterances.length)
        }

        this.playNextUtterance(true)
        this.processingSection = false
      }
    }
  }

  prepareContent() {
    // Solo reiniciar si realmente cambió el contenido o es la primera vez
    const activeSection = document.querySelector(this.textSelector) || document.body
    const contentHash = activeSection.textContent.trim().substring(0, 100)

    // Si el contenido es el mismo y ya tenemos utterances, no reprocesar
    if (this.utterances.length > 0 && this.lastContentHash === contentHash) {
      console.log('📖 Contenido ya procesado, manteniendo progreso')
      return
    }

    this.lastContentHash = contentHash
    this.synth.cancel()
    this.utterances = []
    this.processedTexts.clear() // Limpiar textos procesados

    // Solo resetear currentUtterance si es contenido completamente nuevo
    if (!this.lastContentHash || this.lastContentHash !== contentHash) {
      this.currentUtterance = 0
      this._sectionCompleted = false // Resetear estado de completado
    }

    console.log('🎯 Preparando contenido para slider actual, hash:', contentHash.substring(0, 20))

    this.currentSection = activeSection

    // Seleccionar voz neutra (evitando español de España)
    const neutralVoice = this.findNeutralVoice()

    // Obtener todos los elementos a leer
    let elements = Array.from(activeSection.querySelectorAll("h1, h2, h3, h4, h5, h6, p, li, .readable"))

    // Filtrar elementos del modal y elementos anidados
    elements = elements.filter((el, index) => {
      // Excluir elementos que están dentro del modal de reinicio
      if (el.closest('.audio-restart-modal-overlay')) {
        return false
      }

      // Verificar si este elemento está contenido dentro de otro elemento de la lista
      return !elements.some((otherEl, otherIndex) => {
        return index !== otherIndex && otherEl.contains(el) && otherEl !== el
      })
    })

    // Crear un Set para rastrear elementos ya procesados por su posición en el DOM
    const processedElements = new Set()

    // Verificar si es la primera vez que procesamos esta sección
    const isFirstProcessing = !this._hasProcessedSection;
    this._hasProcessedSection = true;

    // Procesar los elementos para evitar repeticiones
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i]

      // Crear un identificador único para el elemento basado en su posición y contenido
      const elementId = `${el.tagName}-${i}-${el.textContent.trim().substring(0, 50)}`

      // Si ya procesamos este elemento, saltarlo
      if (processedElements.has(elementId)) {
        continue
      }
      processedElements.add(elementId)

      // Si no es la primera vez que procesamos y el elemento tiene la clase skip-duplicate-reading, lo saltamos
      if (!isFirstProcessing && el.classList.contains('skip-duplicate-reading')) {
        continue;
      }

      const text = el.textContent.trim()

      if (!text) continue // Saltar elementos vacíos

      // Saltar texto del modal específicamente
      if (text.includes('Ya completaste esta sección') || text.includes('¿Quieres reiniciar desde el principio?')) {
        continue
      }

      // Evitar repeticiones de texto (verificación adicional)
      if (this.processedTexts.has(text)) continue
      this.processedTexts.add(text)

      // Crear utterance para este elemento
      const utterance = new SpeechSynthesisUtterance(text)

      if (neutralVoice) {
        utterance.voice = neutralVoice
        utterance.lang = neutralVoice.lang
      } else {
        // Usar idioma según configuración actual
        const currentLanguage = localStorage.getItem('selectedLanguage') || 'es';
        utterance.lang = currentLanguage === 'en' ? "en-US" : "es-MX";
      }

      // Configuración según tipo de elemento
      if (el.tagName.match(/^H[1-6]$/)) {
        utterance.rate = 0.9
        utterance.pitch = 1.0
      } else {
        utterance.rate = el.tagName === "LI" ? 0.95 : 1
        utterance.pitch = 1.0
      }

      utterance.volume = 1

      // Configurar eventos
      utterance.onstart = () => {
        el.classList.add("being-read")
        this.updateProgress(i, elements.length)
      }

      utterance.onend = () => {
        el.classList.remove("being-read")
        this.currentUtterance++

        // Guardar progreso después de cada utterance
        this.saveProgress()

        // Si llegamos al final, detener completamente
        if (this.currentUtterance >= this.utterances.length) {
          this.isPlaying = false
          this.updateUI()
          this.progress.style.width = "100%"
          // Marcar que esta sección ya fue completamente leída
          this._sectionCompleted = true
          this.clearProgress() // Limpiar progreso cuando se completa
          console.log('🎉 Sección completada completamente')
          return
        }

        // Pausa según tipo de elemento
        let pauseDuration = 0
        if (el.tagName.match(/^H[1-6]$/)) {
          pauseDuration = this.pauseTitles
        } else if (el.tagName === "P") {
          pauseDuration = this.pauseParagraphs
        } else if (el.tagName === "LI") {
          pauseDuration = this.pauseLists
        } else {
          pauseDuration = this.pauseBetweenElements
        }

        if (pauseDuration > 0) {
          setTimeout(() => {
            if (this.isPlaying) {
              this.playNextUtterance()
            }
          }, pauseDuration)
        } else {
          if (this.isPlaying) {
            this.playNextUtterance()
          }
        }
      }

      utterance.onerror = (e) => {
        console.error("Error en speech synthesis:", e)
        el.classList.remove("being-read")
        this.isPlaying = false
        this.updateUI()
      }

      this.utterances.push(utterance)
    }
  }

  findNeutralVoice() {
    // Obtener idioma actual del sistema de traducciones
    const currentLanguage = localStorage.getItem('selectedLanguage') || 'es';

    let voicePriorities;

    if (currentLanguage === 'en') {
      // Prioridades para inglés
      voicePriorities = [
        { lang: "en-US" }, // Inglés americano
        { lang: "en-GB" }, // Inglés británico
        { lang: "en-CA" }, // Inglés canadiense
        { lang: "en-AU" }, // Inglés australiano
        { lang: "en" }, // Cualquier inglés
      ];
    } else {
      // Prioridades para español (por defecto)
      voicePriorities = [
        // Voces latinoamericanas
        { lang: "es-MX" }, // México
        { lang: "es-CO" }, // Colombia
        { lang: "es-419" }, // Latinoamérica
        { lang: "es-AR" }, // Argentina
        { lang: "es-CL" }, // Chile
        { lang: "es-PE" }, // Perú
        // Cualquier español que no sea de España
        { lang: "es", exclude: "es-ES" },
        // Si no hay otra opción, usar español de España
        { lang: "es-ES" },
      ];
    }

    // Buscar la mejor voz según prioridades
    for (const priority of voicePriorities) {
      const matchingVoices = this.voices.filter((voice) => {
        if (priority.exclude && voice.lang === priority.exclude) {
          return false
        }
        return voice.lang.startsWith(priority.lang)
      })

      if (matchingVoices.length > 0) {
        // Preferir voces femeninas que suelen ser más neutras
        const femaleVoice = matchingVoices.find(
          (voice) => voice.name.toLowerCase().includes("female") || !voice.name.toLowerCase().includes("male"),
        )

        return femaleVoice || matchingVoices[0]
      }
    }

    // Si no se encuentra ninguna voz específica, usar cualquier voz del idioma actual
    const langPrefix = currentLanguage === 'en' ? 'en' : 'es';
    return this.voices.find((voice) => voice.lang.startsWith(langPrefix))
  }

  playNextUtterance(forceStart = false) {
    if ((!this.isPlaying && !forceStart) || this.currentUtterance >= this.utterances.length) {
      return
    }

    this.isPlaying = true
    this.updateUI()
    this.synth.speak(this.utterances[this.currentUtterance])
  }

  updateProgress(current, total) {
    if (this.progress) {
      const percent = ((current + 1) / total) * 100
      this.progress.style.width = `${percent}%`
    }
  }

  // Mostrar progreso guardado en el botón
  showSavedProgress() {
    const savedProgress = this.loadProgress()
    if (savedProgress && savedProgress.totalUtterances > 0) {
      const progressText = `${savedProgress.currentUtterance + 1}/${savedProgress.totalUtterances}`
      console.log(`💾 Progreso encontrado: ${progressText}`)
    }
  }

  pause() {
    this.synth.cancel()
    this.isPlaying = false
    document.querySelectorAll(".being-read").forEach((el) => {
      el.classList.remove("being-read")
    })
    this.updateUI()
  }

  updateUI() {
    // UI update handled by toggle switch state
  }

  updateCardBackground() {
    // Background update removed as per user request
  }

  toggleMode() {
    // Pausar si está reproduciendo
    if (this.isPlaying) {
      this.pause()
    }

    // Cambiar modo basado en el estado del checkbox
    this.mode = this.modeToggleCheckbox.checked ? "listen" : "read"
    this.updateCardBackground()

    // Si cambió a modo escucha y autoplay está activado, iniciar reproducción
    if (this.mode === "listen" && this.autoplay) {
      setTimeout(() => this.togglePlayback(), 300)
    }
  }

  updateUIVisibility() {
    // No-op
  }

  updateModeToggleTitle() {
    // No-op
  }

  // Mostrar modal de reinicio
  showRestartModal() {
    if (this.restartModal) {
      this.restartModal.classList.add('active')
    }
  }

  // Ocultar modal de reinicio
  hideRestartModal() {
    if (this.restartModal) {
      this.restartModal.classList.remove('active')
    }
  }

  // Confirmar reinicio
  confirmRestart() {
    this.clearProgress()
    this._sectionCompleted = false
    this.currentUtterance = 0
    this.hideRestartModal()

    // Continuar con la reproducción
    if (!this.processingSection) {
      this.processingSection = true
      this.prepareContent()
      const savedProgress = this.loadProgress()
      if (savedProgress && savedProgress.totalUtterances === this.utterances.length && !this._sectionCompleted) {
        this.currentUtterance = Math.min(savedProgress.currentUtterance, this.utterances.length - 1)
        this._sectionCompleted = savedProgress.sectionCompleted
        this.updateProgress(this.currentUtterance, this.utterances.length)
      }
      this.playNextUtterance(true)
      this.processingSection = false
    }
  }

  destroy() {
    clearInterval(this.keepAliveInterval)
    this.pause()
    if (this.btn) {
      this.btn.removeEventListener("click", this.togglePlayback)
    }
  }
}

// Inicialización segura
document.addEventListener("DOMContentLoaded", () => {
  if (window.speechSynthesis) {
    document.querySelectorAll(".audio-reader-container").forEach((container) => {
      new AudioReader(container)
    })
  } else {
    console.warn("La API de Speech Synthesis no está soportada en este navegador")
    document.querySelectorAll(".audio-reader-container").forEach((container) => {
      container.classList.add("audio-reader-unsupported")
    })
  }
})

console.log("AudioReader mejorado cargado - Versión con reinicio automático en cambio de sección y prevención de duplicados")
