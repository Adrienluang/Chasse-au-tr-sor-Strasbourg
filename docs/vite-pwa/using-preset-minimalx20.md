### Using Preset Minimal&#x20;

```html
<head>
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png">
</head>
```

---

---
url: /workbox.md
---

# Getting Started

[**Workbox**](https://developer.chrome.com/docs/workbox/) is a massive package with many modules to make service worker development more enjoyable and remove the need to deal with the low-level service worker API.

In this document, we focus only on the [workbox-build](https://developer.chrome.com/docs/workbox/modules/workbox-build) module from **Workbox**.

:::warning
From version `0.16.0`, `vite-plugin-pwa` has been updated to use latest `workbox` version `7.0.0` that requires Node 16 or above.
:::

:::tip
From version `0.20.2`, the plugin will throw an error if the `maximumFileSizeToCacheInBytes` warning is present when building the service worker.
:::

## workbox-build module

This module is for build process purposes (a `node` module); that is, `Vite Plugin PWA` will use it to build your service-worker.

We focus on 2 methods of this module:

* [generateSW](/workbox/generate-sw): for generating the service worker.
* [injectManifest](/workbox/inject-manifest): for when you need more control over your service worker.

You should read [Which Mode to Use](https://developer.chrome.com/docs/workbox/modules/workbox-build/#which-mode-to-use) before deciding which strategy to use.

In short, the `generateSW` function abstracts away the need to work directly with the service worker API when building the service worker. This method can be configured using plugins instead of writing your own service worker code (`generateSW` will generate the code for you).

While the `injectManifest` method will use your existing service worker and build/compile it.

## How is `workbox-build` related to `vite-plugin-pwa`?

`vite-plugin-pwa` uses `generateSW` and `injectManifest` Workbox methods internally when the `strategies` option is set to `generateSW` and `injectManifest` respectively.

When you configure `strategies: 'generateSW'` option (the default value) in your `vite.config.*` file, the plugin invokes workbox' `generateSW` method. The options passed to the `workbox-build` method will be those provided via the `workbox` option of the plugin configuration.

When you configure `strategies: 'injectManifest'` option, the plugin will first build your custom service worker via custom `Vite` build. With the build result, vite-plugin-pwa will call Workbox's `injectManifest` method passing those options provided via the `injectManifest` option of the plugin configuration.

---

---
url: /examples/iles.md
---

# îles

You can test `îles` using the source code from its documentation website, you can find it under [docs](https://github.com/ElMassimo/iles/tree/main/docs) package/directory.

The behavior used in this website is [Prompt for update](/guide/prompt-for-update).

---

---
url: /frameworks/iles.md
---

# îles

We have included the integration with `îles` on their repo, adding `@islands/pwa` module.

You can find the documentation here:

* [@islands/pwa](https://iles-docs.netlify.app/guide/plugins#islandspwa)
* [Progressive Web Application (PWA)](https://iles-docs.netlify.app/guide/pwa)

---

---
url: /workbox/inject-manifest.md
---

# injectManifest

You must read [Which Mode to Use](https://developer.chrome.com/docs/workbox/modules/workbox-build/#which-mode-to-use) before decide using this strategy on `vite-plugin-pwa` plugin.

Before writing your custom service worker, check if `workbox` can generate the code for you using `generateSW` strategy, looking for some plugin on `workbox` site on [Runtime Caching Entry](https://developer.chrome.com/docs/workbox/modules/workbox-build#type-RuntimeCaching).

You can find the documentation for this method on `workbox` site: [injectManifest](https://developer.chrome.com/docs/workbox/modules/workbox-build#method-injectManifest)

:::warning
From version `0.15.0`, `vite-plugin-pwa` builds your custom service worker using Vite instead of Rollup: configured Vite plugins were reused in the service worker build, which could lead to the generation of bad code in service worker.

If you are using any Vite plugin logic within your custom service worker, you need to add those plugins twice, for the development server and the build process:

* Vite plugins
* `vite-plugin-pwa` plugin options: `injectManifest.plugins`

`vite-plugin-pwa` now uses the same approach as Vite to build [WebWorkers](https://vitejs.dev/config/worker-options.html#worker-plugins).
:::

## Exclude routes

To exclude some routes from being intercepted by the service worker, you just need to add those routes using a `regex` array to the `denylist` option of `NavigationRoute`:

```ts
import { createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare let self: ServiceWorkerGlobalScope

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// to allow work offline
registerRoute(new NavigationRoute(
  createHandlerBoundToURL('index.html'),
  { denylist: [/^\/backoffice/] },
))
```

::: warning
You must deal with offline support for excluded routes: if requesting a page included on `denylist` you will get `No internet connection`.
:::

## Network First Strategy

You can use the following code to create your custom service worker to be used with network first strategy. We also include how to configure [Custom Cache Network Race Strategy](https://jakearchibald.com/2014/offline-cookbook/#cache--network-race).

::: details VitePWA options

```ts
VitePWA({
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'sw.ts'
})
```

:::

::: warning
You also need to add the logic to interact from the client logic: [Advanced (injectManifest)](/guide/inject-manifest).
:::

Then in your `src/sw.ts` file, remember you will also need to add following `workbox` dependencies as `dev` dependencies:

* `workbox-core`
* `workbox-routing`
* `workbox-strategies`
* `workbox-build`

::: details src/sw.ts

```ts
import type { ManifestEntry } from 'workbox-build'
import type { StrategyHandler } from 'workbox-strategies'
import { cacheNames, clientsClaim } from 'workbox-core'
import { registerRoute, setCatchHandler, setDefaultHandler } from 'workbox-routing'
import {
  NetworkFirst,
  NetworkOnly,
  Strategy
} from 'workbox-strategies'

// Give TypeScript the correct global.
declare let self: ServiceWorkerGlobalScope
declare type ExtendableEvent = any

const data = {
  race: false,
  debug: false,
  credentials: 'same-origin',
  networkTimeoutSeconds: 0,
  fallback: 'index.html'
}

const cacheName = cacheNames.runtime

function buildStrategy(): Strategy {
  if (race) {
    class CacheNetworkRace extends Strategy {
      _handle(request: Request, handler: StrategyHandler): Promise<Response | undefined> {
        const fetchAndCachePutDone: Promise<Response> = handler.fetchAndCachePut(request)
        const cacheMatchDone: Promise<Response | undefined> = handler.cacheMatch(request)

        return new Promise((resolve, reject) => {
          fetchAndCachePutDone.then(resolve).catch((e) => {
            if (debug)
              console.log(`Cannot fetch resource: ${request.url}`, e)
          })
          cacheMatchDone.then(response => response && resolve(response))

          // Reject if both network and cache error or find no response.
          Promise.allSettled([fetchAndCachePutDone, cacheMatchDone]).then((results) => {
            const [fetchAndCachePutResult, cacheMatchResult] = results
            if (fetchAndCachePutResult.status === 'rejected' && !cacheMatchResult.value)
              reject(fetchAndCachePutResult.reason)
          })
        })
      }
    }
    return new CacheNetworkRace()
  }
  else {
    if (networkTimeoutSeconds > 0)
      return new NetworkFirst({ cacheName, networkTimeoutSeconds })
    else
      return new NetworkFirst({ cacheName })
  }
}

const manifest = self.__WB_MANIFEST as Array<ManifestEntry>

const cacheEntries: RequestInfo[] = []

const manifestURLs = manifest.map(
  (entry) => {
    const url = new URL(entry.url, self.location)
    cacheEntries.push(new Request(url.href, {
      credentials: credentials as any
    }))
    return url.href
  }
)

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(cacheEntries)
    })
  )
})

self.addEventListener('activate', (event: ExtendableEvent) => {
  // - clean up outdated runtime cache
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      // clean up those who are not listed in manifestURLs
      cache.keys().then((keys) => {
        keys.forEach((request) => {
          debug && console.log(`Checking cache entry to be removed: ${request.url}`)
          if (!manifestURLs.includes(request.url)) {
            cache.delete(request).then((deleted) => {
              if (debug) {
                if (deleted)
                  console.log(`Precached data removed: ${request.url || request}`)
                else
                  console.log(`No precache found: ${request.url || request}`)
              }
            })
          }
        })
      })
    })
  )
})

registerRoute(
  ({ url }) => manifestURLs.includes(url.href),
  buildStrategy()
)

setDefaultHandler(new NetworkOnly())

// fallback to app-shell for document request
setCatchHandler(({ event }): Promise<Response> => {
  switch (event.request.destination) {
    case 'document':
      return caches.match(fallback).then((r) => {
        return r ? Promise.resolve(r) : Promise.resolve(Response.error())
      })
    default:
      return Promise.resolve(Response.error())
  }
})

// this is necessary, since the new service worker will keep on skipWaiting state
// and then, caches will not be cleared since it is not activated
self.skipWaiting()
clientsClaim()
```

:::

## Server Push Notifications

You should check the `workbox` documentation: [Introduction to push notifications](https://web.dev/explore/notifications).

You can check this awesome repo [Elk](https://github.com/elk-zone/elk) using `Server Push Notifications` and some other cool service worker capabilities like [Web Share Target API](https://developer.chrome.com/docs/capabilities/web-apis/web-share-target): using `Nuxt 3` and `vite-plugin-pwa`.

## Background Sync

You should check the `workbox` documentation: check [Introducing to Background Sync](https://developer.chrome.com/blog/background-sync/).

You can check this awesome repo [YT Playlist Notifier](https://github.com/jeffposnick/yt-playlist-notifier) using `Background Sync` and some other cool service worker capabilities from the major collaborator of [Workbox](https://developer.chrome.com/docs/workbox/).

---

---
url: /assets-generator/integrations.md
---

# Integrations&#x20;

Starting with `v0.19.0`, `vite-plugin-pwa` provides experimental support for the following `@vite-pwa/assets-generator` integrations for serving, generating, and injecting PWA assets on the fly:

* Inlined or external file configuration support
* Generate PWA assets on demand in dev server and build from single image file
* Auto-inject PWA assets in your HTML entry point
* Auto-inject `theme-color` meta tag in your HTML entry point, it will be extracted from your web manifest `theme_color` property
* Auto-inject web manifest icons

The new experimental feature must be enabled explicitly in your `vite-plugin-pwa` configuration with the `pwaAssets` option. This can be done by either:

* using an inlined preset or
* using an external configuration file (will take precedence over inlined preset)

You can find a working example in the [examples/assets-generator](https://github.com/vite-pwa/vite-plugin-pwa/tree/main/examples/assets-generator) folder.

:::warning
This feature is experimental and is subject to (potentially breaking) changes without notice. Please [file a GitHub Issue](https://github.com/vite-pwa/vite-plugin-pwa/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc) for any bugs you may find.
:::

## Installation

To use the new feature, install the `@vite-pwa/assets-generator` package as a dev dependency:

::: code-group

```bash [pnpm]
pnpm add -D @vite-pwa/assets-generator
```

```bash [yarn]
yarn add -D @vite-pwa/assets-generator
```

```bash [npm]
npm install -D @vite-pwa/assets-generator
```

:::

## Configuration

We recommend using an external `pwa-assets.config.js` or `pwa-assets.config.ts` file.
The `vite-plugin-pwa` plugin will watch it for changes to avoid dev server restarts.
You can still use inline inside your `vite.config.js` file. This will cause Vite to restart the dev server when changing any option.

To use the new feature, you only need to configure the new `pwaAssets` option in your PWA configuration:

```ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      // other pwa options

      // pwa assets
      pwaAssets: {
        // options
      }
    })
  ]
})
```

Check the [PWA Assets Options](#pwa-assets-options) section for further details.

## Integrations
