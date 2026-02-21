<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

import type { MapMarker } from '~/components/LeafletMap.vue'
import { parcours } from '~/data/parcours'

const { routeCoords, fetchRoute } = useItinerary()
const { start: startGps } = useGeolocation()
const { currentCheckpointIndex, validateCheckpoint, isValidated, isFinished, resetProgression } = useProgression()

const showResetModal = ref(false)

function onConfirmReset() {
  resetProgression()
  navigateTo('/onboarding')
}

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
    const id = activeWaypoint.value.id
    validateCheckpoint(id)
    if (isFinished.value) {
      navigateTo('/fin')
    } else {
      navigateTo(`/checkpoint/${id}`)
    }
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
    <button class="map-page__reset" @click="showResetModal = true">
      Recommencer
    </button>
    <ResetConfirmModal
      v-model="showResetModal"
      @confirm="onConfirmReset"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.map-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  &__reset {
    position: absolute;
    bottom: 16px;
    left: 16px;
    z-index: 1000;
    padding: $spacing-xs $spacing-sm;
    background-color: $color-surface;
    color: $color-text-muted;
    border: 1px solid $color-text-muted;
    border-radius: $radius-md;
    font-family: $font-family-ui;
    font-size: 0.75rem;
    opacity: 0.7;
    transition: opacity $transition-default;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
