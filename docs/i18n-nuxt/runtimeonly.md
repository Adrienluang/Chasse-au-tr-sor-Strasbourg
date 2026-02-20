### `runtimeOnly`

- type: `boolean`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}

Whether or not to automatically use Vue I18n runtime-only in build.

::callout{color="warning" icon="i-heroicons-exclamation-triangle"}
When you will enable this option, vue-i18n message compiler is not bundled. This means that you will not be able to dynamically retrieve locale messages for use in your application from back-end APIs via fetch, or programmatically compose the locale messages. That is to say, **you must be able to fully resolve locale messages at build time.**
::
