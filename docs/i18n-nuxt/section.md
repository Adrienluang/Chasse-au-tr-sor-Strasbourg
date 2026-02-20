### `...`

- any custom property set on the object will be exposed at runtime. This can be used, for example, to define the language name for the purpose of using it in a language selector on the page.

You can access all the properties of the current locale through the `localeProperties` property. When using an array of codes, it will only include the `code` property.

## defaultDirection

- type: `string`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `ltr`

The app's default direction. Will only be used when `dir` is not specified.

## defaultLocale

- type: `string | null`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `null`

The app's default locale. Should match the language code of one of the defined `locales`.

When using `prefix_except_default` strategy, URLs for locale specified here won't have a prefix. **It's recommended to set this to some locale** regardless of chosen strategy, as it will be used as a fallback locale when navigating to a non-existent route.

## strategy

- type: `'no_prefix' | 'prefix_except_default' | 'prefix' | 'prefix_and_default'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `'prefix_except_default'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}

Routes generation strategy. Can be set to one of the following:

- `'no_prefix'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}: routes won't have a locale prefix
- `'prefix_except_default'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}: locale prefix added for every locale except default
- `'prefix'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}: locale prefix added for every locale
- `'prefix_and_default'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}: locale prefix added for every locale and default

## customRoutes

- type: `'meta' | 'page' | 'config'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `'page'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}

Whether [custom paths](https://i18n.nuxtjs.org/docs/guide/custom-paths) are extracted from page files or configured in the module configuration:

- `'meta'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}: custom paths are extracted from the `definePageMeta()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} function in page components.
- `'page'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}: custom paths are extracted from the `defineI18nRoute()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} macro in page components.
- `'config'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}: custom paths are configured in the `pages` option of the module configuration.

## pages

- type: `object`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `{}`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}

If `customRoutes` option is disabled with `config`, the module will look for custom routes in the `pages` option. Refer to the [Routing](https://i18n.nuxtjs.org/docs/guide) for usage.

## skipSettingLocaleOnNavigate

- type: `boolean`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}

If `true`, the locale will not be set when navigating to a new locale. This is useful if you want to wait for the page transition to end before setting the locale yourself using [`finalizePendingLocaleChange`](https://i18n.nuxtjs.org/docs/api/vue-i18n#finalizependinglocalechange). See more information in [Wait for page transition](https://i18n.nuxtjs.org/docs/guide/lang-switcher#wait-for-page-transition).

## defaultLocaleRouteNameSuffix

- type: `string`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `'default'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}

Internal suffix added to generated route names for default locale, if strategy is `prefix_and_default`. You shouldn't need to change this.

## routesNameSeparator

- type: `string`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `'___'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}

Internal separator used for generated route names for each locale. You shouldn't need to change this.

## rootRedirect

- type: `string | { statusCode: number; path: string; } | null`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `null`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}

Set to a path to which you want to redirect users accessing the root URL (`'/'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}). Accepts either a string or an object with `statusCode` and `path` properties. E.g

```json
{
  "statusCode": 301,
  "path": "about-us"
}
```

## redirectStatusCode

- type: `number`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `302`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}

Specifies the HTTP status code to use when redirecting to a localized route from any URL except the root URL ('/').

## langDir

- type: `string`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `locales`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}

A relative path to a directory containing translation files to load.

The path is resolved relative to the project `restructureDir` at the root of a project (`'i18n'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} by default).

::callout{color="warning" icon="i-heroicons-exclamation-triangle"}
Absolute paths will fail in production (eg. `'/locales'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} should be changed into either `'locales'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} or `'./locales'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"})
::

## detectBrowserLanguage

- type: `object | boolean`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}

Enables browser language detection to automatically redirect visitors to their preferred locale as they visit your site for the first time.

See also [Browser language detection](https://i18n.nuxtjs.org/docs/guide/browser-language-detection) for a guide.

::callout{icon="i-heroicons-light-bulb"}
Note that for better SEO it's recommended to set `redirectOn` to `'root'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}.
::

Set to `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} to disable.

Supported properties:
