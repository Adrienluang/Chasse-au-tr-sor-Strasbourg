<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

const { setRgpdAccepted } = useProgression()

const accepted = ref(false)

function confirm() {
  if (!accepted.value) return
  setRgpdAccepted()
  navigateTo('/map')
}
</script>

<template>
  <div class="rgpd">
    <div class="rgpd__card">
      <h1 class="rgpd__title">🔒 Vos données</h1>

      <div class="rgpd__content">
        <p>
          Cette application stocke votre progression <strong>uniquement sur votre appareil</strong>
          (localStorage). Aucune donnée n'est envoyée à un serveur.
        </p>
        <p>Les informations stockées localement :</p>
        <ul>
          <li>Votre progression dans le parcours</li>
          <li>Votre préférence de langue</li>
          <li>Un identifiant anonyme de session</li>
        </ul>
        <p>
          Vous pouvez supprimer ces données à tout moment en vidant le stockage local de votre navigateur.
        </p>
      </div>

      <label class="rgpd__checkbox">
        <input v-model="accepted" type="checkbox">
        <span>J'ai lu et j'accepte les conditions de stockage local</span>
      </label>

      <button
        class="rgpd__btn"
        :disabled="!accepted"
        @click="confirm"
      >
        Accepter et commencer
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rgpd {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #1a1a2e;
  padding: 2rem 1rem;

  &__card {
    max-width: 450px;
    width: 100%;
    background: #16213e;
    border-radius: 12px;
    padding: 2rem;
  }

  &__title {
    color: #d4a843;
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  &__content {
    color: #f5f0e8;
    line-height: 1.6;
    margin-bottom: 1.5rem;

    p {
      margin-bottom: 0.75rem;
    }

    ul {
      padding-left: 1.5rem;
      margin-bottom: 0.75rem;
    }

    strong {
      color: #d4a843;
    }
  }

  &__checkbox {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    color: #f5f0e8;
    margin-bottom: 1.5rem;
    cursor: pointer;

    input {
      margin-top: 0.25rem;
      accent-color: #d4a843;
    }
  }

  &__btn {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    background: #d4a843;
    color: #1a1a2e;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover:not(:disabled) {
      opacity: 0.9;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}
</style>
