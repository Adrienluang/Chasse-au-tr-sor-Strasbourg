### `options`

**Type**: `SeoAttributesOptions | undefined`

An `SeoAttributesOptions` object, default `undefined`. See the [SEO guide](https://i18n.nuxtjs.org/docs/guide/seo#feature-details) for more details.

## Usage

```vue
<script setup>
// fetch product from API... (red mug)

const setI18nParams = useSetI18nParams({
  canonicalQueries: ['foo']
})
setI18nParams({
  en: { slug: data.slugs.en }, // slug: 'red-mug'
  nl: { slug: data.slugs.nl } // slug: 'rode-mok'
})

const switchLocalePath = useSwitchLocalePath()
switchLocalePath('en') // /products/red-mug
switchLocalePath('nl') // /nl/products/rode-mok
</script>

<template>
  <!-- pages/products/[slug].vue -->
</template>
```


# useRouteBaseName

The `useRouteBaseName()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} composable returns a function that gets the route's base name.

## Type

```ts
declare function useRouteBaseName(
  options?: I18nCommonRoutingOptionsWithComposable
): (givenRoute: string | Route | RouteLocationNormalizedLoaded) => string | undefined
```

## Usage

```vue
<script setup>
const route = useRoute()
const routeBaseName = useRouteBaseName()
const baseRouteName = computed(() => routeBaseName(route))
// or
const baseRouteNameString = computed(() => routeBaseName(route.name))
</script>

<template>
  <p>route base name: {{ baseRouteName }}</p>
</template>
```


# useBrowserLocale

The `useBrowserLocale()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} composable returns the browser locale.

If this composable function is called on client-side, it detects the locale from the value of `navigator.languages`.

Else on the server side, the locale is detected from the value of `accept-language` header.

## Type

```ts
declare function useBrowserLocale(): string | null
```


# useCookieLocale

The `useCookieLocale()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} composable returns the cookie locale.

If this composable function is called on client-side, it detects the locale from the value of `document.cookie` via `useCookie()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}. else on the server side, the locale is detected from the value of `cookie` header.

Note that if the value of `detectBrowserLanguage.useCookie` is `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}, an **empty string** is always returned.

## Type

```ts
declare function useCookieLocale(): Ref<string>
```


# useTranslation

The `useTranslation()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} composable returns the translation function.

The locale used by the translation function is the locale detected by the function defined in [`experimental.localeDetector` option](https://i18n.nuxtjs.org/docs/api/options#experimental).

::callout{color="warning" icon="i-heroicons-exclamation-triangle"}
**This composable is experimental and server-side only.**
::

## Type

```ts
declare function useTranslation<Schema extends Record<string, any> = {}, Event extends H3Event = H3Event>(
  event: Event
): Promise<TranslationFunction<Schema, DefineLocaleMessage>>
```

## Usage

```ts
export default defineEventHandler(async event => {
  const t = await useTranslation(event)
  return {
    hello: t('hello')
  }
})
```


# defineI18nConfig

The `defineI18nConfig()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} composables is used to define a function which returns the vue-i18n configuration which is passed to the `createI18n()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} options on the Nuxt I18n module.

The loader function needs to return a Function or Promise that resolves a vue-i18n options object.

For more details on configuring vue-i18n, see the [Vue I18n documentation](https://vue-i18n.intlify.dev/api/general.html#createi18n){rel="&#x22;nofollow&#x22;"}.

## Type

```ts
export function defineI18nConfig<Config extends I18nOptions>(
  loader: () => Config | Promise<Config>
): () => Config | Promise<Config>
```

## Parameters
