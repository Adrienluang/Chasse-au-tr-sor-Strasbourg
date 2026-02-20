### Examples

#### Basic usage

```vue
<template>
  <SwitchLocalePathLink locale="nl">Dutch</SwitchLocalePathLink>
  <SwitchLocalePathLink locale="en">English</SwitchLocalePathLink>
</template>

<!-- equivalent to -->

<script setup>
const switchLocalePath = useSwitchLocalePath()
</script>

<template>
  <NuxtLink :to="switchLocalePath('nl')">Dutch</NuxtLink>
  <NuxtLink :to="switchLocalePath('en')">English</NuxtLink>
</template>
```


# useLocalePath

The `useLocalePath()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} composable returns a function that resolves a path according to the current locale.

## Type

```ts
declare function useLocalePath(
  options?: I18nCommonRoutingOptionsWithComposable
): (route: RawLocation | RouteLocation, locale?: Locale) => string
```

## Usage

```vue
<script setup>
const localePath = useLocalePath()
</script>

<template>
  <NuxtLink :to="localePath('index')">{{ $t('home') }}</NuxtLink>
</template>
```


# useLocaleRoute

The `useLocaleRoute()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} composable returns a function that resolves the route according to the current locale.

## Type

```ts
declare function useLocaleRoute(
  options?: I18nCommonRoutingOptionsWithComposable
): (route: RawLocation | RouteLocation, locale?: Locale) => Route | (RouteLocation & { href: string }) | undefined
```

## Usage

```vue
<script setup>
const localeRoute = useLocaleRoute()
const { locale } = useI18n()
const linkPath = computed(() => {
  const route = localeRoute('blog', locale.value)
  return route != null ? route.path : '/'
})
</script>

<template>
  <NuxtLink :to="linkPath">{{ $t('blog') }}</NuxtLink>
</template>
```


# useSwitchLocalePath

The `useSwitchLocalePath()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} composable returns a function that allows to switch the locale.

## Type

```ts
declare function useSwitchLocalePath(options?: I18nCommonRoutingOptionsWithComposable): (locale?: Locale) => string
```

## Usage

```vue
<script setup>
const switchLocalePath = useSwitchLocalePath()
</script>

<template>
  <NuxtLink :to="switchLocalePath('en')">English</NuxtLink>
  <NuxtLink :to="switchLocalePath('fr')">Français</NuxtLink>
</template>
```


# useLocaleHead

The `useLocaleHead()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} composable returns localized head properties for locale-related aspects.

## Type

```ts
declare function useLocaleHead(options: I18nHeadOptions): Ref<I18nHeadMetaInfo>
```

## Parameters
