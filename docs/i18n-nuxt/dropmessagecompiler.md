### `dropMessageCompiler`

- type: `boolean`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}

Whether to tree-shake message compiler when bundling.

::callout{color="warning" icon="i-heroicons-exclamation-triangle"}
If you enable this option, **you should check that resources in your application are pre-compiled with nuxt i18n module**. If you will be loading resources dynamically from the back-end via the API, enabling this option will not work because there is no message compiler.
::
