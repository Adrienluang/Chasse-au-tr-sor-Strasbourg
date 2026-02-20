### `detector`

A function that is the locale detector, that has the following parameters:

- `event`
  - type: `H3Event`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
  - An H3 event. see details [H3 API docs](https://www.jsdocs.io/package/h3#H3Event){rel="&#x22;nofollow&#x22;"}
- `config`
  - type: `object`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
  - A locale config that is passed from Nitro.
  - Properties:
    - `defaultLocale`
      - type: `Locale`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
      - This value is set to the `defaultLocale` option of Nuxt i18n. If unset, it is set to the `locale` option loaded from the Vue I18n configuration (`i18n.config` file set on the `vueI18n` option). If neither of these are set, the default value of `'en-US'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} is used.
    - `fallbackLocale`
      - type: `FallbackLocale`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
      - This value is set to the `fallbackLocale` option loaded from the Vue I18n configuration (`i18n.config` file set on the `vueI18n` option). If no fallback locale has been configured this will default to `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}.

## Usage

An example of a locale detector:

```ts
// Detect based on query, cookie, header
export default defineI18nLocaleDetector((event, config) => {
  const query = tryQueryLocale(event, { lang: '' })
  if (query) {
    return query.toString()
  }

  const cookie = tryCookieLocale(event, { lang: '', name: 'i18n_locale' })
  if (cookie) {
    return cookie.toString()
  }

  const header = tryHeaderLocale(event, { lang: '' })
  if (header) {
    return header.toString()
  }

  return config.defaultLocale
})
```


# defineI18nRoute

::callout
---
color: warning
icon: i-heroicons-exclamation-triangle
title: notice
---
This macro is deprecated in favor of setting localized paths using `definePageMeta()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} and will be removed in v11.

:br

See its [section in Custom Paths](https://i18n.nuxtjs.org/docs/guide/custom-paths#definepagemeta) for more details.
::

`defineI18nRoute()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} is a compiler macro that you can use to set custom route paths for your **page** components located in the `pages/` directory (unless [set otherwise](https://nuxt.com/docs/api/configuration/nuxt-config#pages-1){rel="&#x22;nofollow&#x22;"}). This way you can set custom route paths for each static or dynamic route of your Nuxt application.

```vue [pages/some-page.vue]
<script setup>
defineI18nRoute({
  paths: {
    en: '/about-us',
    fr: '/a-propos',
    ja: '/about-ja'
  }
})
</script>
```

## Type

```ts
defineI18nRoute(route: I18nRoute | false) => void

interface I18nRoute {
  paths?: Record<Locale, `/${string}`>
  locales?: Locale[]
}
```

## Parameters
