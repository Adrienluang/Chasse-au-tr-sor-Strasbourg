### Server optimization with `server`

During SSR, it might be more performant to avoid loading data that isn't critical for the initial render. This can be achieved by setting the `server` option to `false`. That will completely skip the loader during SSR.

```ts{3} twoslash
import { defineBasicLoader } from 'vue-router/experimental'
interface Book {
  title: string
  isbn: string
  description: string
}
function fetchRelatedBooks(id: string | string[]): Promise<Book[]> {
  return {} as any
}
// ---cut---
export const useRelatedBooks = defineBasicLoader(
  (to) => fetchRelatedBooks(to.params.id),
  { server: false }
)
```

You can read more about server side rendering in the [SSR](./ssr.md) section.

## Connecting a loader to a page

The router needs to know what loaders should be ran with which page. This is achieved in two ways:

* **Automatically**: when a loader is exported from a page component that is lazy loaded, the loader will be automatically connected to the page

  ::: code-group

  ```ts{8} [router.ts]
  import { createRouter, createWebHistory } from 'vue-router'

  export const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/settings',
        component: () => import('./settings.vue'),
      },
    ],
  })
  ```

  ```vue{3-5} [settings.vue]
  <script lang="ts">
  import { getSettings } from './api'
  export const useSettings = defineBasicLoader('/settings', async (to) =>
    getSettings()
  )
  </script>

  <script lang="ts" setup>
  const { data: settings } = useSettings()
  </script>
  <!-- ...rest of the component -->
  ```

  :::

* **Manually**: by passing the defined loader into the `meta.loaders` property:

  ::: code-group

  ```ts{2,10-12} [router.ts]
  import { createRouter, createWebHistory } from 'vue-router'
  import Settings, { useSettings } from './settings.vue'

  export const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/settings',
        component: Settings,
        meta: {
          loaders: [useSettings],
        },
      }
    ],
  })
  ```

  ```vue{3-5} [settings.vue]
  <script lang="ts">
  import { getSettings } from './api'
  export const useSettings = defineBasicLoader('/settings', async (to) =>
    getSettings()
  )
  </script>

  <script lang="ts" setup>
  const { data: settings } = useSettings()
  </script>
  <!-- ...rest of the component -->
  ```
