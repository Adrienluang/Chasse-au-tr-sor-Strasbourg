### Opting out

Update `@nuxtjs/i18n` dependency in your `package.json`:

```diff [package.json]
{
  "devDependencies": {
-   "@nuxtjs/i18n": "npm:@nuxtjs/i18n-edge"
+   "@nuxtjs/i18n": "^9.0.0"
  }
}
```

Remove lockfile (`package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`) and reinstall dependencies.


# Usage

## Basic setup

Let's start by configuring the project `locales` and the `defaultLocale` in the nuxt config.

For this project we configure the locales with the following properties:

- `code`: required property, the locale code is used throughout Nuxt I18n and is used as the identifier for the locale.
- `name`: name of the locale, this is a user-friendly way to identify the locale.
- `file`: a file that provides translation messages in the form of an object.

The `defaultLocale` should be set to the `code` of one of the configured locales, setting this is optional but recommended as it will be used as fallback when navigating to a non-existent route.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'nl', name: 'Nederlands', file: 'nl.json' }
    ]
  }
})
```

A typical project has at least one `file` for each configured locale, this file provides the translation messages in the form of an object.

Nuxt I18n has a (configurable) folder structure from which the locale files are sourced, the locale files should be created in `<rootDir>/i18n/locales` by default.

::code-group
```json [i18n/locales/en.json]
{
  "welcome": "Welcome"
}
```

```json [i18n/locales/nl.json]
{
  "welcome": "Welkom"
}
```
::

With this configuration we can add a basic language switcher and translate our first message using:

```vue [pages/index.vue]
<script setup>
const { locales, setLocale } = useI18n()
</script>

<template>
  <div>
    <button v-for="locale in locales" @click="setLocale(locale.code)">
      {{ locale.name }}
    </button>
    <h1>{{ $t('welcome') }}</h1>
  </div>
</template>
```

Using the configured locales we created a simple language-switcher, by clicking a `<button>` element you can switch between English and Dutch and see the "welcome" message and page URL change to its corresponding language.

You now have a basic setup to get started with fully localizing your Nuxt Application!

## Auto Imports

Some composable functions such as `useI18n` are [auto-imported by Nuxt](https://nuxt.com/docs/guide/concepts/auto-imports#auto-imports){rel="&#x22;nofollow&#x22;"}.
If you have disabled `autoImports` you will need to import these explicitly from `#imports` as follows:

```vue
<script setup>
import { useI18n, useLocalePath } from '#imports'
// ...
</script>
```

## Route localization

Nuxt I18n generates localized routes for each locale, in the most basic setup this comes in the form of a prefixed variant of each route with a locale code.

When linking to routes within your app, you will need to get the localized route for the current locale. This is done with utility functions provided by Nuxt I18n.
