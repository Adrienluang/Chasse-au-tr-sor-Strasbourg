### Experimental strict SEO mode

We have added a new experimental option `strictSeo`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="yml"} that enables strict SEO mode, which changes the way i18n head tags are handled.

With strict SEO mode enabled, the i18n head tags are managed internally, this allows for some much requested improvements:

- The module will no longer add alternate tags for unsupported locales when setting localized dynamic route params.
- Unsupported locale links used with `<SwitchLocalePathLink>`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="vue"} are disabled, their links will be set to `'#'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} and will have a `data-i18n-disabled`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="vue"} attribute for styling purposes.
- The `useLocaleHead()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} is no longer needed in strict SEO mode, i18n tags are automatically set by the module and usage will throw an error.
- Canonical query parameters are configured globally with `experimental.strictSeo.canonicalQueryParams`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="yml"}.
- The `useSetI18nParams()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} inherits the global canonical query parameter config which can be overridden through its options parameter.

If this mode proves stable it will become the default in v11, please try it out and report any issues you encounter.


# Options

## vueI18n

- type: `string`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `''`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}

Build-time configuration for Vue I18n options that is used internally by this module. See full documentation at [here](https://vue-i18n.intlify.dev/api/general.html#createi18n){rel="&#x22;nofollow&#x22;"}

Configuration for `createI18n()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} can be passed using a configuration file. By default, the module will scan for a `i18n.config{.js,.mjs,.ts}` if nothing is specified.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    vueI18n: './nuxt-i18n.js' // custom path example
  }
})
```

You need to `export default` with **plain object** or **function**.

Export with plain object example:

```ts
export default {
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
}
```

Export with function example:

```ts
import en from '../locales/en.json'
import fr from '../locales/fr.yaml'

// You can use `defineI18nConfig` to get type inferences for options to pass to vue-i18n.
export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: 'en',
    messages: {
      en,
      fr
    }
  }
})
```

::callout{color="warning" icon="i-heroicons-exclamation-triangle"}
The Vue I18n `messages` option should be returned **by the plain object**.

That will be pre-compiled in the nuxt i18n module via vue-i18n message-compiler as an executable message in the vue-i18n runtime.
::

## baseUrl

- type: `string | Function`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `''`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}

The fallback base URL to use as a prefix for alternate URLs in `hreflang` tags. By default VueRouter's base URL will be used and only if that is not available, fallback URL will be used.

Can also be a function (will be passed a Nuxt Context as a parameter) that returns a string. Useful to make base URL dynamic based on request headers.

This property can also be set using [`runtimeConfig`](https://i18n.nuxtjs.org/docs/api/runtime-config).

::callout{icon="i-heroicons-light-bulb"}
It's especially important to set this option when using SEO features, in which case it's required that generated SEO tags use fully-qualified URLs.
::

## locales

- type: `string[] | LocaleObject[]`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `[]`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}

List of locales supported by your app. Can either be an array of language codes (`['en', 'fr', 'es']`) or an array of locale objects for more complex configurations:

```json
[
  { "code": "en", "language": "en-US", "file": "en.js", "dir": "ltr" },
  { "code": "ar", "language": "ar-EG", "file": "ar.js", "dir": "rtl" },
  { "code": "fr", "language": "fr-FR", "file": "fr.js" }
]
```

When using an object form, the properties can be:
