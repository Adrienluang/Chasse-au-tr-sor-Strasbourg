### includeAllowlist

To prevent breaking Vitepress layout when the user visits a page that does not exist, you can enable the new experimental option `includeAllowlist`, requires VitePress `1.0.0-rc.14+`.

Check the problem in the following issue: https://github.com/vite-pwa/vitepress/issues/22.

You also need to force your server to return response with status code 404 when the requested page doesn't exist.

This option is only available for the `generateSW` strategy, to enable it, you need to add the following configuration:

```ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'

export default withPwa(defineConfig({
  /* your VitePress options */
  /* Vite PWA Options */
  pwa: {
    strategies: 'generateSW', // <== if omitted, defaults to `generateSW`
    workbox: { /* your workbox configuration if any */ },
    experimental: {
      includeAllowlist: true
    }
  }
}))
```

If you're using `injectManifest` strategy, you can find the required logic in the following [experimiental service worker](https://github.com/vite-pwa/vitepress/blob/main/examples/pwa-simple-sw/.vitepress/sw.ts).

## PWA Assets &#x20;

`@vite-pwa/vitepress` plugin will configure `integration` option properly. VitePress dev server will be restarted when changing the configuration (inlined or using external file).

To inject the PWA icons links and the `theme-color`:

* remove all links with rel `icon`, `apple-touch-icon` and `apple-touch-startup-image` from `head` entry in your VitePress configuration
* remove the `theme-color` meta tag from `head` entry in your VitePress configuration

You can find a working example in the [examples folder](https://github.com/vite-pwa/vitepress/tree/main/examples/pwa-simple-assets-generator).

---

---
url: /examples/vue.md
---

# Vue

The `Vue 3` example project can be found on [examples/vue-router](https://github.com/vite-pwa/vite-plugin-pwa/tree/main/examples/vue-router) package/directory.

The router used on this example project is [vue-router](https://next.router.vuejs.org/).

To test `new content available`, you should rerun the corresponding script, and then refresh the page.

If you are running an example with `Periodic SW updates`, you will need to wait 1 minute:


## Executing the examples

## generateSW

## injectManifest

---

---
url: /frameworks/vue.md
---

# Vue

## Vue 3

You can use the built-in `Vite` virtual module `virtual:pwa-register/vue` for `Vue 3` which will return `composition api` references (`ref<boolean>`) for `offlineReady` and `needRefresh`.
