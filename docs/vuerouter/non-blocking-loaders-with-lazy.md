### Non blocking loaders with `lazy`

By default, loaders are *non-lazy*, meaning they will block the navigation until the data is fetched. But this behavior can be changed by setting the `lazy` option to `true`.

```vue{10,16} twoslash
<script lang="ts">
// ---cut-start---
import 'vue-router/auto-routes'
import { defineBasicLoader } from 'vue-router/experimental'
// ---cut-end---
import { getUserById } from '../api'

export const useUserData = defineBasicLoader(
  '/users/[id]',
  async (to) => {
    const user = await getUserById(to.params.id)
    return user
  },
  { lazy: true } // 👈  marked as lazy
)
</script>

<script setup>
// Differently from the example above, `user.value` can and will be initially `undefined`
const { data: user, isLoading, error } = useUserData()
//            ^?
</script>

<!-- ... -->
```

This patterns is useful to avoid blocking the navigation while *non critical data* is being fetched. It will display the page earlier while lazy loaders are still loading and you are able to display loader indicators thanks to the `isLoading` property.

Since lazy loaders do not block the navigation, any thrown error will not abort the navigation nor appear in the `router.onError` handler. Instead, the error will be available in the `error` property.

Note this still allows for having different behavior during SSR and client side navigation, e.g.: if we want to wait for the loader during SSR but not during client side navigation:

```ts{6-7}
export const useUserData = defineBasicLoader(
  async (to) => {
    // ...
  },
  {
    lazy: !import.meta.env.SSR, // Vite specific
  }
)
```

You can even pass a function to `lazy` to determine if the loader should be lazy or not based on each load/navigation:

```ts{6-7}
export const useSearchResults = defineBasicLoader(
  async (to) => {
    // ...
  },
  {
    // lazy if we are on staying on the same route
    lazy: (to, from) => to.name === from.name,
  }
)
```

This is really useful when you can display the old data while fetching the new one and some of the parts of the page require the route to be updated like search results and pagination buttons. By using a lazy loader only when the route changes, the pagination can be updated immediately while the search results are being fetched, allowing the user to click multiple times on the pagination buttons without waiting for the search results to be fetched.
