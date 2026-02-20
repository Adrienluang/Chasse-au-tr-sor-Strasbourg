### Switching between languages

The `$switchLocalePath` function returns the localized version of the route to the current page, it accepts a locale code in which the current route should be localized.

::code-group
```vue [page.vue (global function)]
<template>
  <NuxtLink :to="$switchLocalePath('en')">English</NuxtLink>
  <NuxtLink :to="$switchLocalePath('nl')">Nederlands</NuxtLink>
</template>
```

```vue [page.vue (composable)]
<script setup>
const switchLocalePath = useSwitchLocalePath()
</script>

<template>
  <NuxtLink :to="switchLocalePath('en')">English</NuxtLink>
  <NuxtLink :to="switchLocalePath('nl')">Nederlands</NuxtLink>
</template>
```
::
