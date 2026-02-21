<script setup lang="ts">
defineProps<{
  title: string
  text: string
  icon?: string
}>()
</script>

<template>
  <div class="onboarding-step">
    <div v-if="icon" class="onboarding-step__icon">{{ icon }}</div>
    <h2 class="onboarding-step__title">{{ title }}</h2>
    <p class="onboarding-step__text">{{ text }}</p>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.onboarding-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1.5rem;
  max-width: 400px;
  margin: 0 auto;

  &__icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  &__title {
    font-size: 1.5rem;
    color: #d4a843;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  &__text {
    font-size: 1rem;
    color: #f5f0e8;
    line-height: 1.6;
  }
}
</style>
