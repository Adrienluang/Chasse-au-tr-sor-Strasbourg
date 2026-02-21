<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'parcours-actif'],
})

const { resetProgression } = useProgression()
const showResetModal = ref(false)

function onConfirmReset() {
  resetProgression()
  navigateTo('/onboarding')
}
</script>

<template>
  <div class="fin-page">
    <div class="fin-page__card">
      <h1 class="fin-page__title">Félicitations !</h1>
      <p class="fin-page__subtitle">Vous avez terminé le parcours</p>

      <div class="fin-page__epilogue">
        <NarratorBadge narrator="elias" />
        <p class="fin-page__text">
          À celui ou celle qui lira ces lignes,
        </p>
        <p class="fin-page__text">
          Ceci est tout ce que j'ai réussi à sauver du carnet d'Armand K. Le reste n'est plus que cendres et lambeaux d'encre délavée par le temps. J'ai tenté de reconstituer ce qui pouvait l'être, de redonner un ordre à ces pensées fracturées.
        </p>
        <p class="fin-page__text">
          Je ne sais pas encore si ce que j'ai découvert est une malédiction ou une révélation. Armand K. semblait convaincu que Strasbourg cachait un secret trop ancien pour être compris et trop puissant pour être dévoilé. Et pourtant, tout mène à un même point — la cathédrale.
        </p>
        <p class="fin-page__text">
          Ses murs sont plus qu'un monument, plus qu'un témoin du temps. Ils renferment un savoir qui a survécu aux âges, un savoir qui ne demande qu'à être retrouvé.
        </p>
        <p class="fin-page__text fin-page__text--signature">
          — Elias Morgenstern
        </p>
      </div>

      <button class="fin-page__btn" @click="showResetModal = true">
        Recommencer le parcours
      </button>
    </div>

    <ResetConfirmModal
      v-model="showResetModal"
      @confirm="onConfirmReset"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.fin-page {
  min-height: 100vh;
  background-color: $color-background;
  padding: $spacing-lg;
  display: flex;
  align-items: center;
  justify-content: center;

  &__card {
    background-color: $color-surface;
    border-radius: $radius-lg;
    padding: $spacing-xl;
    max-width: 500px;
    width: 100%;
    text-align: center;
  }

  &__title {
    font-family: $font-family-body;
    font-size: 2rem;
    color: $color-primary;
    margin-bottom: $spacing-xs;
  }

  &__subtitle {
    font-family: $font-family-ui;
    font-size: 1rem;
    color: $color-text-muted;
    margin-bottom: $spacing-xl;
  }

  &__epilogue {
    text-align: left;
    margin-bottom: $spacing-xl;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    align-items: flex-start;
  }

  &__text {
    font-family: $font-family-body;
    font-size: 0.95rem;
    line-height: 1.7;
    color: $color-text;

    &--signature {
      color: $color-primary;
      font-style: italic;
      margin-top: $spacing-sm;
    }
  }

  &__btn {
    width: 100%;
    padding: $spacing-md;
    background-color: $color-primary;
    color: $color-background;
    border: none;
    border-radius: $radius-md;
    font-family: $font-family-ui;
    font-size: 1rem;
    font-weight: 600;
    transition: opacity $transition-default;

    &:hover {
      opacity: 0.85;
    }
  }
}
</style>
