# This will override the value of apiSecret
NUXT_API_SECRET=api_secret_token
```
::

These variables are exposed to the rest of your application using the [`useRuntimeConfig()`](https://nuxt.com/docs/4.x/api/composables/use-runtime-config) composable.

```vue [app/pages/index.vue]
<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
</script>
```

:read-more{to="https://nuxt.com/docs/4.x/guide/going-further/runtime-config"}

## App Configuration

The `app.config.ts` file, located in the source directory (by default `app/`), is used to expose public variables that can be determined at build time. Contrary to the `runtimeConfig` option, these cannot be overridden using environment variables.

A minimal configuration file exports the `defineAppConfig` function containing an object with your configuration. The `defineAppConfig` helper is globally available without import.

```ts [app/app.config.ts]
export default defineAppConfig({
  title: 'Hello Nuxt',
  theme: {
    dark: true,
    colors: {
      primary: '#ff0000',
    },
  },
})
```

These variables are exposed to the rest of your application using the [`useAppConfig`](https://nuxt.com/docs/4.x/api/composables/use-app-config) composable.

```vue [app/pages/index.vue]
<script setup lang="ts">
const appConfig = useAppConfig()
</script>
```

:read-more{to="https://nuxt.com/docs/4.x/directory-structure/app/app-config"}

## `runtimeConfig` vs. `app.config`

As stated above, `runtimeConfig` and `app.config` are both used to expose variables to the rest of your application. To determine whether you should use one or the other, here are some guidelines:

- `runtimeConfig`: Private or public tokens that need to be specified after build using environment variables.
- `app.config`: Public tokens that are determined at build time, website configuration such as theme variant, title and any project config that are not sensitive.

| Feature                   | `runtimeConfig` | `app.config` |
| ------------------------- | --------------- | ------------ |
| Client-side               | Hydrated        | Bundled      |
| Environment variables     | ✅ Yes           | ❌ No         |
| Reactive                  | ✅ Yes           | ✅ Yes        |
| Types support             | ✅ Partial       | ✅ Yes        |
| Configuration per request | ❌ No            | ✅ Yes        |
| Hot module replacement    | ❌ No            | ✅ Yes        |
| Non-primitive JS types    | ❌ No            | ✅ Yes        |

## External Configuration Files

Nuxt uses [`nuxt.config.ts`](https://nuxt.com/docs/4.x/directory-structure/nuxt-config) file as the single source of truth for configurations and skips reading external configuration files. During the course of building your project, you may have a need to configure those. The following table highlights common configurations and, where applicable, how they can be configured with Nuxt.

| Name                                                          | Config File             | How To Configure                                                                          |
| ------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------- |
| [Nitro](https://nitro.build){rel="&#x22;nofollow&#x22;"}      | ~~`nitro.config.ts`~~   | Use [`nitro`](https://nuxt.com/docs/4.x/api/nuxt-config#nitro) key in `nuxt.config`       |
| [PostCSS](https://postcss.org){rel="&#x22;nofollow&#x22;"}    | ~~`postcss.config.js`~~ | Use [`postcss`](https://nuxt.com/docs/4.x/api/nuxt-config#postcss) key in `nuxt.config`   |
| [Vite](https://vite.dev){rel="&#x22;nofollow&#x22;"}          | ~~`vite.config.ts`~~    | Use [`vite`](https://nuxt.com/docs/4.x/api/nuxt-config#vite) key in `nuxt.config`         |
| [webpack](https://webpack.js.org){rel="&#x22;nofollow&#x22;"} | ~~`webpack.config.ts`~~ | Use [`webpack`](https://nuxt.com/docs/4.x/api/nuxt-config#webpack-1) key in `nuxt.config` |

Here is a list of other common config files:

| Name                                                                     | Config File           | How To Configure                                                                                          |
| ------------------------------------------------------------------------ | --------------------- | --------------------------------------------------------------------------------------------------------- |
| [TypeScript](https://www.typescriptlang.org){rel="&#x22;nofollow&#x22;"} | `tsconfig.json`       | [More Info](https://nuxt.com/docs/4.x/directory-structure/tsconfig)                                       |
| [ESLint](https://eslint.org){rel="&#x22;nofollow&#x22;"}                 | `eslint.config.js`    | [More Info](https://eslint.org/docs/latest/use/configure/configuration-files){rel="&#x22;nofollow&#x22;"} |
| [Prettier](https://prettier.io){rel="&#x22;nofollow&#x22;"}              | `prettier.config.js`  | [More Info](https://prettier.io/docs/configuration.html){rel="&#x22;nofollow&#x22;"}                      |
| [Stylelint](https://stylelint.io){rel="&#x22;nofollow&#x22;"}            | `stylelint.config.js` | [More Info](https://stylelint.io/user-guide/configure/){rel="&#x22;nofollow&#x22;"}                       |
| [TailwindCSS](https://tailwindcss.com){rel="&#x22;nofollow&#x22;"}       | `tailwind.config.js`  | [More Info](https://tailwindcss.nuxtjs.org/tailwindcss/configuration/){rel="&#x22;nofollow&#x22;"}        |
| [Vitest](https://vitest.dev){rel="&#x22;nofollow&#x22;"}                 | `vitest.config.ts`    | [More Info](https://vitest.dev/config/){rel="&#x22;nofollow&#x22;"}                                       |

## Vue Configuration

### With Vite

If you need to pass options to `@vitejs/plugin-vue` or `@vitejs/plugin-vue-jsx`, you can do this in your `nuxt.config` file.

- `vite.vue` for `@vitejs/plugin-vue`. Check [available options](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue){rel="&#x22;nofollow&#x22;"}.
- `vite.vueJsx` for `@vitejs/plugin-vue-jsx`. Check [available options](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx){rel="&#x22;nofollow&#x22;"}.

```ts [nuxt.config.ts] twoslash
export default defineNuxtConfig({
  vite: {
    vue: {
      customElement: true,
    },
    vueJsx: {
      mergeProps: true,
    },
  },
})
```

:read-more{to="https://nuxt.com/docs/4.x/api/configuration/nuxt-config#vue"}

### With webpack

If you use webpack and need to configure `vue-loader`, you can do this using `webpack.loaders.vue` key inside your `nuxt.config` file. The available options are [defined here](https://github.com/vuejs/vue-loader/blob/main/src/index.ts#L32-L62){rel="&#x22;nofollow&#x22;"}.

```ts [nuxt.config.ts] twoslash
export default defineNuxtConfig({
  webpack: {
    loaders: {
      vue: {
        hotReload: true,
      },
    },
  },
})
```

:read-more{to="https://nuxt.com/docs/4.x/api/configuration/nuxt-config#loaders"}

### Enabling Experimental Vue Features

You may need to enable experimental features in Vue, such as `propsDestructure`. Nuxt provides an easy way to do that in `nuxt.config.ts`, no matter which builder you are using:

```ts [nuxt.config.ts] twoslash
export default defineNuxtConfig({
  vue: {
    propsDestructure: true,
  },
})
```

#### experimental `reactivityTransform` migration from Vue 3.4 and Nuxt 3.9

Since Nuxt 3.9 and Vue 3.4, `reactivityTransform` has been moved from Vue to Vue Macros which has a [Nuxt integration](https://vue-macros.dev/guide/nuxt-integration.html){rel="&#x22;nofollow&#x22;"}.

:read-more{to="https://nuxt.com/docs/4.x/api/configuration/nuxt-config#vue-1"}
