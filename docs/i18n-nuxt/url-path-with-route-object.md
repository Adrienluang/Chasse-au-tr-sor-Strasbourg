### URL path with Route object

You can localize advanced URL paths using `useLocaleRoute`. This is useful if you would to control internal links programmatically.

`useLocaleRoute` is a composable function that returns a `Route` object for a given page.

It works like `useLocalePath` but returns a route resolved by Vue Router rather than a full route path. This can be useful as the path returned from `useLocalePath` may not carry all information from the provided input (for example, route params that the page doesn't specify).

```vue
<script setup>
const localeRoute = useLocaleRoute()
function onClick() {
  const route = localeRoute({ name: 'user-profile', query: { foo: '1' } })
  if (route) {
    return navigateTo(route.fullPath)
  }
}
</script>

<template>
  <button @click="onClick">Show profile</button>
</template>
```


# Vue I18n Configuration

## Vue I18n Configuration

While some options are shared between Nuxt I18n and Vue I18n, there is a range of options which are specific to Vue I18n, for example:

- `fallbackWarn`: To control fallback warnings.
- `missingWarn`: To control missing localization warnings.
- `formatter`: To provide a custom message formatting function.
- `numberFormats`: To configure custom number formatting.
- `datetimeFormats`: To configure custom date time formatting.
- ... more!

These are just a few examples of the runtime options available in Vue I18n, please check out [the documentation of Vue I18n](https://vue-i18n.intlify.dev/){rel="&#x22;nofollow&#x22;"} to explore the full range of available options.

Vue I18n specific options cannot be configured in `nuxt.config` and have no overlap with the features used by or provided by Nuxt I18n.

## Adding a Vue I18n config file

To configure the options you can create a `i18n.config.ts` file in the `<rootDir>/i18n` directory, this file should have a default export with a function returning the Vue I18n options.

Nuxt I18n provides a macro function `defineI18nConfig` to improve the types, but a plain function would suffice too:

```ts [i18n/i18n.config.ts]
export default defineI18nConfig(() => {
  return {
    // vue-i18n options
  }
})
```

The config file is resolved from `<rootDir>/i18n`, and automatically looks for and loads the config file using the default filename of `i18n.config`. This can be configured using the `vueI18n` options.

## When to use

Use `i18n.config.ts` when you need to configure Vue I18n options that involve runtime functions or data that cannot be serialized for build-time processing. This is often the case when:

- You need to dynamically load or manipulate localization data based on user input or external APIs.
- You are using custom formatting functions or other non-serializable options.
- You need to use Vue I18n options that are not supported by Nuxt I18n's build-time configuration.

## Nuxt config benefits

While it is possible to configure the same (or functionally the same) options configurable in `i18n.config.ts` (`messages` - instead of `locales`, `defaultLocale`, etc.) it is recommended to keep as much of the configuration as Nuxt I18n supports on the `i18n` key inside `nuxt.config`.

Nuxt I18n will use these options during the build step and can configure and optimize functionalities by integrating with other libraries such as `@intlify/unplugin-vue-i18n`.

The Vue I18n config file will be loaded at runtime on each request which can increase server response times, especially in high-traffic applications. This is because the server needs to parse and process the configuration for every incoming request and merge them with those set by Nuxt I18n, rather than doing it once at build time.


# Routing Strategies

::callout{icon="i-heroicons-light-bulb"}
This feature is built on top of [Nuxt's routing](https://nuxt.com/docs/getting-started/routing){rel=""nofollow""} which requires your project to have a `pages` directory for it to be enabled.
::

## Routing

**Nuxt i18n module** overrides Nuxt default routes to add locale prefixes to every URL (except in `'no_prefix'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} strategy).

Say your app supports two languages: French and English as the default language, and you have the following pages in your project:

::code-group
```bash [Directory structure]
-| pages/
---| about.vue
---| index.vue
---| posts/
-----| [id].vue
```

```js [Generated routes (simplified)]
[
  {
    path: "/",
    name: "index___en",
  },
  {
    path: "/fr",
    name: "index___fr",
  },
  {
    path: "/about",
    name: "about___en",
  },
  {
    path: "/fr/about",
    name: "about___fr",
  },
  {
    path: "/posts/:id",
    name: "posts-id___en",
  },
  {
    path: "/fr/posts/:id",
    name: "posts-id___fr",
  }
]
```
::

Note that routes for the English version do not have any prefix because it is the default language, see the routing strategies section for more details.

## Strategies

There are 4 supported strategies that affect how app's routes are generated:
