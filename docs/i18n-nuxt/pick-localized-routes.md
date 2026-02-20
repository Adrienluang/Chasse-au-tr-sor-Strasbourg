### Pick localized routes

::code-group
```vue [about-meta.vue]
// pages/about.vue
<script setup>
definePageMeta({
  i18n: { locales: ['fr', 'es'] }
})
</script>
```

```vue [about-macro.vue]
// pages/about.vue
<script setup>
defineI18nRoute({
  locales: ['fr', 'es']
})
</script>
```

```ts [nuxt.config.ts]
i18n: {
  pages: {
    about: {
      en: false,
    }
  }
}
```
::
