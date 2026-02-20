### Examples

#### Basic usage

```vue
<template>
  <NuxtLinkLocale to="/">{{ $t('home') }}</NuxtLinkLocale>
</template>

<!-- equivalent to -->

<script setup>
const localePath = useLocalePath()
</script>

<template>
  <NuxtLink :to="localePath('/')">{{ $t('home') }}</NuxtLink>
</template>
```

#### Forcing locale resolution

```vue
<template>
  <NuxtLinkLocale to="/" locale="nl">{{ $t('home') }}</NuxtLinkLocale>
</template>

<!-- equivalent to -->

<script setup>
const localePath = useLocalePath()
</script>

<template>
  <NuxtLink :to="localePath('/', 'nl')">{{ $t('home') }}</NuxtLink>
</template>
```


# <SwitchLocalePathLink>

This component acts as a constrained [`<NuxtLink>`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="html"}](https://nuxt.com/docs/api/components/nuxt-link#nuxtlink){rel="&#x22;nofollow&#x22;"} which internally uses `switchLocalePath()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} to link to the same page in the provided locale.

We especially recommend using this component for language-switchers since it will correctly update routes using dynamic route parameters during server-side rendering.
