# Introducing Smart Prefetching

## Introducing Smart prefetching ⚡️

Starting from [Nuxt v2.4.0](https://github.com/nuxt/nuxt.js/releases/tag/v2.4.0){rel="&#x22;nofollow&#x22;"}, Nuxt will automagically prefetch the code-splitted pages linked with `<nuxt-link>` when visible in the viewport **by default**. This hugely improves the end user performances, inspired by [quicklink](https://github.com/GoogleChromeLabs/quicklink){rel="&#x22;nofollow&#x22;"}.

![nuxt-prefetch-comparison](https://nuxt.com/assets/blog/nuxt-prefetch-comparison.gif){.rounded-lg.border.border-gray-700}

Demos are online and we recommend you to try it out to feel the difference:

- No prefetching (v2.3): <https://nuxt-no-prefetch.surge.sh>{rel="&#x22;nofollow&#x22;"}
- With prefetching (v2.4): <https://nuxt-prefetch.surge.sh>{rel="&#x22;nofollow&#x22;"}

You can learn more about this feature in the [`<nuxt-link>`](https://v2.nuxt.com/docs/features/nuxt-components#the-nuxtlink-component){rel="&#x22;nofollow&#x22;"} section of the documentation.
