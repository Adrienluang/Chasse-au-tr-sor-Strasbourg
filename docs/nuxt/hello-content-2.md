# Hello Content
```

The module automatically loads and parses them.

## Render Content

To render content pages, add a [catch-all route](https://nuxt.com/docs/3.x/directory-structure/pages/#catch-all-route) using the [`<ContentRenderer>`](https://content.nuxt.com/docs/components/content-renderer){rel="&#x22;nofollow&#x22;"} component:

```vue [pages/[...slug\\].vue]
<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').path(route.path).first()
})
</script>

<template>
  <div>
    <header><!-- ... --></header>

    <ContentRenderer
      v-if="page"
      :value="page"
    />

    <footer><!-- ... --></footer>
  </div>
</template>
```

## Documentation

::tip{icon="i-lucide-book"}
Head over to <https://content.nuxt.com>{rel=""nofollow""} to learn more about the Content module features, such as how to build queries and use Vue components in your Markdown files with the MDC syntax.
::
