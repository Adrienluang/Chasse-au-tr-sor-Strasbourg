### Browser Language Detection

Language detection and redirection have been improved to follow documented behavior strictly. In v9, some combinations of `strategy`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="yml"} and `redirectOn`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="yml"} options worked unexpectedly, which has been corrected in v10.

**Key Change**: When using `strategy: 'prefix'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} with `redirectOn: 'root'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} , non-root paths (e.g., `'/search'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}) will no longer automatically redirect to their localized versions (e.g., `'/zh/search'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}).

**Migration**: If you need redirection for all paths with a prefix strategy, update your configuration:

```diff
export default defineNuxtConfig({
  i18n: {
    strategy: 'prefix',
    detectBrowserLanguage: {
-      // redirectOn: 'root', // ⚠️ In v10 this will only redirect the root path
+      redirectOn: 'all',  // Redirects all paths as documented
    }
  }
})
```

**Impact**: This affects projects using `strategy: 'prefix'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} that relied on the previous unintended behavior where `redirectOn: 'root'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} also handled non-root paths.

See the [`redirectOn`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="yml"} documentation](https://i18n.nuxtjs.org/docs/api/options#redirecton) for more details about the available options.

## I18n functions

The following composables and [I18n functions](https://i18n.nuxtjs.org/docs/api/vue-i18n) have been changed, deprecated, or removed.

| Status | Function                                                                                                                                                                                | Notes                                                                                                                                                                                                                                                                                                                          |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|        | [`useLocaleHead()`{.language-ts.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="ts"}](https://i18n.nuxtjs.org/docs/composables/use-locale-head) | The `key`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"} property on the options parameter has been removed and can no longer be configured, this is necessary for predictable and consistent localized head tag management.                                      |
|        | `onLanguageSwitched()`{.language-ts.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="ts"}                                                        | Use the [`'i18n:localeSwitched'`{.language-ts.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="ts"}](https://i18n.nuxtjs.org/docs/guide/runtime-hooks) hook instead. :br:br This function actually called the hook instead of subscribing to it, leading to unpredictable behavior.     |
|        | `onBeforeLanguageSwitch()`{.language-ts.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="ts"}                                                    | Use the [`'i18n:beforeLocaleSwitch'`{.language-ts.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="ts"}](https://i18n.nuxtjs.org/docs/guide/runtime-hooks) hook instead. :br:br This function actually called the hook instead of subscribing to it, leading to unpredictable behavior. |

## Context functions

The following [context functions](https://i18n.nuxtjs.org/docs/api/nuxt) have been changed, deprecated, or removed.

| Status | Function                                                                                                                                                                      | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|        | [`$localeHead()`{.language-ts.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="ts"}](https://i18n.nuxtjs.org/docs/api/nuxt#localehead) | The `key`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"} property on the options parameter has been removed and can no longer be configured, this is necessary for predictable and consistent localized head tag management.                                                                                                                                                                                                                                                                                                                |
|        | [`$localeHead()`{.language-ts.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="ts"}](https://i18n.nuxtjs.org/docs/api/nuxt#localehead) | Use the `useLocaleHead()`{.language-ts.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="ts"} composable instead. :br:br Deprecated due to limited use cases, the [`useLocaleHead()`{.language-ts.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="ts"}](https://i18n.nuxtjs.org/docs/composables/use-locale-head) composable offers the same functionality and is easier to use in combination with `useHead()`{.language-ts.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="ts"}. |
|        | `$getRouteBaseName()`{.language-ts.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="ts"}                                               | Use [`$routeBaseName()`{.language-ts.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="ts"}](https://i18n.nuxtjs.org/docs/api/nuxt#routebasename) instead. :br:br Deprecated in favor of the same function under a new name: [`$routeBaseName()`{.language-ts.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="ts"}](https://i18n.nuxtjs.org/docs/api/nuxt#routebasename), to be consistent with the other context functions and their composable counterparts.                                                             |
|        | `$resolveRoute()`{.language-ts.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="ts"}                                                   | Use [`$localeRoute()`{.language-ts.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="ts"}](https://i18n.nuxtjs.org/docs/api/nuxt#localeroute) instead                                                                                                                                                                                                                                                                                                                                                                                                              |
|        | `$localeLocation()`{.language-ts.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="ts"}                                                 | Use [`$localeRoute()`{.language-ts.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="ts"}](https://i18n.nuxtjs.org/docs/api/nuxt#localeroute) instead                                                                                                                                                                                                                                                                                                                                                                                                              |

## Runtime config

Several options set in the runtime config were only used to transfer build-time configuration to runtime and changing these at runtime could cause issues.

Instead of setting these on runtime config we now treat them as compiler constants, this way we can tree-shake any unused logic from a project build.

The following options have been removed from runtime config:

| Removed runtime config option                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------ |
| `lazy`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}                         |
| `strategy`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}                     |
| `trailingSlash`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}                |
| `differentDomains`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}             |
| `defaultDirection`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}             |
| `multiDomainLocales`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}           |
| `routeNameSeparator`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}           |
| `defaultLocaleRouteNameSuffix`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"} |

## Generated options

The generated options files in your projects are meant for internal use by this module at runtime and should never be used, more properties may be removed in the future.

Future changes to these internal options will not be documented in the migration guide. If you have use cases for these options, please open an issue describing your use case so we can evaluate if we can support it differently.

The generated option files have been renamed:

| Old Name                                                                                                                                 | New Name                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `#build/i18n-options.mjs`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}    | `#build/i18n-options.mjs`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}    |
| `#internal/i18n/options.mjs`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"} | `#internal/i18n-options.mjs`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"} |

The following exports have been removed from the generated options:

| Removed Export                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `isSSG`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}                              |
| `hasPages`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}                           |
| `parallelPlugin`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}                     |
| `nuxtI18nOptions`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}                    |
| `DEFAULT_COOKIE_KEY`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}                 |
| `DYNAMIC_PARAMS_KEY`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}                 |
| `NUXT_I18N_MODULE_ID`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"}                |
| `SWITCH_LOCALE_PATH_LINK_IDENTIFIER`{.language-yml.shiki.shiki-themes.material-theme-lighter.material-theme.material-theme-palenight lang="yml"} |

Reasons for removal:

- These are no longer used by the module and might expose vulnerable information in the final build
- Some options are now used as static values for better tree-shaking resulting in a smaller project build.

## Legacy migration

The migration guides for v7 and v8 can be found in the [legacy documentation](https://v9.i18n.nuxtjs.org/docs/guide/migrating){rel="&#x22;nofollow&#x22;"}


# New features
