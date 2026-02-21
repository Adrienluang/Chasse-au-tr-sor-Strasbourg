<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

import type { MapMarker } from '~/components/LeafletMap.vue'
import { parcours } from '~/data/parcours'

const { routeCoords, fetchRoute } = useItinerary()
const { start: startGps } = useGeolocation()
const { currentCheckpointIndex, validateCheckpoint, isValidated } = useProgression()

const markers = computed<MapMarker[]>(() =>
  parcours.map((wp, i) => {
    let status: MapMarker['status'] = 'locked'
    if (isValidated(wp.id)) {
      status = 'validated'
    } else if (i === currentCheckpointIndex.value) {
      status = 'active'
    }
    return {
      coords: wp.coords,
      label: wp.name,
      status,
    }
  }),
)

const activeWaypoint = computed(() => parcours[currentCheckpointIndex.value])

function onDiscover() {
  if (activeWaypoint.value) {
    validateCheckpoint(activeWaypoint.value.id)
  }
}

onMounted(() => {
  fetchRoute()
  startGps()
})
</script>

<template>
  <div class="map-page">
    <ClientOnly>
      <LeafletMap :route-coords="routeCoords" :markers="markers" />
    </ClientOnly>
    <ProgressBar />
    <GpsStatus />
    <DiscoverButton
      v-if="activeWaypoint"
      :active-waypoint="activeWaypoint"
      @discover="onDiscover"
    />
  </div>
</template>

<style scoped lang="scss">
.map-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
