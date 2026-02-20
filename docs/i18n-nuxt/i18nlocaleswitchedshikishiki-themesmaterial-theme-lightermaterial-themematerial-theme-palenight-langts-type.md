### `'i18n:localeSwitched'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}

Called right after the app's locale has been switched.

Parameters:

- `oldLocale`
  - type: `string`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
  - The app's locale before the switch
- `newLocale`
  - type: `string`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
  - The app's locale after the switch

## Usage

A typical usage would be to define those callbacks via a plugin where you can access the app's context (useful if you need to change Axios' config when the language changes for example).

```ts [/plugins/i18n.ts]
export default defineNuxtPlugin(nuxtApp => {
  // called right before setting a new locale
  nuxtApp.hook('i18n:beforeLocaleSwitch', (options) => {
    console.log('onBeforeLanguageSwitch', options.oldLocale, options.newLocale, options.initialSetup)

    // You can override the new locale by setting it to a different value
    if(options.newLocale === 'fr') {
      options.newLocale = 'en'
    }
  })

  // called right after a new locale has been set
  nuxtApp.hook('i18n:localeSwitched', (options) => {
    console.log('onLanguageSwitched', options.oldLocale, options.newLocale)
  })
})
```


# Custom Route Paths

In some cases, you might want to translate URLs in addition to having them prefixed with the locale code. There are two methods of configuring custom paths, through [Module configuration](https://i18n.nuxtjs.org/#module-configuration) or from within each [Page component](https://i18n.nuxtjs.org/#definepagemeta).

Which method is used is configured by setting the [`customRoutes` options](https://i18n.nuxtjs.org/docs/api/options#customroutes) this is set to `'page'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} by default. Using both methods at the same time is not possible.

::callout{color="warning" icon="i-heroicons-exclamation-triangle"}
Custom paths are not supported when using the `'no_prefix'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} [strategy](https://i18n.nuxtjs.org/docs/guide) unless combined with [`differentDomains`](https://i18n.nuxtjs.org/docs/guide/different-domains).
::

## Module configuration

Make sure you set the `customRoutes` option to `'config'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} and add your custom paths in the `pages` option:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  i18n: {
    customRoutes: 'config', // disable custom route with page components
    pages: {
      about: {
        en: '/about-us', // -> accessible at /about-us (no prefix since it's the default locale)
        fr: '/a-propos', // -> accessible at /fr/a-propos
        es: '/sobre' // -> accessible at /es/sobre
      }
    }
  }
})
```

Note that each key within the `pages` object should **correspond to the route name of the route to localize**.

Customized route paths &#x2A;*must start with a `/`** and **must not include the locale prefix**.

You can now use the `localePath()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} function or the `<NuxtLinkLocale>`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="html"} component but be sure to use named routes. For example route `'/services/advanced'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} should be `'services-advanced'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}:

```vue
<script setup>
const { t } = useI18n()
</script>

<template>
  <NuxtLinkLocale to="about"> {{ t('about') }} </NuxtLinkLocale>
  <NuxtLinkLocale to="services-advanced"> {{ t('advanced') }} </NuxtLinkLocale>
</template>
```

Or:

```vue
<script setup>
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <NuxtLink :to="localePath('about')"> {{ t('about') }} </NuxtLink>
  <NuxtLink :to="localePath('services-advanced')"> {{ t('advanced') }} </NuxtLink>
</template>
```

::callout{color="warning" icon="i-heroicons-exclamation-triangle"}
Passing a path to `localePath()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} is currently not supported.
::
