<script setup lang="ts">
const { status } = useGeolocation()

const statusColor: Record<string, string> = {
  active: '#2ecc71',
  idle: '#f1c40f',
  error: '#e74c3c',
}
</script>

<template>
  <div class="gps-status">
    <span
      class="gps-status__dot"
      :style="{ backgroundColor: statusColor[status] }"
    />
  </div>
</template>

<style scoped lang="scss">
.gps-status {
  position: absolute;
  top: $spacing-md;
  right: $spacing-md;
  z-index: 1000;

  &__dot {
    display: block;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
}
</style>
