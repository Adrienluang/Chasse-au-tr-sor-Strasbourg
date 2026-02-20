### Example 1: Basic URL localization

You have some routes with the following `pages` directory:

```bash [Directory structure]
-| pages/
---| parent/
-----| child.vue
---| parent.vue
```

::callout{icon="i-heroicons-light-bulb"}
Nested/child routes rely on there being a page component with the same name as the folder that renders the child routes. :br
For more details, see [Nested Routes](https://nuxt.com/docs/guide/directory-structure/pages#nested-routes){rel=""nofollow""}.
::

You would need to set up your `pages` property as follows:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  i18n: {
    customRoutes: 'config',
    pages: {
      parent: {
        en: '/parent',
        ca: '/pare'
      },
      'parent-child': {
        en: '/parent/child',
        ca: '/pare/fill'
      }
    }
  }
})
```

::callout{color="warning" icon="i-heroicons-exclamation-triangle"}
All URLs must start with `/`
::
