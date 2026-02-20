### Enabling Offline Support

If your Remix application is an SPA, all routes will be pre-rendered, and you don't need to add additional logic, all html pages will be in the `self.__WB_MANIFEST` array.

If you're using Remix SSR application, then you need to add [registerRoute](https://developer.chrome.com/docs/workbox/modules/workbox-routing) to handle the SSR routes to avoid default offline browser page when navigate to them: you can import `dynamicRoutes` and `staticRoutes` from the `virtual:vite-pwa/remix/sw` or `@vite-pwa/remix/sw` to register the SSR routes.

Check the [shared-sw.ts module](https://github.com/vite-pwa/remix/blob/main/examples/pwa-simple-sw/app/shared-sw.ts) and the usage in the [service worker](https://github.com/vite-pwa/remix/blob/main/examples/pwa-simple-sw/app/plain-sw.ts), remember to exclude the router in dev server.

## PWA Assets&#x20;

This feature includes the following components:

* `PwaManifest` component to include the PWA manifest in your HTML pages: will inject the PWA web manifest in the HTML head
* `PwaAssets` component to include the PWA assets in your HTML pages: will inject the PWA assets in the HTML head (PWA web manifest, theme-color, favicon and PWA web manifest)

## Remix PWA Alternative

You can use [Remix PWA](https://remix-pwa.run/) to add PWA support to your Remix application.

---

---
url: /guide/scaffolding.md
---
# Scaffolding Your First Vite PWA Project

::: tip
From version `v1.0.0`, all the templates to use Vite 7, including also the latest frameworks changes.

From version `v0.6.0`, all the templates to use Vite 6, including also the latest frameworks changes.

Use version `v0.5.0` for Vite 5 and previous versions of the frameworks.
:::

---

---
url: /guide/service-worker-precache.md
---

# Service Worker Precache

As explained in the [Service Worker](/guide/#service-worker) section, service workers act as proxies intercepting requests between the browser and the server.

To add PWA capability to your application, we need to give it a service worker. The service worker's precache manifest must include all the resources of your application, so that the service worker knows what resources to download into the browser's cache storage for use during `network requests interception` and when the application is offline.

::: tip Network requests interception
You can also configure whether to apply network request interception for any of your application resources. You can find more information on [Workbox - Caching Strategies](https://developer.chrome.com/docs/workbox/caching-strategies-overview/#caching-strategies).
:::

Once the application registers the service worker, the browser will try to install it. This involves downloading all the resources in the service worker's precache manifest, and then trying to activate the service worker to take the control of the application.

::: tip
The browser will **only** download the resources in the service worker's precache manifest **if the service worker is not installed** (the first time the user visits your application) or **if there is a new version of your application** (if you change some resource in your application, the service worker will also change once you build the application, since its precache manifest is modified to include your changes).

The browser will always download these resouces **in a background thread** and not in the main browser thread, so that the application is usable even before the service worker is installed.

You can see this behaviour on this website or the [VueUse docs site](https://vueuse.org/) in a private window. Just open `Network Tab` on dev tools before visiting the site: the browser will be downloading all the resources while you navigate the site.
:::

## Precache Manifest

Since `vite-plugin-pwa` plugin uses the [workbox-build](https://developer.chrome.com/docs/workbox/modules/workbox-build/) node library to build the service worker, it will only include `css`, `js` and `html` resources in the manifest precache (check the `globPatterns` entry in [GlobPartial](https://developer.chrome.com/docs/workbox/modules/workbox-build#type-GlobPartial)).

The `workbox-build` node library is file based: it will traverse the build output folder of your application. `Vite` will generate your build in the `dist` folder, and so, `workbox-build` will traverse the `dist` folder adding all resources found in it to the service worker's precache manifest.

If you need to include another resource types, you will need to add them to the `globPatterns` entry. Depending on the `strategy` configured in the `vite-plugin-pwa` plugin configuration, you will need to add it under the `workbox` or `injectManifest` configuration option.

You can find more information in the [Static assets handling](/guide/static-assets) section.

For example, if you need to add `ico`, `png` and `svg` resources in the example from the [Configuring vite-plugin-pwa - Guide](/guide/#configuring-vite-plugin-pwa) section, you will need to add `globPatterns` under `workbox` entry, since we're using the default `vite-plugin-pwa` strategy (`generateSW`):

```ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
})
```

---

---
url: /guide/service-worker-strategies-and-behaviors.md
---

# Service Worker Strategies And Behaviors

A service worker strategy is related to how the `vite-plugin-pwa` plugin will generate your service worker, while the behavior of a service worker is related to how the service worker will work in the browser once the browser detects a new version of your application.

## Service Worker Strategies

As we mention in [Configuring vite-plugin-pwa](/guide/#configuring-vite-plugin-pwa) section, `vite-plugin-pwa` plugin will use `workbox-build` node library to generate your service worker. There are 2 available strategies, `generateSW` and `injectManifest`:

* `generateSW`: the `vite-plugin-pwa` will generate the service worker for you, you don't need to write the code for the service worker
* `injectManifest`: the `vite-plugin-pwa` plugin will compile your custom service worker and inject its precache manifest

To configure the service worker strategy, use the `strategies`' plugin option with `generateSW` (**default strategy**) or `injectManifest` value.

You can find more information about the strategies in the [generateSW](/workbox/generate-sw) or [injectManifest](/workbox/inject-manifest) `Workbox` sections.

## Service Worker Behaviors

The behavior of the service worker will help you to update the application in the browser, that is, when the browser detects a new version of your application, you can control how the browser updates it.

You may want to not bother users and just have the browser update the application when there is a new version: the user will only see a reload of the page they are on.

Or you may want to inform the user that there is a new version of the application, and let the user decide when to update it: simply because you want it to behave that way or because your application requires it (for example, to prevent data loss if the user is filling out a form).

To configure the service worker behavior, use the `registerType` plugin option with `autoUpdate` or `prompt` (**default strategy**) value.

You can find more information about the behaviors in the [auto-update](/guide/auto-update) or [prompt-for-update](/guide/prompt-for-update) sections for `generateSW` strategy or in [inject-manifest](/guide/inject-manifest) section for `injectManifest` strategy.

---

---
url: /guide/service-worker-without-pwa-capabilities.md
---

# Service Worker without PWA capabilities

Sometimes you don't need the full blown PWA functionality like **offline cache** and **manifest file**, but need simple custom Service Worker.

You can disable all `vite-plugin-pwa` supported features, and use it just to manage your Service Worker file.

## Service Worker code

Suppose you want to have a Service Worker file that captures browser `fetch`:

```js
// src/service-worker.js or src/service-worker.ts
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request))
})
```

You would like to have this service worker reloaded on each change in **development** and prepared for **production**.

## Plugin Configuration

You should configure `vite-plugin-pwa` plugin options in your Vite configuration file with the following options:

```js
// vite.config.js or vite.config.ts
VitePWA({
  srcDir: 'src',
  filename: 'service-worker.js',
  strategies: 'injectManifest',
  injectRegister: false,
  manifest: false,
  injectManifest: {
    injectionPoint: undefined,
  },
})
```

## Development

If you would like the service worker to run in development, make sure to enable it in the [devOptions](/guide/development#plugin-configuration) and to set the type to [module](/guide/development#injectmanifest-strategy) if required.

## Registering of the Service Worker in your app

Use the code below in your entry point module:

```js
// src/main.js or src/main.ts
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    import.meta.env.MODE === 'production' ? '/service-worker.js' : '/dev-sw.js?dev-sw'
  )
}
```

If you're using import statements inside your service worker (will work only on chromium based browsers) check [injectManifest](/guide/development.html#injectmanifest-strategy) section for more info:

```js
// src/main.js or src/main.ts
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    import.meta.env.MODE === 'production' ? '/service-worker.js' : '/dev-sw.js?dev-sw',
    { type: import.meta.env.MODE === 'production' ? 'classic' : 'module' }
  )
}
```

---

---
url: /examples/solidjs.md
---

# SolidJS

The `SolidJS` example project can be found on [examples/solid-router](https://github.com/vite-pwa/vite-plugin-pwa/tree/main/examples/solid-router) package/directory.

The router used on this example project is [solid-app-router](https://github.com/solidjs/solid-app-router).

To test `new content available`, you should rerun the corresponding script, and then refresh the page.

If you are running an example with `Periodic SW updates`, you will need to wait 1 minute:


## Executing the examples

## generateSW

## injectManifest

---

---
url: /frameworks/solidjs.md
---

# SolidJS

You can use the built-in `Vite` virtual module `virtual:pwa-register/solid` for `SolidJS` which will return `createSignal` stateful values (`createSignal<boolean>`) for `offlineReady` and `needRefresh`.

::: warning
You will need to add `workbox-window` as a `dev` dependency to your `Vite` project.
:::

## Type declarations

::: tip

From version `0.14.5` you can also use types definition for solid instead of `vite-plugin-pwa/client`:

```json
{
  "compilerOptions": {
    "types": [
      "vite-plugin-pwa/solid"
    ]
  }
}
```

Or you can add the following reference in any of your `d.ts` files (for example, in `vite-env.d.ts` or `global.d.ts`):

```ts
/// <reference types="vite-plugin-pwa/solid" />
```

:::

```ts
declare module 'virtual:pwa-register/solid' {
  import type { Accessor, Setter } from 'solid-js'
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types'

  export type { RegisterSWOptions }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [Accessor<boolean>, Setter<boolean>]
    offlineReady: [Accessor<boolean>, Setter<boolean>]
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}
```

## Prompt for update

You can use this `ReloadPrompt.tsx` component:

::: details ReloadPrompt.tsx

```tsx
import type { Component } from 'solid-js'
import { Show } from 'solid-js'
import { useRegisterSW } from 'virtual:pwa-register/solid'
import styles from './ReloadPrompt.module.css'

const ReloadPrompt: Component = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <div className={styles.Container}>
      <Show when={offlineReady() || needRefresh()}>
        <div className={styles.Toast}>
          <div className={styles.Message}>
            <Show
              fallback={<span>New content available, click on reload button to update.</span>}
              when={offlineReady()}
            >
              <span>App ready to work offline</span>
            </Show>
          </div>
          <Show when={needRefresh()}>
            <button className={styles.ToastButton} onClick={() => updateServiceWorker(true)}>Reload</button>
          </Show>
          <button className={styles.ToastButton} onClick={() => close()}>Close</button>
        </div>
      </Show>
    </div>
  )
}

export default ReloadPrompt
```

:::

and its corresponding `ReloadPrompt.module.css` styles module:

::: details ReloadPrompt.module.css

```css
.Container {
  padding: 0;
  margin: 0;
  width: 0;
  height: 0;
}
.Toast {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 16px;
  padding: 12px;
  border: 1px solid #8885;
  border-radius: 4px;
  z-index: 1;
  text-align: left;
  box-shadow: 3px 4px 5px 0 #8885;
  background-color: white;
}
.ToastMessage {
  margin-bottom: 8px;
}
.ToastButton {
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: 2px;
  padding: 3px 10px;
}
```

:::

## Periodic SW Updates

As explained in [Periodic Service Worker Updates](/guide/periodic-sw-updates), you can use this code to configure this behavior on your application with the virtual module `virtual:pwa-register/solid`:

```ts
import { useRegisterSW } from 'virtual:pwa-register/solid'

const intervalMS = 60 * 60 * 1000

const updateServiceWorker = useRegisterSW({
  onRegistered(r) {
    r && setInterval(() => {
      r.update()
    }, intervalMS)
  }
})
```

The interval must be in milliseconds, in the example above it is configured to check the service worker every hour.

---

---
url: /guide/static-assets.md
---

# Static assets handling

By default, all icons on `PWA Web App Manifest` option found under Vite's `publicDir` option directory, will be included in the service worker *precache*. You can disable this option using `includeManifestIcons: false`.

You can also add other static assets such as `favicon`, `svg` and `font` files using `includeAssets` option. The `includeAssets` option will be resolved using [tinyglobby](https://github.com/SuperchupuDev/tinyglobby) found under Vite's `publicDir` option directory, and so you can use regular expressions to include those assets, for example: `includeAssets: ['fonts/*.ttf', 'images/*.png']`. You don't need to configure `PWA Manifest icons` on `includeAssets` option.

## Reusing src/assets images

::: warning
This feature is not yet available.
:::

If you are using images in your application via `src/assets` directory (or any other directory), and you want to reuse those images in your `PWA Manifest` icons, you can use them with these 3 limitations:

* any image under `src/assets` directory (or any other directory) must be used in your application via static import or directly on the `src` attribute
* you must reference the images in the `PWA Manifest` icons using the assets directory path relative to the root folder: `./src/assets/logo.png` or `src/assets/logo.png`
* inlined icons cannot be used, in that case you will need to copy/move those images to the Vite's `publicDir` option directory: refer to [Importing Asset as URL](https://vitejs.dev/guide/assets.html#importing-asset-as-url) and [Vite's assetsInlineLimit option](https://vitejs.dev/config/build-options.html#build-assetsinlinelimit)

::: warning
If you're using `PWA Manifest` icons from any asset folder, but you are not using those images in your application (via static import or in src attribute), Vite will not emit those assets, and so missing from the build output:

```shell
Error while trying to use the following icon from the Manifest: https://localhost/src/assets/pwa-192x192.png (Download error or resource isn't a valid image)
```

In that case, you need to copy or move those images to the Vite's `publicDir` option directory (defaults to `public`) and configure the icons properly.
:::

For example, if you have the following image `src/assets/logo-192x192.png` you can add it to your `PWA Manifest` icon using:

```json
{
  "src": "./src/assets/logo-192x192.png",
  "sizes": "192x192",
  "type": "image/png"
}
```

then, in your codebase, you must use it via static import:

```js
// src/main.js or src/main.ts
// can be any js/ts/jsx/tsx module or single file component
import logo from './assets/logo-192x192.png'

document.getElementById('logo-img').src = logo
```

or using the `src` attribute:

```js
// src/main.js or src/main.ts
// can be any js/ts/jsx/tsx module or single file component
document.getElementById('#app').innerHTML = `
  <img src="./assets/logo-192x192.png" alt="Logo" width="192" height="192" />
`
```

## globPatterns

If you need to include other assets that are not under Vite's `publicDir` option directory, you can use the `globPatterns` parameter of [workbox](https://developer.chrome.com/docs/workbox/modules/workbox-build#generatesw) or [injectManifest](https://developer.chrome.com/docs/workbox/modules/workbox-build#injectmanifest) plugin options.

::: warning
If you configure `globPatterns` on `workbox` or `injectManifest` plugin option, you **MUST** include all your assets patterns: `globPatterns` will be used by `workbox-build` to match files on `dist` folder.

By default, `globPatterns` will be `**/*.{js,css,html}`: `workbox` will use [glob primer](https://github.com/isaacs/node-glob#glob-primer) to match files using `globPatterns` as filter.

A common pitfall is to only include some assets and forget to add `css`, `js` and `html` assets pattern, and then your service worker will complain about missing resources.

For example, if you don't include `html` assets pattern, you will get this error from your service worker:  **WorkboxError non-precached-url index.html**.
:::

To configure `globPatterns` you need to use `workbox` or `injectManifest` plugin option for`generateSW` and `injectManifest` strategies respectively:

::: code-group

```ts [generateSW]
VitePWA({
  workbox: {
    globPatterns: ['**/*.{js,css,html}'],
  }
})
```

```ts [injectManifest]
VitePWA({
  injectManifest: {
    globPatterns: ['**/*.{js,css,html}'],
  }
})
```

:::

---

---
url: /examples/svelte.md
---

# Svelte

The `Svelte` example project can be found on [examples/svelte-routify](https://github.com/vite-pwa/vite-plugin-pwa/tree/main/examples/svelte-routify) package/directory.

The router used on this example project is [@roxi/routify](https://routify.dev/).

To test `new content available`, you should rerun the corresponding script, and then refresh the page.

If you are running an example with `Periodic SW updates`, you will need to wait 1 minute:


## Executing the examples

## generateSW

## injectManifest

---

---
url: /frameworks/svelte.md
---

# Svelte

You can use the built-in `Vite` virtual module `virtual:pwa-register/svelte` for `Svelte` which will return `writable` stores (`Writable<boolean>`) for `offlineReady` and `needRefresh`.

::: warning
You will need to add `workbox-window` as a `dev` dependency to your `Vite` project.
:::

## Type declarations

::: tip

From version `0.14.5` you can also use types definition for svelte instead of `vite-plugin-pwa/client`:

```json
{
  "compilerOptions": {
    "types": [
      "vite-plugin-pwa/svelte"
    ]
  }
}
```

Or you can add the following reference in any of your `d.ts` files (for example, in `vite-env.d.ts` or `global.d.ts`):

```ts
/// <reference types="vite-plugin-pwa/svelte" />
```

:::

```ts
declare module 'virtual:pwa-register/svelte' {
  import type { Writable } from 'svelte/store'
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types'

  export type { RegisterSWOptions }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: Writable<boolean>
    offlineReady: Writable<boolean>
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}
```

## Prompt for update

You can use this `ReloadPrompt.svelte` component:

::: details ReloadPrompt.svelte

```html
<script lang="ts">
  import { useRegisterSW } from 'virtual:pwa-register/svelte';

  const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
    onRegistered(swr) {
      console.log(`SW registered: ${swr}`);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    }
  });

  function close() {
    offlineReady.set(false)
    needRefresh.set(false)
  }

  $: toast = $offlineReady || $needRefresh;
</script>

{#if toast}
  <div
    class="pwa-toast"
    role="alert"
  >
    <div class="message">
      {#if $offlineReady}
      <span>
        App ready to work offline
      </span>
      {:else}
      <span>
        New content available, click on reload button to update.
      </span>
      {/if}
    </div>
    {#if $needRefresh}
      <button on:click={() => updateServiceWorker(true)}>
        Reload
      </button>
    {/if}
    <button on:click={close}>
      Close
    </button>
  </div>
{/if}

<style>
    .pwa-toast {
        position: fixed;
        right: 0;
        bottom: 0;
        margin: 16px;
        padding: 12px;
        border: 1px solid #8885;
        border-radius: 4px;
        z-index: 1;
        text-align: left;
        box-shadow: 3px 4px 5px 0 #8885;
        background-color: white;
    }
    .pwa-toast .message {
        margin-bottom: 8px;
    }
    .pwa-toast button {
        border: 1px solid #8885;
        outline: none;
        margin-right: 5px;
        border-radius: 2px;
        padding: 3px 10px;
    }
</style>
```

:::

## Periodic SW Updates

As explained in [Periodic Service Worker Updates](/guide/periodic-sw-updates), you can use this code to configure this behavior on your application with the virtual module `virtual:pwa-register/svelte`:

```ts
import { useRegisterSW } from 'virtual:pwa-register/svelte'

const intervalMS = 60 * 60 * 1000

const updateServiceWorker = useRegisterSW({
  onRegistered(r) {
    r && setInterval(() => {
      r.update()
    }, intervalMS)
  }
})
```

The interval must be in milliseconds, in the example above it is configured to check the service worker every hour.

---

---
url: /examples/sveltekit.md
---

# SvelteKit

You can find a set of examples in the [@vite-pwa/sveltekit integration repo](https://github.com/vite-pwa/sveltekit/tree/main/examples).

---

---
url: /frameworks/sveltekit.md
---

# SvelteKit

::: tip
From version `^0.6.7`, `SvelteKitPWA` adds support for [Single-page apps](https://svelte.dev/docs/kit/single-page-apps): check [SPA](#spa) section for more information.
:::

::: tip
From version `^0.1.0`, `SvelteKitPWA` has SvelteKit `^1.0.0` as peer dependency.
:::

::: info
For `Type declarations`, `Prompt for update` and `Periodic SW Updates` go to [Svelte](/frameworks/svelte) entry.
:::

::: tip
If you're using `0.1.*` version of `SvelteKitPWA`, you should remove all references to [SvelteKit service worker module](https://kit.svelte.dev/docs/service-workers) to disable it on your application.
:::

## Installing @vite-pwa/sveltekit

To install the `@vite-pwa/sveltekit` plugin, just add it to your project as a `dev dependency`:
::: code-group

```bash [pnpm]
pnpm add -D @vite-pwa/sveltekit
```

```bash [yarn]
yarn add -D @vite-pwa/sveltekit
```

```bash [npm]
npm install -D @vite-pwa/sveltekit
```

:::

## Workbox Configuration
