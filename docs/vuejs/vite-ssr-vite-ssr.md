### Vite SSR {#vite-ssr}

Vite provides built-in [support for Vue server-side rendering](https://vite.dev/guide/ssr.html), but it is intentionally low-level. If you wish to go directly with Vite, check out [vite-plugin-ssr](https://vite-plugin-ssr.com/), a community plugin that abstracts away many challenging details for you.

You can also find an example Vue + Vite SSR project using manual setup [here](https://github.com/vitejs/vite-plugin-vue/tree/main/playground/ssr-vue), which can serve as a base to build upon. Note this is only recommended if you are experienced with SSR / build tools and really want to have complete control over the higher-level architecture.

## Writing SSR-friendly Code {#writing-ssr-friendly-code}

Regardless of your build setup or higher-level framework choice, there are some principles that apply in all Vue SSR applications.
