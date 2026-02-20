import { ref, onUnmounted } from 'vue'
import { haversineDistance } from '~/utils/coords'

export type GpsStatus = 'idle' | 'active' | 'error'

const DEBOUNCE_MS = 3000

export function useGeolocation() {
  const position = ref<[number, number] | null>(null) // [lat, lng]
  const accuracy = ref<number | null>(null)
  const status = ref<GpsStatus>('idle')
  const error = ref<string | null>(null)

  let watchId: number | null = null
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function handlePosition(pos: GeolocationPosition): void {
    if (debounceTimer) return

    debounceTimer = setTimeout(() => {
      debounceTimer = null
    }, DEBOUNCE_MS)

    position.value = [pos.coords.latitude, pos.coords.longitude]
    accuracy.value = pos.coords.accuracy
    status.value = 'active'
    error.value = null
  }

  function handleError(err: GeolocationPositionError): void {
    status.value = 'error'
    error.value = err.message
  }

  function start(): void {
    if (!navigator.geolocation) {
      status.value = 'error'
      error.value = 'Géolocalisation non supportée par ce navigateur.'
      return
    }

    watchId = navigator.geolocation.watchPosition(handlePosition, handleError, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000,
    })
  }

  function stop(): void {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      watchId = null
    }
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
    status.value = 'idle'
  }

  function distanceTo(target: [number, number]): number | null {
    if (!position.value) return null
    return haversineDistance(position.value, target)
  }

  onUnmounted(stop)

  return {
    position,
    accuracy,
    status,
    error,
    start,
    stop,
    distanceTo,
  }
}
