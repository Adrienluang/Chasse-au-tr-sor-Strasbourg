<script setup lang="ts">
defineProps<{
  narrator: 'armand' | 'elias'
}>()

const labels = {
  armand: 'Armand K. — 1871',
  elias: 'Elias Morgenstern — 1928',
}
</script>

<template>
  <span class="narrator-badge">{{ labels[narrator] }}</span>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.narrator-badge {
  display: inline-block;
  padding: $spacing-xs $spacing-sm;
  background-color: $color-primary;
  color: $color-background;
  font-family: $font-family-ui;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: $radius-full;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}
</style>
