### `setLocale()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}

- **Arguments**:
  - locale (type: `string`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"})
- **Returns**: `Promise<void>`

Switches locale of the app to specified locale code. If `useCookie` option is enabled, locale cookie will be updated with new value. If prefixes are enabled (`strategy` other than `no_prefix`), will navigate to new locale's route.
