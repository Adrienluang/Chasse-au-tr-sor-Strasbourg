### Per page component transition

If you have a specific transition defined in a page component with [`definePageMeta()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}](https://nuxt.com/docs/guide/directory-structure/pages#page-metadata){rel="&#x22;nofollow&#x22;"} and need to add `finalizePendingLocaleChange` at `onBeforeEnter` hook for `pageTransition`.

Example:

```vue [pages/about.vue]
<script setup lang="ts">
const route = useRoute()
const { finalizePendingLocaleChange } = useI18n()

definePageMeta({
  pageTransition: {
    name: 'page',
    mode: 'out-in'
  }
})

route.meta.pageTransition.onBeforeEnter = async () => {
  await finalizePendingLocaleChange()
}
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 1s;
}
.page-enter,
.page-leave-active {
  opacity: 0;
}
</style>
```

## Vue i18n caveat

In contrast to Vue i18n you should not directly set `locale`, switch language by using [`setLocale()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}](https://i18n.nuxtjs.org/docs/api/vue-i18n#setlocale) or navigating to a route returned by [`switchLocalePath()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}](https://i18n.nuxtjs.org/docs/composables/use-switch-locale-path). This loads translations, triggers hooks and updates the locale cookie if used.


# Different Domains

You might want to use a different domain name for each language your app supports.

Here is how to achieve this:

- Set `differentDomains` option to `true`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}
- Configure the `locales` option as an array of objects, where each object has a `domain` key whose value is the domain name you'd like to use for that locale. Optionally include a port (if non-standard) and/or a protocol. If the protocol is not provided then an attempt will be made to auto-detect it but that might not work correctly in some cases like when the pages are statically generated.
- Optionally set `detectBrowserLanguage` to `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}. When enabled (which it is by default), user can get redirected to a different domain on first visit. Set to `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} if you want to ensure that visiting given domain always shows page in the corresponding locale.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  i18n: {
    locales: [
      {
        code: 'en',
        domain: 'mydomain.com'
      },
      {
        code: 'es',
        domain: 'es.mydomain.com'
      },
      {
        code: 'fr',
        domain: 'fr.mydomain.com'
      },
      {
        code: 'pl',
        domain: 'http://pl.mydomain.com'
      },
      {
        code: 'ua',
        domain: 'https://ua.mydomain.com'
      }
    ],
    differentDomains: true
    // Or enable the option in production only
    // differentDomains: (process.env.NODE_ENV === 'production')
  }
})
```

When using different domain names, your lang switcher should use regular `<a>`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="html"} tags:

```vue
<script setup>
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => {
  return locales.value.filter(i => i.code !== locale.value)
})
</script>

<template>
  ...
  <a v-for="locale in availableLocales" :href="switchLocalePath(locale.code)" :key="locale.code">
    {{ locale.code }}
  </a>
  ...
</template>
```

## Runtime environment variables

Sometimes there's a need to change domains in different environments, e.g. staging and production.
As `nuxt.config.ts` is used at build time it would be necessary to create different builds for different environments.

```ts [locale-domains.config.ts]
export const localeDomains = {
  uk: process.env.DOMAIN_UK,
  fr: process.env.DOMAIN_FR
}
```

```ts [nuxt.config.ts]
import { localeDomains } from './locale-domains.config'

