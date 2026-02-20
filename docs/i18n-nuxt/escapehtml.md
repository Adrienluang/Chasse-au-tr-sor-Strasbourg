### `escapeHtml`

- type: `boolean`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}

Determine whether to escape HTML tags if they are included in the locale message.

::callout{color="warning" icon="i-heroicons-exclamation-triangle"}
If `strictMessage` is disabled by setting it to `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}, we recommend enabling this option.
::

## bundle

- type: `object`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `{ compositionOnly: true, runtimeOnly: false, fullInstall: true, dropMessageCompiler: false }`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}

Configure the bundling optimization for nuxt i18n module.

Supported properties:
