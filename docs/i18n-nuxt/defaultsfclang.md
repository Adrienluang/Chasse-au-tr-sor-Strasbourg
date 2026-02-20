### `defaultSFCLang`

- type: `'json' | 'json5' | 'yaml' | 'yml'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `'json'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- Specify the content for all your inlined i18n custom blocks on your SFC. For more details refer to [unplugin-vue-i18n documentation](https://github.com/intlify/bundle-tools/blob/main/packages/unplugin-vue-i18n/README.md#defaultsfclang){rel="&#x22;nofollow&#x22;"}

On inlined `i18n` custom blocks that have specified the `lang` attribute, the `defaultSFCLang` is not applied.

For example, with `defaultSFCLang: "yaml"`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"} or `defaultSFCLang: "yml"`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}, this custom block:

```vue
<i18n lang="yaml">
en:
  hello: Hello
es:
  hello: Hola
</i18n>
```

Would be equivalent to this:

```vue
<i18n>
en:
  hello: Hello
es:
  hello: Hola
</i18n>
```
