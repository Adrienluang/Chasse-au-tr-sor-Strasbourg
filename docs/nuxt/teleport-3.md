# <Teleport>

::warning
The `to` target of [`<Teleport>`](https://vuejs.org/guide/built-ins/teleport){rel=""nofollow""} expects a CSS selector string or an actual DOM node. Nuxt currently has SSR support for teleports to `#teleports` only, with client-side support for other targets using a `<ClientOnly>` wrapper.
::

## Body Teleport

```vue
<template>
  <button @click="open = true">
    Open Modal
  </button>
  <Teleport to="#teleports">
    <div
      v-if="open"
      class="modal"
    >
      <p>Hello from the modal!</p>
      <button @click="open = false">
        Close
      </button>
    </div>
  </Teleport>
</template>
```

## Client-side Teleport

```vue
<template>
  <ClientOnly>
    <Teleport to="#some-selector">
      <!-- content -->
    </Teleport>
  </ClientOnly>
</template>
```

:link-example{to="https://nuxt.com/docs/3.x/examples/advanced/teleport"}
