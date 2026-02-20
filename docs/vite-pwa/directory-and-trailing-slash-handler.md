### Directory and Trailing Slash Handler

Check the problem in the following issue: https://github.com/vite-pwa/astro/issues/23.

You can find a list of hosts and how they handle trailing slash in this [repository](https://github.com/slorber/trailing-slash-guide).

To enable this feature, you need to add the following configuration to your PWA options:

```ts
import { defineConfig } from 'astro/config'
import AstroPWA from '@vite-pwa/astro'

// https://astro.build/config
export default defineConfig({
  integrations: [
    AstroPWA({
      experimental: {
        directoryAndTrailingSlashHandler: true,
      }
    })
  ]
})
```

If you're using `injectManifest` strategy, you also need to include `directoryIndex` and optionally `cleanURLs` in your custom service worker in the precaching controller:

```ts
import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST, { directoryIndex: 'index.html', cleanURLs: true })
```

## PWA Assets &#x20;

`@vite-pwa/astro` plugin will configure `integration` option properly. We suggest you to use external configuration file, Astro dev server will not be restarted when changing the configuration.

To inject the PWA icons links and the `theme-color`, you can use the `virtual:pwa-assets/head` virtual module in your layout components:

* remove all links with rel `icon`, `apple-touch-icon` and `apple-touch-startup-image` from your html head
* remove the `theme-color` meta tag from your html head
* add the virtual import
* include theme color and icons links using code-snippet shown below

```astro
---
import { pwaAssetsHead } from 'virtual:pwa-assets/head';
---
<html lang="en">
  <head>
    { pwaAssetsHead.themeColor && <meta name="theme-color" content={pwaAssetsHead.themeColor.content} /> }
    { pwaAssetsHead.links.map(link => (
        <link {...link} />
    )) }
  </head>
</html>
```

You can find a working example in the [examples folder](https://github.com/vite-pwa/astro/tree/main/examples/pwa-simple-assets-generator).

---

---
url: /guide/auto-update.md
---

# Automatic reload

With this behavior, once the browser detects a new version of your application, then, it will update the caches and will reload any browser windows/tabs with the application opened automatically to take the control.

::: warning
In order to reload all client tab/window, you will need to import any virtual module provided by the plugin: if you're not using any virtual, there is no way to interact with the application ui, and so, any client tab/window will not be reloaded (the old service worker will be still controlling the application).

Automatic reload is not automatic page reload, you will need to use the following code in your application entry point if you want **automatic page reload**:

```js
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })
```

:::

The disadvantage of using this behavior is that the user can lose data in any browser windows/tabs in which the application is open and is filling in a form.

If your application has forms, we recommend you to change the behavior to use default `prompt` option to allow the user decide when to update the content of the application.

::: danger
Before you put your application into production, you need to be sure of the behavior you want for the service worker. Changing the behavior of the service worker from `autoUpdate` to `prompt` can be a pain.
:::

## Plugin Configuration

With this option, the plugin will force `workbox.clientsClaim` and `workbox.skipWaiting` to `true` on the plugin options.

You must add `registerType: 'autoUpdate'` to `vite-plugin-pwa` plugin options in your `vite.config.ts` file:

```ts
VitePWA({
  registerType: 'autoUpdate'
})
```
