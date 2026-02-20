### Disable localized routes

::code-group
```vue [about-meta.vue]
// pages/about.vue
<script setup>
definePageMeta({ i18n: false })
</script>
```

```vue [about-macro.vue]
// pages/about.vue
<script setup>
defineI18nRoute(false)
</script>
```

```ts [nuxt.config.ts]
i18n: {
  customRoutes: 'config',
  pages: {
    about: false
  }
}
```
::


# Browser language detection

By default, Nuxt i18n module attempts to redirect users to their preferred language by detecting their browser's language. This is controlled by the `detectBrowserLanguage` option.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  i18n: {
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root' // recommended
    }
  }
})
```

::callout{icon="i-heroicons-light-bulb"}
For better SEO, it's recommended to set `redirectOn` to `root` (which is the default value). When set, the language detection is only attempted when the user visits the root path (`'/'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}) of the site. This allows crawlers to access the requested page rather than being redirected away based on detected locale. It also allows linking to pages in specific locales.
::

Browser language is detected either from `navigator` when running on client-side, or from the `accept-language` HTTP header. Configured `locales` (or locales `language` and/or `code` when locales are specified in object form) are matched against locales reported by the browser (for example `en-US,en;q=0.9,no;q=0.8`). If there is no exact match for the full locale, the language code (letters before `-`) are matched against configured locales.

To prevent redirecting users every time they visit the app, **Nuxt i18n module** sets a cookie using the detected locale. You can change the cookie's name by setting `detectBrowserLanguage.cookieKey` option to whatever you'd like, the default is *i18n\_redirected*.

```ts [nuxt.config.ts]
i18n: {
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'my_custom_cookie_name'
  }
}
```

If you'd rather have users be redirected to their browser's language every time they visit the app, disable the cookie by setting `detectBrowserLanguage.useCookie` to `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  i18n: {
    detectBrowserLanguage: {
      useCookie: false
    }
  }
})
```

To completely disable the browser's language detection feature, set `detectBrowserLanguage` to `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  i18n: {
    // ...
    detectBrowserLanguage: false
  }
})
```

To redirect the user every time they visit the app and keep their selected choice, enable `alwaysRedirect`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  i18n: {
    // ...
    detectBrowserLanguage: {
      useCookie: true,
      alwaysRedirect: true
    }
  }
})
```

To use the cookie within a cross-origin environment (e.g. in an iFrame), you can set `cookieCrossOrigin: true`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}. This will change the cookie settings from `'SameSite=Lax'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} to `'SameSite=None; Secure'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  i18n: {
    detectBrowserLanguage: {
      useCookie: true,
      cookieCrossOrigin: true
    }
  }
})
```


# SEO

**Nuxt i18n module** provides the `useLocaleHead()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} composable function. Calling this composable function returns a function which you can use to generate SEO metadata to optimize locale-related aspects of the app for the search engines.

Here are the specific optimizations and features that it enables:

- `lang` attribute for the `<html>`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="html"} tag
- `hreflang` alternate link generation
- OpenGraph locale tag generation
- canonical link generation

[Read more about those features below](https://i18n.nuxtjs.org/#feature-details)

## Requirements

To leverage the SEO benefits, you must configure the `locales` option as an array of objects, where each object has an `language` option set to the locale language tags:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  i18n: {
    locales: [
      {
        code: 'en',
        language: 'en-US'
      },
      {
        code: 'es',
        language: 'es-ES'
      },
      {
        code: 'fr',
        language: 'fr-FR'
      }
    ]
  }
})
```

You must also set the `baseUrl` option to your production domain in order to make alternate URLs fully-qualified:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  i18n: {
    baseUrl: 'https://my-nuxt-app.com'
  }
})
```

