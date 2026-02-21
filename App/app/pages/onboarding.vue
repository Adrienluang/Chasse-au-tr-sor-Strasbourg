<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

const { setOnboardingDone } = useProgression()

const currentStep = ref(0)

const steps = [
  {
    icon: '📜',
    title: 'Le journal d\'Armand K.',
    text: 'Strasbourg, 1871. Un journal intime refait surface après des décennies d\'oubli. Ses pages jaunies renferment un secret que personne n\'a encore percé…',
  },
  {
    icon: '🏰',
    title: 'Suivez les traces',
    text: 'Parcourez les rues de Strasbourg sur les pas d\'Armand. Chaque lieu cache un fragment de son histoire, gravé dans la pierre même de la ville.',
  },
  {
    icon: '📸',
    title: 'Comment ça marche',
    text: 'Suivez l\'itinéraire sur la carte. À chaque étape, trouvez l\'élément caché et prenez-le en photo pour débloquer la suite du récit.',
  },
]

const totalSteps = steps.length

function next() {
  if (currentStep.value < totalSteps - 1) {
    currentStep.value++
  }
}

function prev() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function finish() {
  setOnboardingDone()
  navigateTo('/rgpd')
}
</script>

<template>
  <div class="onboarding">
    <LanguageSelector v-if="currentStep === 0" />

    <Transition name="fade" mode="out-in">
      <OnboardingStep
        :key="currentStep"
        :icon="steps[currentStep].icon"
        :title="steps[currentStep].title"
        :text="steps[currentStep].text"
      />
    </Transition>

    <div class="onboarding__dots">
      <span
        v-for="i in totalSteps"
        :key="i"
        class="onboarding__dot"
        :class="{ 'onboarding__dot--active': i - 1 === currentStep }"
      />
    </div>

    <div class="onboarding__actions">
      <button
        v-if="currentStep > 0"
        class="onboarding__btn onboarding__btn--secondary"
        @click="prev"
      >
        Retour
      </button>
      <button
        v-if="currentStep < totalSteps - 1"
        class="onboarding__btn"
        @click="next"
      >
        Suivant
      </button>
      <button
        v-else
        class="onboarding__btn"
        @click="finish"
      >
        Commencer
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.onboarding {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #1a1a2e;
  padding: 2rem 1rem;

  &__dots {
    display: flex;
    gap: 0.5rem;
    margin: 1.5rem 0;
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #555;
    transition: background 0.3s;

    &--active {
      background: #d4a843;
    }
  }

  &__actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  &__btn {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 8px;
    background: #d4a843;
    color: #1a1a2e;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.9;
    }

    &--secondary {
      background: transparent;
      border: 2px solid #d4a843;
      color: #d4a843;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
