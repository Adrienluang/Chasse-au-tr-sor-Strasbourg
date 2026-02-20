### `domainLocales`

- property: `domainLocales[code].domain`
- key: `NUXT_PUBLIC_I18N_DOMAIN_LOCALES_{code}_DOMAIN`

This runtime config option allows overriding the domain set in the [`locales`](https://i18n.nuxtjs.org/docs/api/options#locales) module option.


# <NuxtLinkLocale>

This component is built on top of [`<NuxtLink>`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="html"}](https://nuxt.com/docs/api/components/nuxt-link#nuxtlink){rel="&#x22;nofollow&#x22;"} but changes the default behavior by internally using [`localePath()`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}](https://i18n.nuxtjs.org/docs/api/vue#localepath) to make it easier to link to localized routes.