export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],

  i18n: {
    differentDomains: process.env.NODE_ENV === 'production',
    locales: [
      {
        code: 'uk',
        domain: localeDomains.uk
      },
      {
        code: 'fr',
        domain: localeDomains.fr
      }
    ]
  }
})
```

With the above config, a build would have to be run for staging and production with different .env files that specify `DOMAIN_UK` and `DOMAIN_FR`.

Alternatively, to avoid the need for multiple builds, the locale domains can be overridden via runtime environment variables. The variable name should follow the format `NUXT_PUBLIC_I18N_DOMAIN_LOCALES_{code}_DOMAIN`

For example:

```shell [production.env]
NUXT_PUBLIC_I18N_DOMAIN_LOCALES_UK_DOMAIN=uk.example.test
NUXT_PUBLIC_I18N_DOMAIN_LOCALES_FR_DOMAIN=fr.example.test
```

```shell [staging.env]
NUXT_PUBLIC_I18N_DOMAIN_LOCALES_UK_DOMAIN=uk.staging.example.test
NUXT_PUBLIC_I18N_DOMAIN_LOCALES_FR_DOMAIN=fr.staging.example.test
```

## Using different domains for only some of the languages

If one or more of the domains need to host multiple languages, the default language of each domain needs to have `domainDefault: true`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} so there is a per domain fallback locale.
The option `differentDomains` still need to be set to `true`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} though.

```js [nuxt.config.js]
export default defineNuxtConfig({
  // ...
  i18n: {
    locales: [
      {
        code: 'en',
        domain: 'mydomain.com',
        domainDefault: true
      },
      {
        code: 'pl',
        domain: 'mydomain.com'
      },
      {
        code: 'ua',
        domain: 'mydomain.com'
      },
      {
        code: 'es',
        domain: 'es.mydomain.com',
        domainDefault: true
      },
      {
        code: 'fr',
        domain: 'fr.mydomain.com',
        domainDefault: true
      }
    ],
    strategy: 'prefix',
    differentDomains: true
    // Or enable the option in production only
    // differentDomains: (process.env.NODE_ENV === 'production')
  },
  // ...
})
```

Given above configuration with the `'prefix'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} strategy, following requests will be:

- <https://mydomain.com>{rel="&#x22;nofollow&#x22;"} -> <https://mydomain.com/en>{rel="&#x22;nofollow&#x22;"} (en language)
- <https://mydomain.com/pl>{rel="&#x22;nofollow&#x22;"} -> <https://mydomain.com/pl>{rel="&#x22;nofollow&#x22;"} (pl language)
- <https://mydomain.com/ua>{rel="&#x22;nofollow&#x22;"} -> <https://mydomain.com/ua>{rel="&#x22;nofollow&#x22;"} (ua language)
- <https://es.mydomain.com>{rel="&#x22;nofollow&#x22;"} -> <https://es.mydomain.com/es>{rel="&#x22;nofollow&#x22;"} (es language)
- <https://fr.mydomain.com>{rel="&#x22;nofollow&#x22;"} -> <https://fr.mydomain.com/fr>{rel="&#x22;nofollow&#x22;"} (fr language)

The same requests when using the `'prefix_except_default'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} strategy, will be:

- <https://mydomain.com>{rel="&#x22;nofollow&#x22;"} -> <https://mydomain.com>{rel="&#x22;nofollow&#x22;"} (en language)
- <https://mydomain.com/pl>{rel="&#x22;nofollow&#x22;"} -> <https://mydomain.com/pl>{rel="&#x22;nofollow&#x22;"} (pl language)
- <https://mydomain.com/ua>{rel="&#x22;nofollow&#x22;"} -> <https://mydomain.com/ua>{rel="&#x22;nofollow&#x22;"} (ua language)
- <https://es.mydomain.com>{rel="&#x22;nofollow&#x22;"} -> <https://es.mydomain.com>{rel="&#x22;nofollow&#x22;"} (es language)
- <https://fr.mydomain.com>{rel="&#x22;nofollow&#x22;"} -> <https://fr.mydomain.com>{rel="&#x22;nofollow&#x22;"} (fr language)

## Caching considerations with different domains

When using different domains, make sure to configure caching properly so that
responses are correctly separated per domain.

Because the same route may be served under multiple domains (e.g. `en.mydomain.com`
and `fr.mydomain.com`), caches need to vary by the request host. Otherwise,
a response generated for one domain could be reused on another, causing the wrong language to render,
leading to hydration mismatches and visible flashes on the client.

The recommended setup is to use `cache.varies: ['host']` in your route rules,
so that the `host` header is included in the cache key:

```diff [nuxt.config.ts]
export default defineNuxtConfig({
  routeRules: {
-    '/': { swr: 60 },
+    '/': { swr: 60, cache: { varies: ['host'] } },
  },
  // ...
})
```


# Multi domain locales

How to set up multi domain locales:

- Set the `multiDomainLocales` option to `true`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}
- Configure the `locales`option as an array of objects:
  - Each object has a `domains` key whose value is a array of the domains you'd like to use for that locale. Optionally include a port (if non-standard) and/or a protocol. If the protocol is not provided then an attempt will be made to auto-detect it but that might not work correctly in some cases like when the pages are statically generated.
  - Optionally set for each object a `defaultForDomains` key whose value is a array of the default domains you'd like to use for that locale. Optionally include a port (if non-standard) and/or a protocol. If the protocol is not provided then an attempt will be made to auto-detect it but that might not work correctly in some cases like when the pages are statically generated.
- Optionally set `detectBrowserLanguage` to `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}. When enabled (which it is by default), user can get redirected to a different domain on first visit. Set to `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} if you want to ensure that visiting given domain always shows page in the corresponding locale.

```ts [nuxt.config.ts]
const i18nDomains = ['mydomain.com', 'es.mydomain.com', 'fr.mydomain.com', 'http://pl.mydomain.com', 'https://ua.mydomain.com']

