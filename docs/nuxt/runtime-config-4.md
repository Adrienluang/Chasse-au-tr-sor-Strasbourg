# Runtime Config

If you wish to reference environment variables within your Nuxt 3 app, you will need to use runtime config.

When referencing these variables within your components, you will have to use the [`useRuntimeConfig`](https://nuxt.com/docs/4.x/api/composables/use-runtime-config) composable in your setup method (or Nuxt plugin).

In the `server/` portion of your app, you can use [`useRuntimeConfig`](https://nuxt.com/docs/4.x/api/composables/use-runtime-config) without any import.

:read-more{to="https://nuxt.com/docs/4.x/guide/going-further/runtime-config"}

## Migration

1. Add any environment variables that you use in your app to the `runtimeConfig` property of the `nuxt.config` file.
2. Migrate `process.env` to [`useRuntimeConfig`](https://nuxt.com/docs/4.x/api/composables/use-runtime-config) throughout the Vue part of your app.

::code-group
```ts [nuxt.config.ts]
export default defineNuxtConfig({
  runtimeConfig: {
    // Private config that is only available on the server
    apiSecret: '123',
    // Config within public will be also exposed to the client
    public: {
      apiBase: '/api',
    },
  },
})
```

```vue [app/pages/index.vue]
<script setup lang="ts">
const config = useRuntimeConfig()

// instead of process.env you will now access config.public.apiBase
console.log(config.public.apiBase)
</script>
```

```ts [server/api/hello.ts]
export default defineEventhandler((event) => {
  const config = useRuntimeConfig(event)
  // In server, you can now access config.apiSecret, in addition to config.public
  console.log(config.apiSecret)
  console.log(config.public.apiBase)
})
```

```ini [.env]
