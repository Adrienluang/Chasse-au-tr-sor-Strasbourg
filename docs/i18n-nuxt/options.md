### `options`

An object accepting the following optional fields:

- `dir`
  - type: `boolean`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}
  - default: `true`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}
  - Adds a `dir` attribute to the HTML element.
- `lang`
  - type: `boolean`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}
  - default: `true`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}
  - Adds a `lang` attribute to the HTML element.
- `seo`
  - type: `boolean | SeoAttributesOptions`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}
  - Adds various SEO attributes.

## Usage

```vue
<script setup>
const i18nHead = useLocaleHead({
  seo: {
    canonicalQueries: ['foo']
  }
})
useHead(() => ({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs!.lang
  },
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])]
}))
</script>
```


# useSetI18nParams

The `useSetI18nParams()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} returns a function to set translated parameters for the current route.
For more details on its usage see the [Lang Switcher guide](https://i18n.nuxtjs.org/docs/guide/lang-switcher#dynamic-route-parameters).

## Type

```ts
declare function useSetI18nParams(options?: SeoAttributesOptions): (locale: Record<Locale, unknown>) => void
```

## Parameters
