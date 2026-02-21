<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
}>()

function close() {
  emit('update:modelValue', false)
}

function confirm() {
  emit('confirm')
  close()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="reset-modal__overlay" @click.self="close">
        <div class="reset-modal">
          <h2 class="reset-modal__title">Recommencer le parcours ?</h2>
          <p class="reset-modal__text">
            Toute votre progression sera effacée. Cette action est irréversible.
          </p>
          <div class="reset-modal__actions">
            <button class="reset-modal__btn reset-modal__btn--cancel" @click="close">
              Annuler
            </button>
            <button class="reset-modal__btn reset-modal__btn--confirm" @click="confirm">
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.reset-modal__overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-lg;
}

.reset-modal {
  background-color: $color-surface;
  border-radius: $radius-lg;
  padding: $spacing-xl;
  max-width: 400px;
  width: 100%;

  &__title {
    font-family: $font-family-body;
    font-size: 1.25rem;
    color: $color-primary;
    margin-bottom: $spacing-md;
  }

  &__text {
    font-family: $font-family-ui;
    font-size: 0.95rem;
    color: $color-text-muted;
    line-height: 1.5;
    margin-bottom: $spacing-lg;
  }

  &__actions {
    display: flex;
    gap: $spacing-sm;
    justify-content: flex-end;
  }

  &__btn {
    padding: $spacing-sm $spacing-lg;
    border: none;
    border-radius: $radius-md;
    font-family: $font-family-ui;
    font-size: 0.9rem;
    font-weight: 600;
    transition: opacity $transition-default;

    &--cancel {
      background-color: transparent;
      color: $color-text-muted;
      border: 1px solid $color-text-muted;
    }

    &--confirm {
      background-color: $color-accent;
      color: white;
    }

    &:hover {
      opacity: 0.85;
    }
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
