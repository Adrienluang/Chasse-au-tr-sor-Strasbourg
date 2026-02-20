### Example 3: Dynamic Routes

Say you have some dynamic routes like:

```bash [Directory structure]
-| pages/
---| blog/
-----| [date]/
-------| [slug].vue
```

Here's how you would configure these particular pages in the configuration:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  i18n: {
    customRoutes: 'config',
    pages: {
      'blog-date-slug': {
        // params need to be put back here as you would with Nuxt Dynamic Routes
        // https://nuxt.com/docs/guide/directory-structure/pages#dynamic-routes
        ja: '/blog/tech/[date]/[slug]'
        // ...
      }
    }
  }
})
```

## `definePageMeta`

You can use the `i18n` property in `definePageMeta()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} to set custom paths for each page component.

To use this feature you will need to set `customRoutes: 'meta'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} in your `nuxt.config.ts`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  i18n: {
    customRoutes: 'meta'
  }
})
```

Each page can then define its own localized paths like so:

```vue [pages/about.vue]
<script setup>
definePageMeta({
  i18n: {
    paths: {
      en: '/about-us', // -> accessible at /about-us (no prefix since it's the default locale)
      fr: '/a-propos', // -> accessible at /fr/a-propos
      es: '/sobre' // -> accessible at /es/sobre
    }
  }
})
</script>
```

To configure a custom path for a dynamic route, you need to use it in double square brackets in the paths similar to how you would do it in [Nuxt Dynamic Routes](https://nuxt.com/docs/guide/directory-structure/pages#dynamic-routes){rel="&#x22;nofollow&#x22;"}:

```vue [pages/articles/[name\\].vue]
<script setup>
definePageMeta({
  i18n: {
    paths: {
      en: '/articles/[name]',
      es: '/artículo/[name]'
    }
  }
})
</script>
```

## `defineI18nRoute`

::callout
---
color: warning
icon: i-heroicons-exclamation-triangle
title: notice
---
This method is deprecated in favor of `definePageMeta()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} described above, and will be removed in v11.
::

You can use the `defineI18nRoute()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} compiler macro to set custom paths for each page component.

```vue [pages/about.vue]
<script setup>
defineI18nRoute({
  paths: {
    en: '/about-us', // -> accessible at /about-us (no prefix since it's the default locale)
    fr: '/a-propos', // -> accessible at /fr/a-propos
    es: '/sobre' // -> accessible at /es/sobre
  }
})
</script>
```

To configure a custom path for a dynamic route, you need to use it in double square brackets in the paths similar to how you would do it in [Nuxt Dynamic Routes](https://nuxt.com/docs/guide/directory-structure/pages#dynamic-routes){rel="&#x22;nofollow&#x22;"}:

```vue [pages/articles/[name\\].vue]
<script setup>
defineI18nRoute({
  paths: {
    en: '/articles/[name]',
    es: '/artículo/[name]'
  }
})
</script>
```

::callout{icon="i-heroicons-light-bulb"}
`defineI18nRoute()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} compiler macro is tree-shaken out at build time and is not included in the dist files.
::

## Dynamic route parameters

Dealing with dynamic route parameters requires a bit more work because you need to provide parameters translations to **Nuxt i18n module**. The composable `useSetI18nParams` can be used to set translations for route parameters, this is used to set SEO tags as well as changing the routes rendered by `<SwitchLocalePathLink>`.

::callout{color="warning" icon="i-heroicons-exclamation-triangle"}
The `switchLocalePath` will return localized routes using the translated params from `setI18nParams` this can cause hydration issues for previously rendered links using `switchLocalePath`.
Use the `<SwitchLocalePathLink>` component instead, its routes are updated before sending out the rendered response.
::

An example (replace `slug` with the applicable route parameter):

```vue
<script setup>
// fetch product from API... (red mug)

const setI18nParams = useSetI18nParams()
setI18nParams({
  en: { slug: data.slugs.en }, // slug: 'red-mug'
  nl: { slug: data.slugs.nl } // slug: 'rode-mok'
})

const switchLocalePath = useSwitchLocalePath()
switchLocalePath('en') // /products/red-mug
switchLocalePath('nl') // /nl/products/rode-mok
</script>

<template>
  <!-- pages/products/[slug].vue -->
</template>
```

Note that for the special case of a catch-all route named like `[...pathMatch].vue`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="bash"}, the key of the object needs to say `pathMatch`. For example:

```vue
<script>
const setI18nParams = useSetI18nParams()
setI18nParams({
  en: { pathMatch: ['not-found-my-post'] },
  fr: { pathMatch: ['not-found-mon-article'] }
})
</script>

<template>
  <!-- pages/[...pathMatch].vue -->
</template>
```

Note that a catch all route is defined **as an array**. In this case, there is only one element, but if you want to use a sub-path, for example `'/not-found/post'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}, define multiple elements as in `['not-found', 'post']`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}. You will need to define more than one, e.g. `['not-found', 'post']`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}.

::callout{icon="i-heroicons-light-bulb"}
**Nuxt i18n module** won't reset parameters translations for you, this means that if you use identical parameters for different routes, navigating between those routes might result in conflicting parameters. Make sure you always set params translations in such cases.
::

## `definePageMeta({ name: '...' })`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} caveat

By default Nuxt overwrites generated route values at build time which breaks custom named routes (setting `name` with `definePageMeta()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}) when resolving localized paths.

Nuxt v3.10 introduced the experimental feature [`scanPageMeta`](https://nuxt.com/docs/guide/going-further/experimental-features#scanpagemeta){rel="&#x22;nofollow&#x22;"}, this needs to be enabled for custom named routes to work when using Nuxt I18n.

This experimental feature can be enabled as shown here:

```typescript [nuxt.config.ts]
export default defineNuxtConfig({
  experimental: {
    scanPageMeta: true
  }
})
```


# Ignoring Localized Routes

::callout{color="warning" icon="i-heroicons-exclamation-triangle"}
This feature is not supported when using the `'no_prefix'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} [strategy](https://i18n.nuxtjs.org/docs/guide) unless you're also using [`differentDomains`](https://i18n.nuxtjs.org/docs/guide/different-domains).
::

If you'd like some pages to be available in some languages only, you can configure the list of supported languages to override the global settings. The options can be specified within either the page components themselves or globally, within the module configuration.
