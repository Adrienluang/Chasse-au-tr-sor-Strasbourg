<script setup lang="ts">
const { currentCheckpointIndex, totalCheckpoints } = useProgression()
</script>

<template>
  <div class="progress-bar">
    <div class="progress-bar__track">
      <div
        class="progress-bar__fill"
        :style="{ width: `${(currentCheckpointIndex / totalCheckpoints) * 100}%` }"
      />
    </div>
    <span class="progress-bar__text">{{ currentCheckpointIndex }} / {{ totalCheckpoints }}</span>
  </div>
</template>

<style scoped lang="scss">
.progress-bar {
  position: absolute;
  top: $spacing-md;
  left: $spacing-md;
  right: 60px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: $spacing-sm;

  &__track {
    flex: 1;
    height: 8px;
    background: $color-surface;
    border-radius: $radius-full;
    overflow: hidden;
  }

  &__fill {
    height: 100%;
    background: $color-primary;
    border-radius: $radius-full;
    transition: width 0.3s ease;
  }

  &__text {
    font-size: 14px;
    color: $color-primary;
    white-space: nowrap;
    font-weight: bold;
  }
}
</style>
