### SSR/SSG

---

---
url: /guide/pwa-minimal-requirements.md
---

# PWA Minimal Requirements

Previous steps in this guide, are the minimal requirements and configuration to create the [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) and the service worker when you build your application, but you'll need to include more options to meet PWA Minimal Requirements.

Your application **must** meet the PWA Minimal Requirements before deploying it to production or when testing your build on local: for example, when testing your PWA application on local using `LightHouse`.

To make your PWA application installable (one of the requirements), you will need to modify your application entry point, add some minimal entries to your `Web App Manifest`, allow search engines to crawl all your application pages and configure your server properly (only for production, on local you can use `https-localhost` dependency and `node`).

Check also the new [PWA Minimal Requirements](/assets-generator/#pwa-minimal-icons-requirements) page in the [PWA Assets Generator](/assets-generator/) section.

## Entry Point

Your application entry point (usually `index.html`) **must** have the following entries in the `<head>` section:

* mobile viewport configuration
* a title
* a description
* a favicon, check the following pages: https://dev.to/masakudamatsu/favicon-nightmare-how-to-maintain-sanity-3al7 and this old one https://www.leereamsnyder.com/blog/favicons-in-2021
* a link for `apple-touch-icon`
* a link for `mask-icon` (right now there is no need to provide a `mask-icon`)
* a meta entry for `theme-color`

For example, a minimal configuration (you must provide all the icons and images):

```html
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>My Awesome App</title>
  <meta name="description" content="My Awesome App description">
  <link rel="icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
  <link rel="mask-icon" href="/mask-icon.svg" color="#FFFFFF">
  <meta name="theme-color" content="#ffffff">
</head>
```

## Web App Manifest

Your application [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) **must** have the following entries:

* a scope: omitted here for simplicity, the `vite-plugin-pwa` plugin will use the `Vite` base option to configure it (default is `/`)
* a name
* a short description
* a description
* a `theme_color`: **must match** the configured one on `Entry Point theme-color`
* an icon with `192x192` size
* an icon with `512x512` size

To configure the [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest), add the `manifest` entry to the `vite-plugin-pwa` plugin options.

Following with the example, here a minimal configuration (you must provide all the icons and images):

```ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'My Awesome App',
        short_name: 'MyApp',
        description: 'My Awesome App description',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

You can also specify `manifest: false` to disable the `Web App Manifest` generation adding your own `manifest.webmanifest/manifest.json` file to the `public` folder on your application.

The `vite-plugin-pwa` has the full definition of the `Web App Manifest` options, if you want to have DX support when using your own web manifest, add the following entry to your custom web manifest (VSCode and JetBrains IDEs will use it to provide DX support):

```json
{
  "$schema": "https://json.schemastore.org/web-manifest-combined.json"
}
```

## Icons / Images

:::tip
Check out the [PWA Assets Generator](/assets-generator/) to generate all the icons and images required for your PWA application.

You can also use [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator) to generate all your PWA application's icons.
:::

For `manifest` icons entry, you will need to create `pwa-192x192.png`, and `pwa-512x512.png` icons. The icons specified above are the minimum required to meet PWA, that is, icons with `192x192` and `512x512` resolutions.

We suggest creating a svg or png icon (if it is a png icon, with the maximum resolution possible) for your application and use it to generate your PWA icons:

* [PWA Assets Generator](/assets-generator/) (recommended).
* [Favicon InBrowser.App](https://favicon.inbrowser.app/tools/favicon-generator) (recommended).
* [Favicon Generator](https://realfavicongenerator.net/).

For `mask-icon` in the entry point, use the svg or the png used to generate the favicon package.

Once generated, download the ZIP and use `android-*` icons for `pwa-*`:

* use `android-chrome-192x192.png` for `pwa-192x192.png`
* use `android-chrome-512x512.png` for `pwa-512x512.png`
* `apple-touch-icon.png` is `apple-touch-icon.png`
* `favicon.ico` is `favicon.ico`

If you want you can add the `purpose: 'any maskable'` icon to the Web App Manifest, but it is better to add 2 icons with `any` and `maskable` purposes:

```ts
icons: [
  {
    src: 'pwa-192x192.png',
    sizes: '192x192',
    type: 'image/png'
  },
  {
    src: 'pwa-512x512.png',
    sizes: '512x512',
    type: 'image/png'
  },
  {
    src: 'pwa-512x512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'any'
  },
  {
    src: 'pwa-512x512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable'
  }
]
```

## Search Engines

You **must** add a `robots.txt` file to allow search engines to crawl all your application pages, just add `robots.txt` to the `public` folder on your application:

```txt
User-agent: *
Allow: /
```

:::warning
`public` folder must be on the root folder of your application, not inside the `src` folder.
:::

## Server Configuration

You can use the server you want, but your server **must**:

* serve `manifest.webmanifest` with `application/manifest+json` mime type
* serve your application over `https`
* redirect from `http` to `https`

You can find more information in the [Deploy](/deployment/) section.

---

---
url: /frameworks/qwik.md
---

# Qwik

Check the [@qwikdev/pwa](https://github.com/QwikDev/pwa) repository for more details, it is still in its early stages.

This repository is not using `vite-plugin-pwa` directly (maybe in a future), but it is using Workbox.

---

---
url: /examples/qwik.md
---

# Qwik

Check the [@qwikdev/pwa](https://github.com/QwikDev/pwa) repository for more details, it is still in its early stages.

This repository is not using `vite-plugin-pwa` directly (maybe in a future), but it is using Workbox.

---

---
url: /examples/react.md
---

# React

The `React` example project can be found on [examples/react-router](https://github.com/vite-pwa/vite-plugin-pwa/tree/main/examples/react-router) package/directory.

The router used on this example project is [react-router](https://reactrouter.com/).

To test `new content available`, you should rerun the corresponding script, and then refresh the page.

If you are running an example with `Periodic SW updates`, you will need to wait 1 minute:


## Executing the examples

## generateSW

## injectManifest

---

---
url: /frameworks/react.md
---

# React

You can use the built-in `Vite` virtual module `virtual:pwa-register/react` for `React` which will return `useState` stateful values (`useState<boolean>`) for `offlineReady` and `needRefresh`.

::: warning
You will need to add `workbox-window` as a `dev` dependency to your `Vite` project.
:::

## Type declarations

::: tip

From version `0.14.5` you can also use types definition for react instead of `vite-plugin-pwa/client`, you can use:

```json
{
  "compilerOptions": {
    "types": [
      "vite-plugin-pwa/react"
    ]
  }
}
```

Or you can add the following reference in any of your `d.ts` files (for example, in `vite-env.d.ts` or `global.d.ts`):

```ts
/// <reference types="vite-plugin-pwa/react" />
```

:::

```ts
declare module 'virtual:pwa-register/react' {
  import type { Dispatch, SetStateAction } from 'react'
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types'

  export type { RegisterSWOptions }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [boolean, Dispatch<SetStateAction<boolean>>]
    offlineReady: [boolean, Dispatch<SetStateAction<boolean>>]
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}
```

## Prompt for update

You can use this `ReloadPrompt.tsx` component:

:::details ReloadPrompt.tsx

```tsx
import React from 'react'
import './ReloadPrompt.css'

import { useRegisterSW } from 'virtual:pwa-register/react'

function ReloadPrompt() {
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
    <div className="ReloadPrompt-container">
      { (offlineReady || needRefresh)
        && <div className="ReloadPrompt-toast">
            <div className="ReloadPrompt-message">
              { offlineReady
                ? <span>App ready to work offline</span>
                : <span>New content available, click on reload button to update.</span>
              }
            </div>
            { needRefresh && <button className="ReloadPrompt-toast-button" onClick={() => updateServiceWorker(true)}>Reload</button> }
            <button className="ReloadPrompt-toast-button" onClick={() => close()}>Close</button>
        </div>
      }
    </div>
  )
}

