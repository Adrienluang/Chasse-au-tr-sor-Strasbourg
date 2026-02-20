### Custom routes via `definePageMeta()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}

We have added support for setting custom routes for pages using the `definePageMeta()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} API, which is now the recommended way to set custom routes for pages.
This method is enabled by setting `customRoutes: 'meta'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} in the module options.

To migrate from the `defineI18nRoute()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} macro, you can simply replace it with `definePageMeta()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} and set the `i18n` property with the same options:

```vue [pages/about.vue]
<script setup>
definePageMeta({
  i18n: {
    paths: {
      en: '/about-us',
      fr: '/a-propos',
    }
  }
})
</script>
```