export default defineNuxtConfig({
  i18n: {
    locales: [
      {
        code: 'en',
        domains: i18nDomains,
        defaultForDomains: ['mydomain.com']
      },
      {
        code: 'es',
        domains: i18nDomains,
        defaultForDomains: ['es.mydomain.com']
      },
      {
        code: 'fr',
        domains: i18nDomains,
        defaultForDomains: ['fr.mydomain.com']
      },
      {
        code: 'pl',
        domains: i18nDomains,
        defaultForDomains: ['http://pl.mydomain.com']
      },
      {
        code: 'ua',
        domains: i18nDomains,
        defaultForDomains: ['https://ua.mydomain.com']
      },
      {
        code: 'nl',
        domains: i18nDomains
      },
      {
        code: 'de',
        domains: i18nDomains
      },
    ],
    multiDomainLocales: true
  }
})
```

## Runtime environment variables

Sometimes there's a need to change domains in different environments, e.g. staging and production.
As `nuxt.config.ts` is used at build time it would be necessary to create different builds for different environments.

```ts [locale-domains.config.ts]
export const localeDomains = {
  uk: process.env.DOMAIN_UK,
  fr: process.env.DOMAIN_FR
}
```

```ts [nuxt.config.ts]
import { localeDomains } from './locale-domains.config'

const i18nDomains = [localeDomains.uk, localeDomains.fr]

export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],

  i18n: {
    multiDomainLocales: true,
    locales: [
      {
        code: 'uk',
        domains: i18nDomains,
        defaultForDomains: [localeDomains.uk]
      },
      {
        code: 'fr',
        domains: i18nDomains,
        defaultForDomains: [localeDomains.fr]
      }
    ]
  }
})
```

With the above config, a build would have to be run for staging and production with different .env files that specify `DOMAIN_UK` and `DOMAIN_FR`.

## Using different domains for only some of the languages

If multiple domains share the same default language, you can specify them all using `defaultForDomains`, which supports multiple domains.

```js [nuxt.config.js]
const i18nDomains = ['mydomain.com', 'en.mydomain.com', 'es.mydomain.com', 'fr.mydomain.com', 'http://pl.mydomain.com', 'https://ua.mydomain.com']

export default defineNuxtConfig({
  // ...
  i18n: {
    locales: [
      {
        code: 'en',
        domains: i18nDomains,
        defaultForDomains: ['mydomain.com', 'en.mydomain.com']
      },
      {
        code: 'es',
        domains: i18nDomains,
        defaultForDomains: ['es.mydomain.com']
      },
      {
        code: 'fr',
        domains: i18nDomains,
        defaultForDomains: ['fr.mydomain.com']
      },
      {
        code: 'pl',
        domains: i18nDomains,
        defaultForDomains: ['http://pl.mydomain.com']
      },
      {
        code: 'ua',
        domains: i18nDomains,
        defaultForDomains: ['https://ua.mydomain.com']
      },
      {
        code: 'nl',
        domains: i18nDomains
      },
      {
        code: 'de',
        domains: i18nDomains
      },
    ],
    strategy: 'prefix',
    multiDomainLocales: true
  },
  // ...
})
```

Given above configuration with the `'prefix'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} strategy, following requests will be:

- <https://mydomain.com>{rel="&#x22;nofollow&#x22;"} -> <https://mydomain.com/en>{rel="&#x22;nofollow&#x22;"} (en language)
- <https://mydomain.com/pl>{rel="&#x22;nofollow&#x22;"} -> <https://mydomain.com/pl>{rel="&#x22;nofollow&#x22;"} (pl language)
- <https://mydomain.com/ua>{rel="&#x22;nofollow&#x22;"} -> <https://mydomain.com/ua>{rel="&#x22;nofollow&#x22;"} (ua language)
- <https://mydomain.com/nl>{rel="&#x22;nofollow&#x22;"} -> <https://mydomain.com/nl>{rel="&#x22;nofollow&#x22;"} (nl language)
- <https://en.mydomain.com>{rel="&#x22;nofollow&#x22;"} -> <https://en.mydomain.com/en>{rel="&#x22;nofollow&#x22;"} (en language)
- <https://es.mydomain.com>{rel="&#x22;nofollow&#x22;"} -> <https://es.mydomain.com/es>{rel="&#x22;nofollow&#x22;"} (es language)
- <https://fr.mydomain.com>{rel="&#x22;nofollow&#x22;"} -> <https://fr.mydomain.com/fr>{rel="&#x22;nofollow&#x22;"} (fr language)
- <https://fr.mydomain.com/de>{rel="&#x22;nofollow&#x22;"} -> <https://fr.mydomain.com/de>{rel="&#x22;nofollow&#x22;"} (de language)

The same requests when using the `'prefix_except_default'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} strategy, will be:

- <https://mydomain.com>{rel="&#x22;nofollow&#x22;"} -> <https://mydomain.com>{rel="&#x22;nofollow&#x22;"} (en language)
- <https://mydomain.com/pl>{rel="&#x22;nofollow&#x22;"} -> <https://mydomain.com/pl>{rel="&#x22;nofollow&#x22;"} (pl language)
- <https://mydomain.com/ua>{rel="&#x22;nofollow&#x22;"} -> <https://mydomain.com/ua>{rel="&#x22;nofollow&#x22;"} (ua language)
- <https://mydomain.com/nl>{rel="&#x22;nofollow&#x22;"} -> <https://mydomain.com/nl>{rel="&#x22;nofollow&#x22;"} (nl language)
- <https://en.mydomain.com>{rel="&#x22;nofollow&#x22;"} -> <https://en.mydomain.com>{rel="&#x22;nofollow&#x22;"} (en language)
- <https://es.mydomain.com>{rel="&#x22;nofollow&#x22;"} -> <https://es.mydomain.com>{rel="&#x22;nofollow&#x22;"} (es language)
- <https://fr.mydomain.com>{rel="&#x22;nofollow&#x22;"} -> <https://fr.mydomain.com>{rel="&#x22;nofollow&#x22;"} (fr language)
- <https://fr.mydomain.com/de>{rel="&#x22;nofollow&#x22;"} -> <https://fr.mydomain.com/de>{rel="&#x22;nofollow&#x22;"} (de language)


# Locale fallback

**Nuxt i18n module** takes advantage of **Vue I18n** ability to handle localization fallback. It is possible to define a single fallback locale, an array of locales,
or a decision map for more specific needs.

```js [i18n/i18n.config.ts]
export default {
  fallbackLocale: 'en',
  // or
  fallbackLocale: ['en', 'fr'],
  // or
  fallbackLocale: {
    'de-CH': ['fr', 'it'],
    'zh-Hant': ['zh-Hans'],
    'es-CL': ['es-AR'],
    es: ['en-GB'],
    pt: ['es-AR'],
    default: ['en', 'da']
  }
  // ...
}
```

More information in [Vue I18n documentation](https://vue-i18n.intlify.dev/guide/essentials/fallback.html){rel="&#x22;nofollow&#x22;"}


# Per-Component Translations

If you'd like to define translations per-page or per-component you can take advantage of the i18n custom block.

You can now define translations using i18n custom blocks in your Vue files:

```vue [page.vue]
<script setup lang="ts">
const { t } = useI18n({
  useScope: 'local'
})
</script>

<template>
  <p>{{ t('hello') }}</p>