(Note that `baseUrl` can also be set to a function. Check [`baseUrl` documentation](https://i18n.nuxtjs.org/docs/api/options#baseurl).)

## Setup

The `useLocaleHead()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} is a composable function, Calling that composable function returns a function that returns metadata that is handled by [Head management](https://nuxt.com/docs/getting-started/seo-meta){rel="&#x22;nofollow&#x22;"} that is integrated within Nuxt. That metadata can be specified by the `setup` function in various places within Nuxt:

- [`app.vue`](https://nuxt.com/docs/guide/directory-structure/app){rel="&#x22;nofollow&#x22;"}
- Vue components of [`pages`](https://nuxt.com/docs/guide/directory-structure/pages){rel="&#x22;nofollow&#x22;"} directory
- Vue components of [`layouts`](https://nuxt.com/docs/guide/directory-structure/layouts){rel="&#x22;nofollow&#x22;"} directory

To enable SEO metadata, declare a `setup` function in one of the places specified above and make it return the result of a `useLocaleHead()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} function call.

To avoid duplicating the code, it's recommended to set globally with [Meta Components](https://nuxt.com/docs/getting-started/seo-meta#components){rel="&#x22;nofollow&#x22;"} in [layout components](https://nuxt.com/docs/guide/directory-structure/layouts){rel="&#x22;nofollow&#x22;"} and override some values per-page Vue component like [`definePageMeta()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}](https://nuxt.com/docs/guide/directory-structure/pages#page-metadata){rel="&#x22;nofollow&#x22;"}, if necessary.

::code-group
```vue [app.vue]
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

```vue [layouts/default.vue]
<script setup>
const route = useRoute()
const { t } = useI18n()
const head = useLocaleHead()
const title = computed(() => t(route.meta.title ?? 'TBD', t('layouts.title'))
);
</script>

<template>
  <div>
    <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
      <Head>
        <Title>{{ title }}</Title>
        <template v-for="link in head.link" :key="link.key">
          <Link :id="link.key" :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
        </template>
        <template v-for="meta in head.meta" :key="meta.key">
          <Meta :id="meta.key" :property="meta.property" :content="meta.content" />
        </template>
      </Head>
      <Body>
        <slot />
      </Body>
    </Html>
  </div>
</template>
```

```vue [pages/index.vue]
<script setup>
definePageMeta({
  title: 'pages.title.top' // set resource key
})

const { locale, locales, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => {
  return locales.value.filter(i => i.code !== locale.value)
})
</script>

<template>
  <div>
    <p>{{ t('pages.top.description') }}</p>
    <p>{{ t('pages.top.languages') }}</p>
    <nav>
      <template v-for="(locale, index) in availableLocales" :key="locale.code">
        <span v-if="index"> | </span>
        <NuxtLink :to="switchLocalePath(locale.code)">
          {{ locale.name ?? locale.code }}
        </NuxtLink>
      </template>
    </nav>
  </div>
</template>
```
::

Check out the options you can pass to the `useLocaleHead()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} in the [composable documentation](https://i18n.nuxtjs.org/docs/composables/use-locale-head#options)

That's it!

If you also want to add your own metadata, you have to call `useHead()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}. When you call `useHead()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} with the additional metadata, `useHead()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} will merge it global metadata that has already defined.

```vue [pages/about/index.vue]
<script setup>
// define page meta for layouts/default.vue
definePageMeta({
  title: 'pages.title.about'
})

useHead({
  meta: [{ property: 'og:title', content: 'this is og title for about page' }]
})
</script>

<template>
  <h2>{{ $t('pages.about.description') }}</h2>
</template>
```

## Feature details

- `lang` attribute for the `<html>`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="html"} tag :br Sets the correct `lang` attribute, equivalent to the current locale's `language` value, in the `<html>`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="html"} tag.
- `hreflang` alternate link :br Generates `<link rel="alternate" hreflang="x">`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="html"} tags for every configured locale. The locales' `language` value are used as `hreflang` values. :br A "catchall" locale hreflang link is provided for each locale group (e.g. `en-*`). By default, it is the first locale provided, but another locale can be selected by setting `isCatchallLocale` to `true`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} on that specific locale object in your **Nuxt i18n module** configuration. [More on hreflang](https://support.google.com/webmasters/answer/189077){rel="&#x22;nofollow&#x22;"}:br An example without selected "catchall" locale:
  ```ts \[nuxt.config.ts]
  export default defineNuxtConfig({
    i18n: {
      locales: [
        {
          code: 'en',
          language: 'en-US' // Will be used as "catchall" locale by default
        },
        {
          code: 'gb',
          language: 'en-GB'
        }
      ]
    }
  })
  ```
  :brHere is how you'd use `isCatchallLocale` to selected another locale:
  ```ts \[nuxt.config.ts]
  export default defineNuxtConfig({
    i18n: {
      locales: [
        {
          code: 'en',
          language: 'en-US'
        },
        {
          code: 'gb',
          language: 'en-GB',
          isCatchallLocale: true // This one will be used as catchall locale
        }
      ]
    }
  })
  ```
  :brIn case you already have an `en` locale `language` set, it'll be used as the "catchall" without doing anything
  ```ts \[nuxt.config.ts]
  export default defineNuxtConfig({
    i18n: {
      locales: [
        {
          code: 'gb',
          language: 'en-GB'
        },
        {
          code: 'en',
          language: 'en' // will be used as "catchall" locale
        }
      ]
    }
  })
  ```
- OpenGraph Locale tag generation :br Generates `og:locale` and `og:locale:alternate` meta tags as defined in the [Open Graph protocol](http://ogp.me/#optional){rel="&#x22;nofollow&#x22;"}.
- Canonical link :br Generates `rel="canonical"` link on all pages to specify the "main" version of the page that should be indexed by search engines. This is beneficial in various situations:
  - When using the `prefix_and_default` strategy there are technically two sets of pages generated for the default locale -- one prefixed and one unprefixed. The canonical link will be set to the unprefixed version of the page to avoid duplicate indexation.
  - When the page contains query parameters, the canonical link will **not include** the query params by default. This is typically the right thing to do as various query params can be inserted by trackers and should not be part of the canonical link. This can be overridden by using the `canonicalQueries` option. For example:
    ```vue
    <script setup>
    const i18nHead = useLocaleHead({ seo: { canonicalQueries: ['foo'] } })
    useHead(() => ({
      htmlAttrs: {
        lang: i18nHead.value.htmlAttrs.lang
      },
      link: [...(i18nHead.value.link || [])],
      meta: [...(i18nHead.value.meta || [])]
    }))
    </script>
    ```
  :br[More on canonical](https://support.google.com/webmasters/answer/182192#dup-content){rel="&#x22;nofollow&#x22;"}


# Lazy-load translations

For apps with a lot of translated content, it is preferable not to bundle all the messages in the main bundle but rather lazy-load only the language that the users selected.
This can be achieved with **Nuxt i18n module** by letting the module know where your translation files are located so it can dynamically import them when the app loads or when the user switches to another language.
To enable translations lazy-loading, follow these steps when configuring **Nuxt i18n module**:

- Configure `locales` option as an array of objects, where each object has a `file` or `files` key whose value is the translation file corresponding to the locale.
- Optionally, remove all messages that you might have passed to Vue I18n via the `vueI18n` option.
- Each `file` or `files` can return either an `Object`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}, or a function that returns `Promise`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} which must return an `Object`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}.

## Basic usage

Example files structure:

```bash
-| nuxt-project/
---| i18n/
-----| locales/
-------| en-US.json
-------| es-ES.js
-------| fr-FR.ts
---| nuxt.config.ts
```

Configuration example:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en-US.json'
      },
      {
        code: 'es',
        file: 'es-ES.js'
      },
      {
        code: 'fr',
        file: 'fr-FR.ts'
      }
    ],
    defaultLocale: 'en'
  }
})
```

