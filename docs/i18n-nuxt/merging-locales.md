### Merging locales

Locales provided by a project will be merged with those provided by extended layers, this can be done as follows:

::code-group
```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['my-layer'],
  i18n: {
    locales: [{ code: 'en', file: 'en.json' }]
  }
})
```

```ts [my-layer/nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'nl', file: 'nl.json' }
    ]
  }
})
```
::

This example would result in the project supporting two locales (`'en'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}, `'nl'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}) and would add the additional messages added for the `'en'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} locale.

::code-group
```ts [project/i18n/locales/en.json]
{
  "title": "foo"
}
```

```ts [project/my-layer/i18n/locales/en.json]
{
  "title": "layer title",
  "description": "bar"
}
```
::

The above will result in the following

```jsonc
{
  // earlier layers take priority
  "title": "foo",
  "description": "bar"
}
```

## VueI18n options

Options defined in VueI18n configuration files within layers are merged and override each other according to their layers priority.


# Server-Side Translations

You can do the translation on the server-side and return it as a response. The locale messages defined in nuxt i18n module options are integrated, so all you need to do is configure the locale detector.

::callout{color="warning" icon="i-heroicons-exclamation-triangle"}
**This feature is experimental,** that is supported from v8 RC8.
::

## Define locale detector

For server-side translation, you need to define a locale detector.

Nuxt i18n exports the `defineI18nLocaleDetector()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} composable function to define it.

The following is an example of how to define a detector that detects locale using query, cookie, and header:

```ts [i18n/localeDetector.ts]
// Detect based on query, cookie, header
export default defineI18nLocaleDetector((event, config) => {
  // try to get locale from query
  const query = tryQueryLocale(event, { lang: '' }) // disable locale default value with `lang` option
  if (query) {
    return query.toString()
  }

  // try to get locale from cookie
  const cookie = tryCookieLocale(event, { lang: '', name: 'i18n_locale' }) // disable locale default value with `lang` option
  if (cookie) {
    return cookie.toString()
  }

  // try to get locale from header (`accept-header`)
  const header = tryHeaderLocale(event, { lang: '' }) // disable locale default value with `lang` option
  if (header) {
    return header.toString()
  }

  // If the locale cannot be resolved up to this point, it is resolved with the value `defaultLocale` of the locale config passed to the function
  return config.defaultLocale
})
```

The locale detector function is used to detect the locale on the server-side. It's called per request on the server.

When you define the locale detector, you need to pass the path to the locale detector to the `experimental.localeDetector` option.

The following is an example of a locale detector configuration defined directly in the Nuxt application:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  i18n: {
    experimental: {
      localeDetector: 'localeDetector.ts'
    }
  }
})
```

For details on the locale detector function defined by `defineI18nLocaleDetector()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}, see [here](https://i18n.nuxtjs.org/docs/composables/define-i18n-locale-detector).

## `useTranslation()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} on eventHandler

To translate on the server-side , you need to call `useTranslation()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}.

Example:

```ts
// you need to define `async` event handler
export default defineEventHandler(async event => {
  // call `useTranslation`, so it return the translation function
  const t = await useTranslation(event)
  return {
    // call translation function with key of locale messages,
    // and translation function has some overload
    hello: t('hello')
  }
})
```

::callout{icon="i-heroicons-light-bulb"}
For the key of the translation function, you can specify the locale messages set in the nuxt-i18n options inside the nuxt.config, or the locale loaded in the i18n.config messages.
::


# Module integration

If your module depends on Nuxt i18n, you can use `moduleDependencies`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} to declare the dependency and define default or override options. See Nuxt's [Module Author Guide](https://nuxt.com/docs/4.x/guide/modules/recipes-basics#use-other-modules){rel="&#x22;nofollow&#x22;"} for more information.

You will need to resolve paths for `vueI18n`, `langDir`, and those configured in `locales` to absolute paths:

```ts
import { createResolver, defineNuxtModule } from '@nuxt/kit'

const resolver = createResolver(import.meta.url)

export default defineNuxtModule({
  moduleDependencies: {
    '@nuxtjs/i18n': {
      defaults: {
        vueI18n: resolver.resolve('./i18n.config.ts'),
        langDir: resolver.resolve('./lang'),
        locales: [
          { code: 'en', file: resolver.resolve('./lang/en.json') },
          { code: 'fr', file: resolver.resolve('./lang/fr.json') },
        ]
      }
    }
  },
  // ...
})
```


# Migration Guide

## Upgraded to Vue I18n v11

We have upgraded from Vue I18n v10 to v11, this major version bump deprecates the Legacy API mode and custom `v-t` directive, and removes `tc()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} and `$tc()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} from Legacy API mode.

Check the documentation detailing the breaking changes [here](https://vue-i18n.intlify.dev/guide/migration/breaking11.html){rel="&#x22;nofollow&#x22;"}.

## Configuration options

The following [Configuration options](https://i18n.nuxtjs.org/docs/api/options) have been changed, deprecated, or removed.

| Status | Option                                                                                                                                                                                                              | Notes                                                                                                                                                                                                                  |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|        | `experimental.hmr`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}                                                                                      | Enabled by default and renamed to [`hmr`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}](https://i18n.nuxtjs.org/docs/api/options#hmr)                    |
|        | `experimental.switchLocalePathLinkSSR`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}                                                                  | Enabled by default and the option to disable it has been removed.                                                                                                                                                      |
|        | `experimental.autoImportTranslationFunctions`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}                                                           | Enabled by default and renamed to [`autoDeclare`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}](https://i18n.nuxtjs.org/docs/api/options#autodeclare)    |
|        | [`restructureDir`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}](https://i18n.nuxtjs.org/docs/api/options#restructuredir)                             | This can no longer be disabled. :br:br We recommend leaving this unset to use the default value of `'i18n'`{.language-ts.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="ts"}. |
|        | [`types`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}](https://i18n.nuxtjs.org/docs/api/options#types)                                               | Only `'composition'`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"} types will be supported in v11, in line with Vue I18n v12.                            |
|        | [`baseUrl`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}](https://i18n.nuxtjs.org/docs/api/options#baseurl)                                           | Will only allow string values and will no longer support function configuration in v11. :br:br Use runtime config or rely on multi domain locales to set the base URL for complex setups.                              |
|        | [`routesNameSeparator`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}](https://i18n.nuxtjs.org/docs/api/options#routesnameseparator)                   | This was documented as internal, use cases for end-users are unclear.                                                                                                                                                  |
|        | [`defaultLocaleRouteNameSuffix`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}](https://i18n.nuxtjs.org/docs/api/options#defaultlocaleroutenamesuffix) | This was documented as internal, use cases for end-users are unclear.                                                                                                                                                  |
|        | `lazy`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}                                                                                                  | Lazy loading of locale messages is now enabled for all locale files.                                                                                                                                                   |
|        | `bundle.optimizeTranslationDirective`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}                                                                   | This feature has been disabled and fully removed, see [the discussion in this issue](https://github.com/nuxt-modules/i18n/issues/3238#issuecomment-2672492536){rel="&#x22;nofollow&#x22;"} for context on this change. |
|        | `experimental.generatedLocaleFilePathFormat`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}                                                            | File paths (e.g. locale files, vue-i18n configs) configured for this module are now removed from the build entirely making this option obsolete.                                                                       |

## Behavior Changes