export default ReloadPrompt
```

:::

and its corresponding `ReloadPrompt.css` styles file:

:::details ReloadPrompt.css

```css
.ReloadPrompt-container {
    padding: 0;
    margin: 0;
    width: 0;
    height: 0;
}
.ReloadPrompt-toast {
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
.ReloadPrompt-toast-message {
    margin-bottom: 8px;
}
.ReloadPrompt-toast-button {
    border: 1px solid #8885;
    outline: none;
    margin-right: 5px;
    border-radius: 2px;
    padding: 3px 10px;
}
```

:::

## Periodic SW Updates

As explained in [Periodic Service Worker Updates](/guide/periodic-sw-updates), you can use this code to configure this behavior on your application with the virtual module `virtual:pwa-register/react`:

```ts
import { useRegisterSW } from 'virtual:pwa-register/react'

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
url: /guide/register-service-worker.md
---

# Register Service Worker

`vite-plugin-pwa` plugin will register the service worker automatically for you, using the `injectRegister` configuration option (**optional**).

If you want to configure the `injectRegister` plugin option:

```ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      injectRegister: 'auto'
    })
  ]
})
```

The `injectRegister` plugin configuration option, will control how to register the service worker in your application:

* `inline`: injects a simple register script, inlined in the application entry point
* `script`: injects a `script` tag in the `head` with the `src` attribute to a generated script to register the service worker
* `script-defer` : injects a `script` tag with `defer` attribute in the `head` with the `src` attribute to a generated script to register the service worker
* `null` (manual): do nothing, you will need to register the service worker yourself, or import any of the virtual modules exposed by the plugin
* **`auto` (default value)**: depends on whether you use any of the virtual modules exposed by the plugin, it will do nothing or switch to `script` mode

You can find more information about the virtual modules exposed by the plugin in the [Frameworks](/frameworks/) section.

## Inline Registration

When configuring `injectRegister: 'inline'` in the plugin configuration, the plugin will inline a head script adding in to your application entry point:
::: details **inlined head script**

```html
<head>
  <script>
    if('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
      })
    }
  </script>
</head>
```

:::

## Script Registration

When configuring `injectRegister: 'script' | 'script-defer'` in the plugin configuration, the plugin will generate a `registerSW.js` script adding it to your application entry point:
::: details **head script**

```html
<head>
  <script src="/registerSW.js"></script>
</head>
```

:::

::: details **/registerSW.js**

```js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
  })
}
```

:::

## Manual Registration

When configuring `injectRegister: null` in the plugin configuration, the plugin will do nothing, you must register the service workbox manually yourself.

Or you can import any of the virtual modules exposed by the plugin.

If you're using `injectManifest` strategy in development with `devOptions` enabled, you should check [injectManifest development section](/guide/development#injectmanifest-strategy) to get details on getting the right ServiceWorker URL for your development setup.

## Auto Registration

If your application code base is not importing any of the virtual modules exposed by the plugin, the plugin will fallback to [Script Registration](/guide/register-service-worker#script-registration), otherwise, the imported virtual module will register the service worker for you.

---

---
url: /examples/remix.md
---

# Remix

You can find a set of examples in the [@vite-pwa/remix integration repo](https://github.com/vite-pwa/remix/tree/main/examples).

---

---
url: /frameworks/remix.md
---

# Remix

::: warning
This PWA module can only be used with Vite.
:::

## Remix PWA module

`vite-plugin-pwa` provides the new `@vite-pwa/remix` module that will allow you to use `vite-plugin-pwa` in your Remix applications via `Vite` plugin and `Remix` preset.

You will need to install `@vite-pwa/remix`:
::: code-group

```bash [pnpm]
pnpm add -D @vite-pwa/remix
```

```bash [yarn]
yarn add -D @vite-pwa/remix
```

```bash [npm]
npm install -D @vite-pwa/remix
```

:::

Then in your Vite configuration file, import the `@vite-pwa/remix` helper and create the Remix PWA Preset and the Vite PWA Plugin and configure them:

```ts
// vite.config.js
import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { defineConfig } from 'vite'
import { RemixVitePWA } from '@vite-pwa/remix'

installGlobals()

const { RemixVitePWAPlugin, RemixPWAPreset } = RemixVitePWA()

export default defineConfig({
  plugins: [
    remix({
      presets: [RemixPWAPreset()],
    }),
    RemixVitePWAPlugin({
      // PWA options
    })
  ]
})
```

Check Remix [PWA Options](https://github.com/vite-pwa/remix/blob/main/src/types.ts) for further details.

## Custom Service Worker

When using `injectManifest` strategy, `@vite-pwa/remix` exposes a virtual module `virtual:vite-pwa/remix/sw` with the Remix information you can consume in your service worker (configuration from Remix and the `remix` PWA option):

```ts
import {
  cleanupOutdatedCaches,
  clientsClaimMode,
  dynamicRoutes,
  enablePrecaching,
  navigateFallback,
  promptForUpdate,
  routes,
  staticRoutes,
  ssr,
} from 'virtual:vite-pwa/remix/sw'
```

If you are using TypeScript you can include `@vite-pwa/remix/remix-sw` in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["@vite-pwa/remix/remix-sw"]
  }
}
```

or just include a triple slash comment in your service worker file:

```ts
/// <reference types="@vite-pwa/remix/remix-sw" />
```

You can also import PWA options via `@vite-pwa/remix/sw` (see next section):

```ts
import {
  cleanupOutdatedCaches,
  clientsClaimMode,
  enablePrecaching,
  navigateFallback,
  promptForUpdate,
  staticRoutes,
  dynamicRoutes,
  routes,
  ssr,
} from '@vite-pwa/remix/sw'
```