```ts [i18n/locales/fr-FR.ts]
export default defineI18nLocale(async locale => {
  return {
    welcome: 'Bienvenue'
  }
})

// or

export default {
  welcome: 'Bienvenue'
}
```

::callout{icon="i-heroicons-light-bulb"}
If your function returns an object of locale messages, **you must define it in the `defineI18nLocale()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} composable function**.

About `defineI18nLocale()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} details, see the [here](https://i18n.nuxtjs.org/docs/composables/define-i18n-locale).
::

If the function returns an Object available in nuxt i18n module, you can configure the dynamic locale messages, like the API (including external API) or back-end, via fetch:

```ts
export default defineI18nLocale(locale => {
  // for example, fetch locale messages from nuxt server
  return $fetch(`/api/${locale}`)
})
```

## Multiple files lazy loading

The `files` property can be used to lazy load multiple files.

This is useful because it is efficient to manage multiple files that only define differences without duplicating locale messages.

For example, let’s take the case of supporting the Spanish language. According to [wikipedia](https://en.wikipedia.org/wiki/Spanish_language#Geographical_distribution){rel="&#x22;nofollow&#x22;"}, there are **20 countries** where Spanish is spoken as an official language!

If these countries are all configured using `file`, it would be difficult to maintain due to the duplication of locale messages for each country.

In this scenario, it would be easier to keep all shared (common) locale messages for the target language in a separate file and define dialectal variations for each country separately is well to prevent duplication, which is easier to maintain.

The following is an example of a lang directory containing locale files for the Spanish language:

```bash
-| nuxt-project/
---| i18n/
-----| locales/
-------| es.json    # locale messages for common Spanish
-------| es-AR.json # locale messages for Argentina
-------| es-UY.json # locale messages for Uruguay
-------| es-US.json # locale messages for Estados Unidos
-------| ...        # other countries
---| nuxt.config.ts
```

The following is an example of the configuration in `nuxt.config.ts`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  i18n: {
    locales: [
      /**
       * Example definition with `files` for Spanish speaking countries
       */
      {
        code: 'es-AR',
        name: 'Español (Argentina)',
        // lazy loading order: `es.json` -> `es-AR.json`, and then merge 'es-AR.json' with 'es.json'
        files: ['es.json', 'es-AR.json']
      },
      {
        code: 'es-UY',
        name: 'Español (Uruguay)',
        // lazy loading order: `es.json` -> `es-UY.json`, and then merge 'es-UY.json' with 'es.json'
        files: ['es.json', 'es-UY.json']
      },
      {
        code: 'es-US',
        name: 'Español (Estados Unidos)',
        // lazy loading order: `es.json` -> `es-US.json`, and then merge 'es-US.json' with 'es.json'
        files: ['es.json', 'es-US.json']
      }
    ],
    defaultLocale: 'en'
  }
})
```

Please note the usage of the `files` property, as the above configuration specifies an array containing multiple file names.

@nuxtjs/i18n will load locale messages with lazy loading in the order of the array specified in `files`. It then overrides the locale messages in the order in which they were loaded.

In the above `es-AR` example, which has `es.json` and `es-AR.json` defined in `files`. In this case, @nuxtjs/i18n lazy-loads `es.json`, then it lazy-loads `es-AR.json` and overrides `es.json` locale messages.

In the example above, only two files are defined for `files`, of course you can specify more files over 2 files. In that case, the files will be loaded and override in array order too.

By taking advantage of the characteristic that locale messages are overridden in sequence, it's possible to manage locale messages by defining them on a differential basis. By adding shared (common) locale messages as the first entry of `files`, followed by file entries of regional/dialectal locale messages, it's possible to manage resources while avoiding the duplication of locale messages.

## Caching

Lazy loaded locale messages are cached based on their filename, `file` and `files` shared across locales will be used from cache once loaded. By default caching is enabled for static files, and disabled for files that return messages via a function.

Caching can be configured per file by setting `file` or entries of `files` to objects with the following type signature `{ path: string, cache?: boolean}`. The example below demonstrates several valid file configurations.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  i18n: {
    locales: [
      /**
       * Example definition with `files` for Spanish speaking countries
       */
      {
        code: 'es-ES',
        name: 'Español (Spain)',
        // file with cache disabled
        file: { path: 'es.js', cache: false }
      },
      {
        code: 'es-AR',
        name: 'Español (Argentina)',
        // files with cache disabled
        files: [
          { path: 'es.js', cache: false },
          { path: 'es-AR.js', cache: false }
        ]
      },
      {
        code: 'es-UY',
        name: 'Español (Uruguay)',
        // strings and object configurations can be mixed
        files: [{ path: 'es.js', cache: false }, 'es-UY.json']
      }
    ],
    defaultLocale: 'en'
  }
})
```

