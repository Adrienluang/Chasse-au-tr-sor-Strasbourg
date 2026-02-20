### `'prefix_and_default'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}

This strategy combines both previous strategies behaviours, meaning that you will get URLs with prefixes for every language, but URLs for the default language will also have a non-prefixed version (though the prefixed version will be preferred when `detectBrowserLanguage` is enabled).

## Configuration

To configure the strategy, use the `strategy` option.
Make sure that you have a `defaultLocale` defined, especially if using `prefix_except_default`, `prefix_and_default` or `no_prefix` strategy. For other strategies it's also recommended to set this as it will be used as a fallback when attempting to redirect from a 404 page.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // ...

  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en'
  }

  // ...
})
```


# Runtime Hooks

**Nuxt i18n module** provides runtime hooks to perform specific tasks based on your app's language.

## Hooks
