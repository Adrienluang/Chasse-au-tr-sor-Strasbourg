<script setup lang="ts">
defineProps<{
  location: string
  date: string
  narrator: 'armand' | 'elias'
  text: string
  imageUrl?: string
}>()
</script>

<template>
  <article class="narrative-card">
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="location"
      class="narrative-card__image"
      @error="($event.target as HTMLImageElement).style.display = 'none'"
    />
    <div class="narrative-card__header">
      <h1 class="narrative-card__location">{{ location }}</h1>
      <p class="narrative-card__date">{{ date }}</p>
      <slot name="badge">
        <NarratorBadge :narrator="narrator" />
      </slot>
    </div>
    <div class="narrative-card__body">
      <p
        v-for="(paragraph, i) in text.split('\n\n')"
        :key="i"
        class="narrative-card__paragraph"
      >
        {{ paragraph }}
      </p>
    </div>
  </article>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.narrative-card {
  background-color: $color-surface;
  border-radius: $radius-lg;
  overflow: hidden;

  &__image {
    width: 100%;
    max-height: 240px;
    object-fit: cover;
  }

  &__header {
    padding: $spacing-lg $spacing-lg $spacing-md;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    align-items: flex-start;
  }

  &__location {
    font-family: $font-family-body;
    font-size: 1.5rem;
    color: $color-primary;
    line-height: 1.3;
  }

  &__date {
    font-family: $font-family-ui;
    font-size: 0.85rem;
    color: $color-text-muted;
  }

  &__body {
    padding: 0 $spacing-lg $spacing-lg;
  }

  &__paragraph {
    font-family: $font-family-body;
    font-size: 1rem;
    line-height: 1.8;
    color: $color-text;
    margin-bottom: $spacing-md;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
