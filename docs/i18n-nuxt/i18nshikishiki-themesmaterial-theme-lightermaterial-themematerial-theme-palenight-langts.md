### `$i18n`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}

- **Type**: [`VueI18n | Composer`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}]

See also [NuxtApp](https://nuxt.com/docs/guide/going-further/nuxt-app#accessing-nuxtapp){rel="&#x22;nofollow&#x22;"}

`$i18n`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} is the global `Composer`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} or global `VueI18n`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} instance of Vue I18n. See about details [here](https://vue-i18n.intlify.dev/api/general.html#i18n){rel="&#x22;nofollow&#x22;"}

If you set `i18n.vueI18n.legacy` option to `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} in your `@nuxtjs/i18n` configuration, `$i18n`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} is a global `Composer`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} instance. Otherwise, it is a global `VueI18n`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} instance.

Example use:

```ts
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.$i18n.onBeforeLanguageSwitch = (oldLocale, newLocale, isInitialSetup, nuxtApp) => {
    console.log('onBeforeLanguageSwitch', oldLocale, newLocale, isInitialSetup)
  }
})
```
