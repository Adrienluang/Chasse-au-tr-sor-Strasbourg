### `language`

- type: `undefined | string`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- **Required when using SEO features**
- A language-range used for SEO features and for matching browser locales when using [`detectBrowserLanguage`](https://i18n.nuxtjs.org/docs/api/options#detectbrowserlanguage) functionality. Should use the [language tag syntax](https://www.w3.org/International/articles/language-tags/){rel="&#x22;nofollow&#x22;"} as defined by the IETF's [BCP47](https://www.rfc-editor.org/info/bcp47){rel="&#x22;nofollow&#x22;"}, for example:
  - `'en'` (`language` subtag for English)
  - `'fr-CA'` (`language+region` subtags for French as used in Canada)
  - `'zh-Hans'` (`language+script` subtags for Chinese written with Simplified script)
