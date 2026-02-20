### `httpCacheDuration`

- type: `number`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `10`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}
- HTTP cache duration for the messages API endpoint in seconds. This controls how long browsers cache the translation data. Set to a higher value (e.g., `86400` for 24 hours) to reduce redundant network requests for unchanged translations.

## `hmr`

- type: `boolean`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `true`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}
- Hot module replacement for locale message files and vue-i18n configuration in dev mode.

::callout{color="warning" icon="i-heroicons-exclamation-triangle"}
This functionality is only supported for projects using vite.
::

## customBlocks

Configure the `i18n` custom blocks of SFC.

Supported properties:
