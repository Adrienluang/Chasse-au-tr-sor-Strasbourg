<script setup lang="ts">
const { state, isFinished } = useProgression()

if (state.value.onboardingDone && state.value.rgpdAccepted) {
  if (isFinished.value) {
    navigateTo('/fin', { replace: true })
  } else {
    navigateTo('/map', { replace: true })
  }
} else {
  navigateTo('/onboarding', { replace: true })
}
</script>

<template>
  <div />
</template>
