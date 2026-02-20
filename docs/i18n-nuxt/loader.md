### `loader`

A function that is the vue-i18n options loading.

## Usage

An example defining a simple vue-i18n options object:

```ts
export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      welcome: 'Welcome'
    },
    fr: {
      welcome: 'Bienvenue'
    }
  }
}))
```


# defineI18nLocale

The `defineI18nLocale()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} composable is used to define a function to dynamically load locale messages used for [lazy-loading translations](https://i18n.nuxtjs.org/docs/guide/lazy-load-translations).

The loader function needs to return a `Promise`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} that resolves a messages object.

## Type

```ts
declare function defineI18nLocale<Messages = LocaleMessages<DefineLocaleMessage>, Locales = Locale>(
  loader: (locale: Locales) => Messages | Promise<Messages>
): (locale: Locales) => Messages | Promise<Messages>
```

## Parameters
