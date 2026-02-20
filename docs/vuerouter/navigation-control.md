### Navigation control

Since loaders happen within the context of a navigation, you can control the navigation by calling `reroute()`. This is similar to returning a value in a navigation guard. It throws internally, so execution stops immediately.

```ts{1,8,9}
import { reroute } from 'vue-router/experimental'

const useDashboardStats = defineBasicLoader('/admin', async (to) => {
  try {
    return await getDashboardStats()
  } catch (err) {
    if (err.code === 401) {
      // same as returning '/login' in a navigation guard
      reroute('/login')
    }
    throw err // unexpected error
  }
})
```

::: tip

Note that [lazy loaders](#lazy-loaders) cannot control the navigation since they do not block it.

:::

Read more in the [Navigation Aware](./navigation-aware.md) section.
