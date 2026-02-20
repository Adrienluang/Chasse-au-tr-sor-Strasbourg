### Vite PWA Virtual Module

If the cause of the error is the virtual module of this plugin, you can work around this problem following [SSR/SSG: Prompt for update](/guide/prompt-for-update#ssr-ssg) or [SSR/SSG: Automatic reload](/guide/auto-update#ssr-ssg) entries.

If you are using `autoUpdate` strategy and a `router` with `isReady` support (that is, the router allow register a callback to be called when the current component route finish loading), you can delay the service worker registration to be on the router callback.

For example, using `vue-router`, you can register the service worker for `autoUpdate` strategy using this code:

```ts
import type { Router } from 'vue-router'

export function registerPWA(router: Router) {
  router.isReady().then(async () => {
    const { registerSW } = await import('virtual:pwa-register')
    registerSW({ immediate: true })
  })
}
```

You can see an example for `autoUpdate` strategy on a `SSR / SSG` environment ([vite-ssg](https://github.com/antfu/vite-ssg)) on [Vitesse Template](https://github.com/antfu/vitesse/blob/main/src/modules/pwa.ts).

If you are using `prompt` strategy, you will need to load the `ReloadPrompt` component using dynamic import with async fashion, for example, using `vue 3`:

```vue
// src/App.vue
<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const ClientReloadPrompt = typeof window !== 'undefined'
  ? defineAsyncComponent(() => import('./ReloadPrompt.vue'))
  : null
</script>

<template>
  <router-view />
  <template v-if="ClientReloadPrompt">
    <ClientReloadPrompt />
  </template>
</template>
```

or using `svelte`:

```html
<!-- App.svelte -->
<script>
  import { onMount } from 'svelte';
  let ClientReloadPrompt;
  onMount(async () => {
    typeof window !== 'undefined' && (ClientReloadPrompt = await import('$lib/ReloadPrompt.svelte')).default)
  })
</script>
...
{#if ClientReloadPrompt}
<svelte:component this={ClientReloadPrompt}/>
{/if}
```

You can check your `SSR / SSG` environment to see if it provides some way to register components only on client side. Following with `vite-ssg` on `Vitesse Template`, it provides `ClientOnly` functional component, that will prevent registering components on server side, and so you can use the original code but enclosing `ReloadPrompt` component with it:

```vue
// src/App.vue
<template>
  ...
  <ClientOnly>
    <ReloadPrompt />
  </ClientOnly>
</template>
```