## Using translations of non-loaded locale

As only the current locale translations are loaded you have to manually load a locale to be able to use its translations.

Nuxt i18n extends Vue i18n to provide the `loadLocaleMessages` function to manually load locale messages, the example below demonstrates its usage.

```ts
const { loadLocaleMessages, t } = useI18n()

await loadLocaleMessages('nl')

const welcome = computed(() => t('welcome')) // Welcome!
const welcomeDutch = computed(() => t('welcome', 1, { locale: 'nl' })) // Welkom!
```

::callout{icon="i-heroicons-light-bulb"}
As messages could be loaded from a remote API invoking the `loadLocaleMessages` function will always load messages, unnecessary loading can impact performance.
::


# Lang Switcher

When **Nuxt i18n module** is loaded in your app, it adds your `locales` configuration to `nuxtApp.$i18n` (or `this.$i18n`), which makes it really easy to display a lang switcher anywhere in your app.

Here's an example of a lang switcher where a `name` key has been added to each locale object in order to display friendlier titles for each link:

```vue
<script setup>
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => {
  return locales.value.filter(i => i.code !== locale.value)
})
</script>

<template>
  <NuxtLink v-for="locale in availableLocales" :key="locale.code" :to="switchLocalePath(locale.code)">
    {{ locale.name }}
  </NuxtLink>
</template>
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English'
      },
      {
        code: 'es',
        name: 'Español'
      },
      {
        code: 'fr',
        name: 'Français'
      }
    ]
  }
})
```

::callout{icon="i-heroicons-light-bulb"}
To persist the locale on a route change when using `detectBrowserLanguage`, you must explicitly update the stored locale cookie. This is done with [`setLocaleCookie(locale)`](https://i18n.nuxtjs.org/docs/api/vue-i18n#setlocalecookie) or [`setLocale(locale)`](https://i18n.nuxtjs.org/docs/api/vue-i18n#setlocale), which sets the cookie and switches to the route of the specified locale. Not doing so can cause redirects based on the locale set on the locale cookie during navigation.
::

The template code might look like this, for example:

```vue
<script setup>
const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => {
  return locales.value.filter(i => i.code !== locale.value)
})
</script>

<template>
  ...
  <a href="#" v-for="locale in availableLocales" :key="locale.code" @click.prevent.stop="setLocale(locale.code)">
    {{ locale.name }}
  </a>
  ...
</template>
```

## Wait for page transition

By default, the locale will be changed right away when navigating to a route with a different locale which means that if you have a page transition, it will fade out the page with the text already switched to the new language and fade back in with the same content.

To work around the issue, you can set the option [`skipSettingLocaleOnNavigate`](https://i18n.nuxtjs.org/docs/api/options#skipsettinglocaleonnavigate) to `true`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} and handle setting the locale yourself from a `onBeforeEnter` transition hook defined in a plugin.
