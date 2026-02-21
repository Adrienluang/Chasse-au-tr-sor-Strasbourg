<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'checkpoint-guard'],
})

const route = useRoute()
const { state } = useProgression()

const id = computed(() => Number(route.params.id))
const content = computed(() => getCheckpointContent(id.value, state.value.locale))
</script>

<template>
  <div class="checkpoint-page">
    <template v-if="content">
      <NarrativeCard
        :location="content.location"
        :date="content.date"
        :narrator="content.narrator"
        :text="content.text"
      />
    </template>
    <button class="checkpoint-page__back" @click="navigateTo('/map')">
      Retour à la carte
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.checkpoint-page {
  min-height: 100vh;
  background-color: $color-background;
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;

  &__back {
    display: block;
    width: 100%;
    padding: $spacing-md;
    background-color: $color-primary;
    color: $color-background;
    border: none;
    border-radius: $radius-md;
    font-family: $font-family-ui;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    transition: opacity $transition-default;

    &:hover {
      opacity: 0.85;
    }
  }
}
</style>
