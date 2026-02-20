# Configuration

By default, Nuxt is configured to cover most use cases. The [`nuxt.config.ts`](https://nuxt.com/docs/4.x/directory-structure/nuxt-config) file can override or extend this default configuration.

## Nuxt Configuration

The [`nuxt.config.ts`](https://nuxt.com/docs/4.x/directory-structure/nuxt-config) file is located at the root of a Nuxt project and can override or extend the application's behavior.

A minimal configuration file exports the `defineNuxtConfig` function containing an object with your configuration. The `defineNuxtConfig` helper is globally available without import.

```ts [nuxt.config.ts] twoslash
export default defineNuxtConfig({
  // My Nuxt config
})
```

This file will often be mentioned in the documentation, for example to add custom scripts, register modules or change rendering modes.

::read-more{to="https://nuxt.com/docs/4.x/api/configuration/nuxt-config"}
Every option is described in the **Configuration Reference**.
::

::note
You don't have to use TypeScript to build an application with Nuxt. However, it is strongly recommended to use the `.ts` extension for the `nuxt.config` file. This way you can benefit from hints in your IDE to avoid typos and mistakes while editing your configuration.
::

### Environment Overrides

You can configure fully typed, per-environment overrides in your nuxt.config

```ts [nuxt.config.ts] twoslash
export default defineNuxtConfig({
  $production: {
    routeRules: {
      '/**': { isr: true },
    },
  },
  $development: {
    //
  },
  $env: {
    staging: {
      //
    },
  },
})
```

To select an environment when running a Nuxt CLI command, simply pass the name to the `--envName` flag, like so: `nuxt build --envName staging`.

To learn more about the mechanism behind these overrides, please refer to the `c12` documentation on [environment-specific configuration](https://github.com/unjs/c12?tab=readme-ov-file#environment-specific-configuration){rel="&#x22;nofollow&#x22;"}.

:video-accordion{title="Watch a video from Alexander Lichter about the env-aware nuxt.config.ts" video-id="DFZI2iVCrNc"}

::note
If you're authoring layers, you can also use the `$meta` key to provide metadata that you or the consumers of your layer might use.
::

### Environment Variables and Private Tokens

The `runtimeConfig` API exposes values like environment variables to the rest of your application. By default, these keys are only available server-side. The keys within `runtimeConfig.public` and `runtimeConfig.app` (which is used by Nuxt internally) are also available client-side.

Those values should be defined in `nuxt.config` and can be overridden using environment variables.

::code-group
```ts [nuxt.config.ts] twoslash
export default defineNuxtConfig({
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: '123',
    // Keys within public are also exposed client-side
    public: {
      apiBase: '/api',
    },
  },
})
```

```ini [.env]
