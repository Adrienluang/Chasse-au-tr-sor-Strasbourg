### `onlyLocales`

- type: `string | string[]`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts-type"}
- default: `undefined`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="ts"}

Specify the locales codes that need to be included, the rest will be removed.

It can be useful if you have one code base (e.g. [Nuxt Layers](https://nuxt.com/docs/getting-started/layers){rel="&#x22;nofollow&#x22;"}) for several similar projects using different languages.

::callout{color="warning" icon="i-heroicons-exclamation-triangle"}
The value of this **option will not be merged with other Nuxt Layers**. This option should only be specified in the final project config.
::

## experimental

Experimental configuration property is an object with the following properties:
