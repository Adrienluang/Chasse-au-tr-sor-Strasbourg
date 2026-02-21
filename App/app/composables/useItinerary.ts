import { ref } from 'vue'
import { parcours } from '~/data/parcours'

let cachedCoords: [number, number][] | null = null

export function useItinerary() {
  const routeCoords = ref<[number, number][]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchRoute(): Promise<void> {
    if (cachedCoords) {
      routeCoords.value = cachedCoords
      return
    }

    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const apiKey = config.public.graphhopperApiKey as string

      if (!apiKey) {
        throw new Error('Clé API GraphHopper manquante. Vérifiez NUXT_PUBLIC_GRAPHHOPPER_API_KEY dans .env')
      }

      // GraphHopper attend point=lat,lng — nos coords internes sont déjà [lat, lng]
      const points = parcours.map((wp) => `${wp.coords[0]},${wp.coords[1]}`)

      const params = new URLSearchParams()
      params.append('key', apiKey)
      params.append('profile', 'foot')
      params.append('points_encoded', 'false')
      params.append('snap_prevention', 'motorway,ferry,tunnel')
      for (const p of points) {
        params.append('point', p)
      }

      const data = await $fetch<{ paths: Array<{ points: { coordinates: number[][] } }> }>(
        `https://graphhopper.com/api/1/route?${params.toString()}`,
      )

      const coords = data.paths[0].points.coordinates.map(
        ([lng, lat]) => [lat, lng] as [number, number],
      )

      cachedCoords = coords
      routeCoords.value = coords
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Erreur lors du calcul de l\'itinéraire'
    } finally {
      loading.value = false
    }
  }

  return {
    routeCoords,
    loading,
    error,
    fetchRoute,
  }
}
