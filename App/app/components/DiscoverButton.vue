<script setup lang="ts">
import type { Waypoint } from '~/types/waypoint'

const props = defineProps<{
  activeWaypoint: Waypoint
}>()

const emit = defineEmits<{
  discover: []
}>()

const { distanceTo } = useGeolocation()

const isNearby = computed(() => {
  const d = distanceTo(props.activeWaypoint.coords)
  return d !== null && d < 80
})
</script>

<template>
  <button
    v-show="isNearby"
    class="discover-btn"
    @click="emit('discover')"
  >
    Découvrir
  </button>
</template>

<style scoped lang="scss">
.discover-btn {
  position: absolute;
  bottom: $spacing-xl;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  padding: $spacing-sm $spacing-lg;
  background: $color-primary;
  color: $color-background;
  border: none;
  border-radius: $radius-full;
  font-size: 18px;
  font-weight: bold;
  font-family: $font-family-body;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);

  &:active {
    transform: translateX(-50%) scale(0.95);
  }
}
</style>
