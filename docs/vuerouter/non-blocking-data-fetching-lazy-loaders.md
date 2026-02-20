### Non blocking data fetching (Lazy Loaders)

Also known as [lazy async data in Nuxt](https://v3.nuxtjs.org/api/composables/use-async-data), loaders can be marked as lazy to **not block the navigation**.

```vue{10,16-17} twoslash
<script lang="ts">
// ---cut-start---
import 'vue-router/auto-routes'
import { defineBasicLoader as defineLoader } from 'vue-router/experimental'
// ---cut-end---
import { getUserById } from '../api'

export const useUserData = defineLoader(
  '/users/[id]',
  async (route) => {
    const user = await getUserById(route.params.id)
    return user
  },
  { lazy: true } // 👈  marked as lazy
)
</script>

<script setup>
// Differently from the example above, `user.value` can and will be initially `undefined`
const { data: user, isLoading, error } = useUserData()
//            ^?
//            👆 hover or tap
</script>
```

This patterns is useful to avoid blocking the navigation while *non critical data* is being fetched. It will display the page earlier while some of the parts of it are still loading and you are able to display loader indicators thanks to the `isLoading` property.

Note this still allows for having different behavior during SSR and client side navigation, e.g.: if we want to wait for the loader during SSR but not during client side navigation:

```ts{6-7}
export const useUserData = defineLoader(
  async (route) => {
    // ...
  },
  {
    lazy: !import.env.SSR, // Vite
    lazy: process.client, // NuxtJS
  }
)
```

Existing questions:

* [~~Should it be possible to await all pending loaders with `await allPendingLoaders()`? Is it useful for SSR? Otherwise we could always ignore lazy loaders in SSR. Do we need both? Do we need to selectively await some of them?~~](https://github.com/vuejs/rfcs/discussions/460#discussioncomment-3532011)
* Should we be able to transform a loader into a lazy version of it: `const useUserDataLazy = asLazyLoader(useUserData)`
