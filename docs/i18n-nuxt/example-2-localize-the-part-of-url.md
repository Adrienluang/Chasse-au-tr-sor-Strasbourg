### Example 2: Localize the part of URL

You have some routes with the following `pages` directory:

```bash [Directory structure]
-| pages/
---| about.vue
---| services/
-----| index.vue
-----| coaching.vue
-----| development/
-------| app.vue
-------| website.vue
-----| development.vue
---| services.vue
```

You would need to set up your `pages` property as follows:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  i18n: {
    customRoutes: 'config',
    pages: {
      about: {
        fr: '/a-propos'
      },
      services: {
        fr: '/offres'
      },
      'services-development': {
        fr: '/offres/developement'
      },
      'services-development-app': {
        fr: '/offres/developement/app'
      },
      'services-development-website': {
        fr: '/offres/developement/site-web'
      },
      'services-coaching': {
        fr: '/offres/formation'
      }
    }
  }
})
```

If a custom path is missing for one of the locales, the `defaultLocale` custom path is used, if set.
