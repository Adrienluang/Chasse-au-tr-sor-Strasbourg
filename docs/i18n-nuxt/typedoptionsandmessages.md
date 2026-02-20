### `typedOptionsAndMessages`

- type: `false | 'default' | 'all'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
  - `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} - disables type generation
  - `'default'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} - generate types based on configured `defaultLocale`
  - `'all'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} - generate types based on all configured locales
- default: `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}
- Generate `vue-i18n` and message types used in translation functions and `vue-i18n` configuration. Can be configured to use the `defaultLocale` (better performance) or all locales for type generation.
