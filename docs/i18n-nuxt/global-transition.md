### Global transition

If you would like to transition the entire Nuxt app, you can use the [`transition` of `NuxtPage`](https://nuxt.com/docs/getting-started/transitions#transition-with-nuxtpage){rel="&#x22;nofollow&#x22;"} to control it as follows:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  i18n: {
    // ... your other options
    skipSettingLocaleOnNavigate: true
  }
}
```

```vue [pages/app.vue]
<script setup lang="ts">
const { finalizePendingLocaleChange } = useI18n()

const onBeforeEnter = async () => {
  await finalizePendingLocaleChange()
}
</script>

<template>
  <NuxtLayout>
    <NuxtPage
      :transition="{
        name: 'my',
        mode: 'out-in',
        onBeforeEnter
      }"
    />
  </NuxtLayout>
</template>

<style>
.my-enter-active,
.my-leave-active {
  transition: opacity 0.3s;
}
.my-enter,
.my-leave-active {
  opacity: 0;
}
</style>
```

Optional, wait for locale before scrolling for a smoother transition with [Router Options](https://nuxt.com/docs/guide/directory-structure/pages#router-options){rel="&#x22;nofollow&#x22;"}:

```ts [app/router.options.ts]
import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  async scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp()

    // make sure the route has changed.
    if (nuxtApp.$i18n && to.name !== from.name) {
      // `$i18n` is injected in the `setup` of the nuxtjs/i18n module.
      // `scrollBehavior` is guarded against being called even when it is not completed
      await nuxtApp.$i18n.waitForPendingLocaleChange()
    }

    return savedPosition || { top: 0 }
  }
}
```