</template>

<i18n lang="json">
{
  "en": {
    "hello": "hello world!"
  },
  "ja": {
    "hello": "こんにちは、世界!"
  }
}
</i18n>
```

or using the Yaml syntax:

```vue [page.vue]
<!-- same script and template as above  -->
<i18n lang="yaml">
en:
  hello: 'hello world!'
ja:
  hello: 'こんにちは、世界!'
</i18n>
```

::callout{icon="i-heroicons-light-bulb"}
Read more about [i18n custom blocks](https://vue-i18n.intlify.dev/guide/advanced/sfc.html){rel=""nofollow""}
::

::callout{color="warning" icon="i-heroicons-exclamation-triangle"}
When you use per-component translations, you will need to use `t()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} exported by `useI18n()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}, **not `$t()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}**.
To read more about `$t()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} which isn't used in per-component translation, see the ["implicit with injected properties and functions" section of Vue I18n docs](https://vue-i18n.intlify.dev/guide/advanced/composition.html#implicit-with-injected-properties-and-functions){rel=""nofollow""}.
::


# Extending messages hook

If you're a **module author** and want that module to provide extra messages for your project, you can merge them into the normally loaded messages by using the `'i18n:registerModule'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} hook.

This is particularly useful if your module uses translated content and you want to offer nice default translations.

In your module's setup file listen to the Nuxt `'i18n:registerModule'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} hook and
register your i18n configuration, this is similar to how [lazy-load translations](https://i18n.nuxtjs.org/docs/guide/lazy-load-translations) are configured.

Translations added this way will be loaded after those added in your project, and before extended layers.

Example:

::code-group
```ts [my-module-example/module.ts]
import { createResolver, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.hook('i18n:registerModule', register => {
      register({
        // langDir path needs to be resolved
        langDir: resolve('./lang'),
        locales: [
          {
            code: 'en',
            file: 'en.json',
          },
          {
            code: 'fr',
            file: 'fr.json',
          },
        ]
      })
    })
  }
})
```

```json [en.json]
{
  "my-module-example": {
    "hello": "Hello from external module"
  }
}
```

```json [fr.json]
{
  "my-module-example": {
    "hello": "Bonjour depuis le module externe"
  }
}
```
::

Now the project has access to new messages and can use them through `$t('my-module-example.hello')`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}.

::callout{icon="i-heroicons-light-bulb"}
Because module's messages are merged with the project's ones, it's safer to prefix them. Main project messages **will always override** messages provided by modules.
::


# Extending pages

If you're a **module author** and want your module to add extra pages to your project, you can add these by using the `'pages:extend'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} Nuxt hook.

```ts [modules/example-module/index.ts]
import { defineNuxtModule, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.hook('pages:extend', pages => {
      pages.push({
        name: 'example-page',
        path: '/example-page',
        file: resolve(__dirname, './pages/example-page.vue')
      })
    })
  }
})
```


# Layers

Nuxt i18n module supports layers and will automatically combine i18n configuration of all extended layers. [Read more about layers here](https://nuxt.com/docs/getting-started/layers){rel="&#x22;nofollow&#x22;"}

## Merging strategy

As described in the [Nuxt layer authoring guide](https://nuxt.com/docs/guide/going-further/layers#multi-layer-support-for-nuxt-modules){rel="&#x22;nofollow&#x22;"}

> - Earlier items in the `_layers` array have higher priority and override later ones
> - The user's project is the first item in the `_layers` array

Mixing locale configuration such as lazy loading objects and strings may not work as expected, Nuxt i18n will attempt to merge layers as best it can. Consistency of i18n configuration between layers will be most effective.

## Pages & Routing

Pages in the `pages` directory from extended layers will automatically be merged and have i18n support as if they were part of your project.

Page routes defined in `i18n.pages` in each layer configuration will be merged as well.

## Locales

A project extending a layer set up with the Nuxt i18n module needs no additional set up as shown in this example:

::code-group
```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['my-layer']
})
```

```ts [my-layer/nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'nl', file: 'nl.json' }
    ]
  }
})
```
::

The project is able to use i18n functionality and the configured locales would be loaded provided by the extended layer.
