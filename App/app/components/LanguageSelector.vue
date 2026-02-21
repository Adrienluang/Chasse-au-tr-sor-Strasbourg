<script setup lang="ts">
const { state, setLocale } = useProgression()
</script>

<template>
  <div class="language-selector">
    <button
      class="language-selector__btn"
      :class="{ 'language-selector__btn--active': state.locale === 'fr' }"
      @click="setLocale('fr')"
    >
      🇫🇷 FR
    </button>
    <button
      class="language-selector__btn"
      :class="{ 'language-selector__btn--active': state.locale === 'en' }"
      @click="setLocale('en')"
    >
      🇬🇧 EN
    </button>
  </div>
</template>

<style scoped lang="scss">
.language-selector {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin: 1rem 0;

  &__btn {
    padding: 0.5rem 1.25rem;
    border: 2px solid #d4a843;
    border-radius: 8px;
    background: transparent;
    color: #f5f0e8;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;

    &--active {
      background: #d4a843;
      color: #1a1a2e;
    }
  }
}
</style>
