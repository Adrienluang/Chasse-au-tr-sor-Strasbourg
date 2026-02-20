### Prompt For Update

When using `registerType: 'prompt'`, you **must** import the virtual module:

```ts
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {}
})
```

You will need to:

* show a prompt to the user with refresh and cancel buttons inside `onNeedRefresh` method.
* show a ready to work offline message to the user with an OK button inside `onOfflineReady` method.

When the user clicks the "refresh" button when `onNeedRefresh` called, then call `updateSW()` function; the page will reload and the up-to-date content will be served.

In any case, when the user clicks the `Cancel` or `OK` buttons in case `onNeedRefresh` or `onOfflineReady` respectively, close the corresponding showed prompt.

## Custom Vite Virtual Modules

`vite-plugin-pwa` plugin also exposes a set of virtual modules for [Vue 3](https://v3.vuejs.org/), [React](https://reactjs.org/), [Svelte](https://svelte.dev/docs), [SolidJS](https://www.solidjs.com/) and [Preact](https://preactjs.com/).

These custom virtual modules will expose a wrapper for  virtual:pwa-register using framework reactivity system, that is:

* virtual:pwa-register/vue: [ref](https://v3.vuejs.org/api/refs-api.html#ref) for Vue 3
* virtual:pwa-register/react: [useState](https://reactjs.org/docs/hooks-reference.html#usestate) for React
* virtual:pwa-register/svelte: [writable](https://svelte.dev/docs#writable) for Svelte
* virtual:pwa-register/solid: [createSignal](https://www.solidjs.com/docs/latest/api#createsignal) for SolidJS
* virtual:pwa-register/preact: [useState](https://preactjs.com/guide/v10/hooks#usestate) for Preact

**Note**: for [Vue 2](https://vuejs.org/) you need to use a custom `mixin` provided on [Vue 2](/frameworks/vue#vue-2) section.

## Frameworks

These custom virtual modules will expose a wrapper for virtual:pwa-register using framework reactivity system, that is:

* [Vue](/frameworks/vue)
* [React](/frameworks/react)
* [Svelte](/frameworks/svelte)
* [SvelteKit](/frameworks/sveltekit)
* [SolidJS](/frameworks/solidjs)
* [Preact](/frameworks/preact)
* [VitePress](/frameworks/vitepress)
* [îles](/frameworks/iles)
* [Astro](/frameworks/astro)
* [Nuxt 3](/frameworks/nuxt)

---

---
url: /guide.md
---

# Getting Started

Progressive Web Apps (PWAs) are web applications built and enhanced with modern APIs to deliver enhanced capabilities, reliability, and installability while reaching anyone, anywhere, on any device—all with a single codebase.

At a high level, a PWA consists of a [web application manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) to give the browser information about your app, and a service worker to manage the offline experience.

If you are new to Progressive Web Apps, you might consider reading Google's ["Learn PWA"](https://web.dev/learn/pwa/) course before you begin.

## Service Worker

Service workers essentially act as proxy servers that sit between web applications, the browser, and the network (when available). They are intended, among other things, to enable the creation of effective offline experiences, intercept network requests and take appropriate action based on whether the network is available, and update assets residing on the server. They will also allow access to push notifications and background sync APIs.

A service worker is an event-driven [worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker) registered against an origin and a path. It takes the form of a JavaScript file that can control the web-page/site that it is associated with, intercepting and modifying navigation and resource requests, and caching resources in a very granular fashion to give you complete control over how your app behaves in certain situations (the most obvious one being when the network is not available).

You can find more information about service workers in [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).

## Vite PWA

Vite PWA will help you to turn your existing applications into PWAs with very little configuration. It comes preset with sensible defaults for common use cases.

The `vite-plugin-pwa` plugin can:

* Generate the [web application manifest][webmanifest] and add it to your entry point (see the [setup guide for manifest generation](pwa-minimal-requirements#web-app-manifest)).
* Generate the service worker using the `strategies` option (for more information, see ["Service Worker Strategies"](/guide/service-worker-strategies-and-behaviors#service-worker-strategies) section)
* Generate a script to register the service worker in the browser (see the ["Register Service Worker"](/guide/register-service-worker) section)

## Scaffolding Your First Vite PWA Project&#x20;

## Installing vite-plugin-pwa

To install the `vite-plugin-pwa` plugin, just add it to your project as a `dev dependency`:

::: code-group

```bash [pnpm]
pnpm add -D vite-plugin-pwa
```

```bash [yarn]
yarn add -D vite-plugin-pwa
```

```bash [npm]
npm install -D vite-plugin-pwa
```

:::

## Configuring vite-plugin-pwa

Edit your `vite.config.js / vite.config.ts` file and add the `vite-plugin-pwa`:

```ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({ registerType: 'autoUpdate' })
  ]
})
```

With this minimal configuration of the `vite-plugin-pwa` plugin, your application is now able to generate the [Web App Manifest][webmanifest] and inject it at the entry point, generate the service worker and register it in the browser.

You can find the full list of the `vite-plugin-pwa` plugin configuration options in the following [client.d.ts](https://github.com/antfu/vite-plugin-pwa/blob/main/src/types.ts).

::: warning
If you are **NOT** using `vite-plugin-pwa` version `0.12.2+`, there is a bug handling `injectRegister` (the service worker generated will not include the code required to allow work with `autoUpdate` behavior).

If you're using a `vite-plugin-pwa` plugin version prior to `0.12.2`, you can fix the bug using this plugin configuration:

```ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        clientsClaim: true,
        skipWaiting: true
      }
    })
  ]
})
```

:::

If you want to check it in `dev`, add the `devOptions` option to the plugin configuration (you will have the [Web App Manifest][webmanifest] and the generated service worker):

```ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      }
    })
  ]
})
```

If you build your application, the [Web App Manifest][webmanifest] will be generated and configured on the application entry point, the service worker will be also generated and the script/module to register it in the browser added.

::: info
`vite-plugin-pwa` plugin uses [workbox-build](https://developer.chrome.com/docs/workbox/modules/workbox-build) node library to build the service worker, you can find more information in the [Service Worker Strategies And Behaviors](/guide/service-worker-strategies-and-behaviors) and [Workbox](/workbox/) sections.
:::

[webmanifest]: https://developer.mozilla.org/en-US/docs/Web/Manifest

---

---
url: /assets-generator.md
---

# Getting Started

[@vite-pwa/assets-generator](https://github.com/vite-pwa/assets-generator) will generate all the icons required for your PWA application using [sharp](https://github.com/lovell/sharp/) and [sharp-ico](https://github.com/ssnangua/sharp-ico) packages.

This package has been developed based on the work done in [Elk PWA Icon Generator Script](https://github.com/elk-zone/elk/blob/main/scripts/generate-pwa-icons.ts).

With a single image source you can generate all the required icons for your PWA application, via `@vite-pwa/assets-generator` [CLI](/assets-generator/cli) or [API](/assets-generator/api).

## Source images

We strongly recommend using SVG images as source images, as they will be resized to the required sizes without losing quality, but should also work with any image type.

The svg sources can also be used in for the favicon html head link.

## PWA Minimal Icons Requirements

As pointed out in [PWA Minimal Requirements](/guide/pwa-minimal-requirements), you will need:

* a 192x192 icon (PWA Manifest icon)
* a 512x512 icon (PWA Manifest icon)
* a 180x180 icon for iOS/MacOS (html head link: `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`)

We also suggest you to include:

* A 64x64 icon for Windows (Edge) (PWA Manifest icon)
* A 512x512 icon for Android with `purpose: 'any'` (PWA Manifest icon)
* Avoid using `purpose: 'any maskable'` icon, as it is not supported by all browsers
* An `favicon.ico` and `favicon.svg`, check [Preset Minimal 2023](#preset-minimal-2023) for more details
