### Hydrate on Visible {#hydrate-on-visible}

Hydrate when element(s) become visible via `IntersectionObserver`.

```js
import { defineAsyncComponent, hydrateOnVisible } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnVisible()
})
```

Can optionally pass in an options object value for the observer:

```js
hydrateOnVisible({ rootMargin: '100px' })
```
