<script setup lang="ts">
const { state } = useProgression()

if (state.value.onboardingDone && state.value.rgpdAccepted) {
  navigateTo('/map', { replace: true })
} else {
  navigateTo('/onboarding', { replace: true })
}
</script>

<template>
  <div />
</template>
