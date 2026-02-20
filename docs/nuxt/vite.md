# Vite

::warning
When using `vite`, [nitro](https://nuxt.com/docs/4.x/bridge/nitro) must have been configured.
::

## Remove Modules

- Remove `nuxt-vite`: Bridge enables same functionality

## Update Config

```ts [nuxt.config.ts]
import { defineNuxtConfig } from '@nuxt/bridge'

export default defineNuxtConfig({
  bridge: {
    vite: true,
    nitro: true,
  },
})
```

## Configuration

```ts [nuxt.config.ts]
import { defineNuxtConfig } from '@nuxt/bridge'

export default defineNuxtConfig({
  vite: {
    // Config for Vite
  },
})
```
