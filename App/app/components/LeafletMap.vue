<script setup lang="ts">
import { ref, onMounted, watch, type PropType } from 'vue'

export interface MapMarker {
  coords: [number, number]
  label: string
  status: 'locked' | 'active' | 'validated'
}

const props = defineProps({
  routeCoords: {
    type: Array as PropType<[number, number][]>,
    default: () => [],
  },
  markers: {
    type: Array as PropType<MapMarker[]>,
    default: () => [],
  },
})

const mapContainer = ref<HTMLDivElement | null>(null)
let map: L.Map | null = null
let polyline: L.Polyline | null = null
let markerLayers: L.CircleMarker[] = []
let L: typeof import('leaflet')

const statusColors: Record<MapMarker['status'], string> = {
  validated: '#c8a96e',
  active: '#3388ff',
  locked: '#666666',
}

function updatePolyline() {
  if (!map || !L) return
  if (polyline) {
    polyline.remove()
  }
  if (props.routeCoords.length > 0) {
    polyline = L.polyline(props.routeCoords, {
      color: '#3388ff',
      weight: 4,
    }).addTo(map)
  }
}

function updateMarkers() {
  if (!map || !L) return
  for (const m of markerLayers) {
    m.remove()
  }
  markerLayers = []

  for (const marker of props.markers) {
    const radius = marker.status === 'active' ? 10 : 7
    const cm = L.circleMarker(marker.coords, {
      radius,
      fillColor: statusColors[marker.status],
      color: statusColors[marker.status],
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
    }).addTo(map)
    cm.bindPopup(marker.label)
    markerLayers.push(cm)
  }
}

onMounted(async () => {
  L = await import('leaflet')

  if (!mapContainer.value) return

  map = L.map(mapContainer.value, {
    center: [48.5815, 7.745],
    zoom: 15,
    zoomControl: false,
  })

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
  }).addTo(map)

  updatePolyline()
  updateMarkers()
})

watch(() => props.routeCoords, updatePolyline, { deep: true })
watch(() => props.markers, updateMarkers, { deep: true })
</script>

<template>
  <div ref="mapContainer" class="leaflet-map" />
</template>

<style scoped lang="scss">
.leaflet-map {
  width: 100%;
  height: 100%;
}
</style>
