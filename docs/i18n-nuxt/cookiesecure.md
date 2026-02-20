### `cookieSecure`

- type: `boolean`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}

Sets the `Secure` flag for the cookie.

## differentDomains

- type: `boolean`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}

Set this to `true`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} when using different domains for each locale, with this enabled you MUST configure locales as an array of objects, each containing a `domain` key. Refer to the [Different domains](https://i18n.nuxtjs.org/docs/guide/different-domains) for more information.

## multiDomainLocales

- type: `boolean`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}

Set this to `true` when using different domains with different locales. If enabled, you MUST configure locales as an array of objects, each containing a `domains` and `defaultForDomains` key. Refer to the [Multi Domain Locales](https://i18n.nuxtjs.org/docs/guide/multi-domain-locales) for more information.

## compilation

- type: `object`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `{ strictMessage: true, escapeHtml: false }`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}

Configure flags that sets the behavior compilation of locale messages.

Supported properties:
