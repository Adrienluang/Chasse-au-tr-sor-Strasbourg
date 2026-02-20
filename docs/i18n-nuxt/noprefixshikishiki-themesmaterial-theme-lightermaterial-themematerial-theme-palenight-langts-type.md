### `'no_prefix'`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}

With this strategy, your routes won't have a locale prefix added. The locale will be detected & changed without changing the URL. This implies that you have to rely on browser & cookie detection, and implement locale switches by calling the i18n API.

::callout{icon="i-heroicons-light-bulb"}
This strategy doesn't support [Custom paths](https://i18n.nuxtjs.org/docs/guide/custom-paths) and [Ignore routes](https://i18n.nuxtjs.org/docs/guide/ignoring-localized-routes) features unless you're also using [`differentDomains`](https://i18n.nuxtjs.org/docs/guide/different-domains).
::
