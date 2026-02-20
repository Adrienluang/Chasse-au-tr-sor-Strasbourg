import { ref, computed } from 'vue'

const STORAGE_KEY = 'chasse_tresor_progression'

export interface ProgressionState {
  playerId: string
  checkpointsValidated: number[]
  locale: 'fr' | 'en'
  onboardingDone: boolean
  rgpdAccepted: boolean
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function loadFromStorage(): ProgressionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as ProgressionState
  } catch {
    // localStorage indisponible ou données corrompues
  }
  return {
    playerId: generateUUID(),
    checkpointsValidated: [],
    locale: 'fr',
    onboardingDone: false,
    rgpdAccepted: false,
  }
}

function saveToStorage(state: ProgressionState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage indisponible
  }
}

export function useProgression() {
  const state = ref<ProgressionState>(loadFromStorage())

  const currentCheckpointIndex = computed(() =>
    state.value.checkpointsValidated.length,
  )

  const totalCheckpoints = 17

  const progressPercent = computed(() =>
    Math.round((state.value.checkpointsValidated.length / totalCheckpoints) * 100),
  )

  const isFinished = computed(
    () => state.value.checkpointsValidated.length >= totalCheckpoints,
  )

  function validateCheckpoint(id: number): void {
    if (!state.value.checkpointsValidated.includes(id)) {
      state.value.checkpointsValidated.push(id)
      saveToStorage(state.value)
    }
  }

  function isValidated(id: number): boolean {
    return state.value.checkpointsValidated.includes(id)
  }

  function setLocale(locale: 'fr' | 'en'): void {
    state.value.locale = locale
    saveToStorage(state.value)
  }

  function setOnboardingDone(): void {
    state.value.onboardingDone = true
    saveToStorage(state.value)
  }

  function setRgpdAccepted(): void {
    state.value.rgpdAccepted = true
    saveToStorage(state.value)
  }

  function resetProgression(): void {
    const fresh: ProgressionState = {
      playerId: state.value.playerId,
      checkpointsValidated: [],
      locale: state.value.locale,
      onboardingDone: false,
      rgpdAccepted: false,
    }
    state.value = fresh
    saveToStorage(fresh)
  }

  return {
    state,
    currentCheckpointIndex,
    totalCheckpoints,
    progressPercent,
    isFinished,
    validateCheckpoint,
    isValidated,
    setLocale,
    setOnboardingDone,
    setRgpdAccepted,
    resetProgression,
  }
}
