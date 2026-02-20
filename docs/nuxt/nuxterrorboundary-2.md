# <NuxtErrorBoundary>

::tip
The `<NuxtErrorBoundary>` uses Vue's [`onErrorCaptured`](https://vuejs.org/api/composition-api-lifecycle#onerrorcaptured){rel=""nofollow""} hook under the hood.
::

## Events

- `@error`: Event emitted when the default slot of the component throws an error.
  ```vue
  <template>
    <NuxtErrorBoundary @error="logSomeError">
      <!-- ... -->
    </NuxtErrorBoundary>
  </template>
  ```

## Slots

- `#error`: Specify a fallback content to display in case of error.
  ```vue
  <template>
    <NuxtErrorBoundary>
      <!-- ... -->
      <template #error="{ error, clearError }">
        <p>An error occurred: {{ error }}</p>

        <button @click="clearError">
          Clear error
        </button>
      </template>
    </NuxtErrorBoundary>
  </template>
  ```

:read-more{to="https://nuxt.com/docs/3.x/getting-started/error-handling"}

## Examples

### Accessing `error` and `clearError` in script

You can access `error` and `clearError` properties within the component's script as below:

```vue
<template>
  <NuxtErrorBoundary ref="errorBoundary">
    <!-- ... -->
  </NuxtErrorBoundary>
</template>

<script setup lang="ts">
const errorBoundary = useTemplateRef('errorBoundary')

// errorBoundary.value?.error
// errorBoundary.value?.clearError()
</script>
```
