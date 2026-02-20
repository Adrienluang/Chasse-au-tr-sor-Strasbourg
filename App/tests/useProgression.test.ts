import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

vi.stubGlobal('localStorage', localStorageMock)

// Import après le mock
const { useProgression } = await import('~/composables/useProgression')

describe('useProgression', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('initialise avec un UUID joueur et aucun checkpoint validé', () => {
    const { state } = useProgression()
    expect(state.value.playerId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    )
    expect(state.value.checkpointsValidated).toEqual([])
    expect(state.value.onboardingDone).toBe(false)
    expect(state.value.rgpdAccepted).toBe(false)
  })

  it('valide un checkpoint et le persiste', () => {
    const { state, validateCheckpoint, isValidated } = useProgression()
    validateCheckpoint(1)
    expect(isValidated(1)).toBe(true)
    expect(state.value.checkpointsValidated).toContain(1)
  })

  it('ne duplique pas un checkpoint déjà validé', () => {
    const { state, validateCheckpoint } = useProgression()
    validateCheckpoint(1)
    validateCheckpoint(1)
    expect(state.value.checkpointsValidated.filter(id => id === 1)).toHaveLength(1)
  })

  it('calcule progressPercent correctement', () => {
    const { validateCheckpoint, progressPercent } = useProgression()
    expect(progressPercent.value).toBe(0)
    for (let i = 1; i <= 17; i++) validateCheckpoint(i)
    expect(progressPercent.value).toBe(100)
  })

  it('isFinished est true quand les 17 checkpoints sont validés', () => {
    const { validateCheckpoint, isFinished } = useProgression()
    expect(isFinished.value).toBe(false)
    for (let i = 1; i <= 17; i++) validateCheckpoint(i)
    expect(isFinished.value).toBe(true)
  })

  it('setLocale met à jour la locale', () => {
    const { state, setLocale } = useProgression()
    setLocale('en')
    expect(state.value.locale).toBe('en')
  })

  it('resetProgression efface les checkpoints et les flags', () => {
    const { state, validateCheckpoint, setOnboardingDone, resetProgression } = useProgression()
    validateCheckpoint(1)
    setOnboardingDone()
    resetProgression()
    expect(state.value.checkpointsValidated).toEqual([])
    expect(state.value.onboardingDone).toBe(false)
  })
})
