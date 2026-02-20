### `globalSFCScope`

- type: `boolean`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}
- Whether to include all `i18n` custom blocks on your SFC on global scope. For more details refer to [unplugin-vue-i18n documentation](https://github.com/intlify/bundle-tools/blob/main/packages/unplugin-vue-i18n/README.md#globalsfcscope){rel="&#x22;nofollow&#x22;"}

::callout{color="warning" icon="i-heroicons-exclamation-triangle"}
beware enabling `globalSFCScope: true`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}, all `i18n` custom blocks in all your `SFC` will be on `global` scope.
::

For example, with `globalSFCScope: true`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}, this custom block:

```vue
<i18n lang="yaml" global>
en:
  hello: Hello
es:
  hello: Hola
</i18n>
```

Would be equivalent to this:

```vue
<i18n lang="yaml">
en:
  hello: Hello
es:
  hello: Hola
</i18n>
```

This combines with `defaultSFCLang`, with `defaultSFCLang: "yaml"`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} the following would be equivalent to the previous examples:

```vue
<i18n>
en:
  hello: Hello
es:
  hello: Hola
</i18n>
```

## types

- type: `'composition' | 'legacy'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `'composition'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}

Enforces the type definition of the API style to be used.

- Set to `'composition'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}, Composition API types provided by Vue I18n and `@nuxtjs/i18n` are supported,
- Set to `'legacy'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}, Options API types are supported.

::callout{color="warning" icon="i-heroicons-exclamation-triangle"}
You may need to run `nuxi prepare` for the generated types to update.
::

## debug

- type: `boolean | 'verbose'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}

Whether to use `@nuxtjs/i18n` debug mode. If `true` or `'verbose'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}, logs will be output to the console, setting this to `'verbose'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"} will also log loaded messages objects.

::callout{color="warning" icon="i-heroicons-exclamation-triangle"}
The purpose of this option is to help identify any problems with `@nuxtjs/i18n`.

You should not enable this option in production as it will negatively impact performance.
::

## parallelPlugin

- type: `boolean`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}

Set the plugin as `parallel`. See [nuxt plugin loading strategy](https://nuxt.com/docs/guide/directory-structure/plugins#loading-strategy){rel="&#x22;nofollow&#x22;"}.

## restructureDir

- type: `string`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `'i18n'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}

Used to configure the directory used to resolve i18n files.

## autoDeclare

- type: `boolean`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `true`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}
- Automatically imports/initializes `$t()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}, `$rt()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}, `$d()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}, `$n()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}, `$tm()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} and `$te()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} functions in `<script setup>`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="html"} when used.

::callout{color="warning" icon="i-heroicons-exclamation-triangle"}
This feature relies on [Nuxt's Auto-imports](https://nuxt.com/docs/guide/concepts/auto-imports){rel=""nofollow""} and will not work if this has been disabled.
::

## serverRoutePrefix

- type `string`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `'/_i18n'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}

Sets the prefix for the server route used for loading locale messages.


# Vue I18n

::callout{icon="i-heroicons-light-bulb"}
Instance of [Composer (for Composition API)](https://vue-i18n.intlify.dev/api/composition.html#composer){rel=""nofollow""} or [VueI18n (for Legacy API)](https://vue-i18n.intlify.dev/api/legacy.html#vuei18n){rel=""nofollow""} is exposed as `$i18n` on Vue instance.
::
