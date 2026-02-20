### Resolving a localized route with `$localePath`

The `$localePath` function is used to get the localized route for a given route, this function is returned by `useLocalePath` for usage outside `<template>`.

This function accepts two parameters:

- `route`: name of a route or a route object with a name property
- `locale`: locale code in which the route should be localized, defaults to the current locale

::code-group
```vue [page.vue (global function)]
<template>
  <NuxtLink :to="$localePath('index')">{{ $t('home') }}</NuxtLink>
  <NuxtLink :to="$localePath('index', 'en')">Homepage in English</NuxtLink>
  <NuxtLink :to="$localePath('user-profile')">Route to {{ $t('profile') }}</NuxtLink>
  <NuxtLink :to="$localePath({ name: 'category-slug', params: { slug: category.slug } })">
    {{ category.title }}
  </NuxtLink>
</template>
```

```vue [page.vue (composable)]
<script setup>
const localePath = useLocalePath()
</script>

<template>
  <NuxtLink :to="localePath('index')">{{ $t('home') }}</NuxtLink>
  <NuxtLink :to="localePath('index', 'en')">Homepage in English</NuxtLink>
  <NuxtLink :to="localePath('user-profile')">Route to {{ $t('profile') }}</NuxtLink>
  <NuxtLink :to="localePath({ name: 'category-slug', params: { slug: category.slug } })">
    {{ category.title }}
  </NuxtLink>
</template>
```
::

Since localized routes can change based on your configuration, using route names ensures accurate resolution. Nuxt I18n generates types to facilitate this, providing type safety and improved developer experience. To utilize these types, enable `typedPages` in your Nuxt configuration.

The route name corresponds to the names Nuxt generates when parsing your `pages` directory, more info in [Nuxt docs](https://nuxt.com/docs/guide/directory-structure/pages){rel="&#x22;nofollow&#x22;"}.
