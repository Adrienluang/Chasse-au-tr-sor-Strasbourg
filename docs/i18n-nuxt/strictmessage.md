### `strictMessage`

- type: `boolean`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `true`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}

Strictly check that the locale message does not contain HTML tags. If HTML tags are included, an error is thrown.

::callout{color="warning" icon="i-heroicons-exclamation-triangle"}
If you do not want the error to be thrown, you can work around it by setting it to false. However, **this means that the locale message might cause security issues with XSS**. In that case, we recommend setting the `escapeHtml` option to `true`.
::
