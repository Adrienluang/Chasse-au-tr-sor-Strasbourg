### `'i18n:registerModule'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} Hook

- **Arguments**:
  - registerModule (type: `({ langDir: string, locales: LocaleObject[] }) => void`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"})

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

See also [Extending messages hook](https://i18n.nuxtjs.org/docs/guide/extend-messages)


# Runtime config

Some options can be set via the `runtimeConfig`, setting options this way makes it possible to override these after building using environment variables.

## Usage

If you want to use environment variables to change [supported options](https://i18n.nuxtjs.org/#supported-options), you will have to set these in `runtimeConfig.public.i18n`.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
    modules: ['@nuxtjs/i18n'],
    i18n: {
        // Leave options unset that you want to set using `runtimeConfig`
        // baseUrl: 'https://example.com',
    },
    runtimeConfig: {
        public: {
            i18n: {
                baseUrl: 'https://example.com',
                domainLocales: {}
                // other options ...
            }
        }
    }
})
```

You can read more about how this works in the [Nuxt documentation](https://nuxt.com/docs/guide/going-further/runtime-config#environment-variables){rel="&#x22;nofollow&#x22;"}.

::callout{type="warning"}
Only [serializable values are supported](https://nuxt.com/docs/guide/going-further/runtime-config#serialization){rel=""nofollow""} in `runtimeConfig`, options set this way may not support all available types (such as functions) as would normally be possible using the default configuration.
::

::callout{type="info"}
If you would like other options to be supported, open an issue describing your use case, or open a PR adding to add support yourself!
::

## Supported options

The module configuration takes precedence, options set through `runtimeConfig` will only be used if they are unset.

These options can be set using `runtimeConfig`:
