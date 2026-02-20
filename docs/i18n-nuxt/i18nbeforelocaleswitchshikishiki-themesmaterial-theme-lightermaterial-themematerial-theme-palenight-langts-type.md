### `'i18n:beforeLocaleSwitch'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}

Called before the app's locale is switched, the `newLocale` property can be overridden to change the locale being switched to.

Parameters:

- `oldLocale`
  - type: `string`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
  - The app's locale before the switch
- `newLocale`
  - type: `string`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
  - The app's locale after the switch
- `initialSetup`
  - type: `string`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
  - Set to `true` if it's the initial locale switch that triggers on app load. It's a special case since the locale is not technically set yet so we're switching from no locale to locale.
- `context`
  - type: `NuxtApp`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
  - The Nuxt app, this property is deprecated, the same can be achieved by using `const context = useNuxtApp()` outside the hook scope instead.

Returns: `string | null`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
