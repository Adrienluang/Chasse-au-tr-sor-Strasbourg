### `fullInstall`

- type: `boolean`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `true`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}

Whether to install the full set of APIs, components, etc. By default, all of them will be installed. If `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} is specified, built-in components (`<i18n-t>`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="html"}, `<i18n-d>`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="html"} and `<i18n-n>`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="html"}) and directive (`v-t`) will not be installed in vue and will be tree-shaken. For more details, See [here](https://vue-i18n.intlify.dev/guide/advanced/optimization.html#reduce-bundle-size-with-feature-build-flags){rel="&#x22;nofollow&#x22;"}
