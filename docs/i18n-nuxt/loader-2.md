### `loader`

A function that is the dynamic locale messages loading, that has the following parameters:

- `locale`:br**Type**: `Locale`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}:br A target locale that is passed from nuxt i18n module. That is passed when the locale is switched in the following cases:
  - when you switch the locale with `setLocale()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}.
  - when the locale is switched with `<NuxtLink>`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="html"}. for example, the route path resolved by `useSwitchLocalePath()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} or `$switchLocalePath()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}.

## Usage

An example of a loader function using a fetch request to load locale messages:

```ts
export default defineI18nLocale(locale => {
  return $fetch(`https://your-company-product/api/${locale}`)
})
```


# defineI18nLocaleDetector

The `defineI18nLocaleDetector()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} is composable used to define a function which detects the locale on the server-side, it's called per request on the server.

The function needs to return a locale string.

You can use [`@intlify/h3` utilities](https://github.com/intlify/h3#%EF%B8%8F-utilites--helpers){rel="&#x22;nofollow&#x22;"} in the locale detector function, these are auto imported.

::callout{color="warning" icon="i-heroicons-exclamation-triangle"}
**This composable is experimental.** You need to configure filepath to [`experimental.localeDetector` option](https://i18n.nuxtjs.org/docs/api/options#experimental).
::

## Type

```ts
type LocaleConfig = {
  defaultLocale: Locale
  fallbackLocale: FallbackLocale
}
declare function defineI18nLocaleDetector(
  detector: (event: H3Event, config: LocaleConfig) => string
): (event: H3Event, config: LocaleConfig) => string
```

## Parameters
