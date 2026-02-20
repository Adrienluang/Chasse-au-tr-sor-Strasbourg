### `compositionOnly`

- type: `boolean`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `true`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}

Whether to make vue-i18n API only composition API. By default the legacy API is tree-shaken. For more details, See [here](https://vue-i18n.intlify.dev/guide/advanced/optimization.html#reduce-bundle-size-with-feature-build-flags){rel="&#x22;nofollow&#x22;"}

::callout{color="warning" icon="i-heroicons-exclamation-triangle"}
If you would like to use Vue I18n's Legacy API, you must set `compositionOnly: false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}. **Note that setting this value will disable Vue I18n Composition API**.

Note that the Legacy API can also be used in hybrid by setting the Vue I18n option to `allowComposition: true`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} in i18n.config, but this is limited. See [here](https://vue-i18n.intlify.dev/guide/migration/vue3.html){rel=""nofollow""} for details.
::
