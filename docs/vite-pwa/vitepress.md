### VitePress

You can check the [ReloadPrompt](https://github.com/antfu/vite-plugin-pwa/blob/main/docs/.vitepress/theme/components/ReloadPrompt.vue) component of this site to call the PWA virtual module:

```vue
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'

const needRefresh = ref(false)

let updateServiceWorker: (() => Promise<void>) | undefined

function onNeedRefresh() {
  needRefresh.value = true
}
async function close() {
  needRefresh.value = false
}

onBeforeMount(async () => {
  const { registerSW } = await import('virtual:pwa-register')
  updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh,
  })
})
</script>
```

## Monorepo with multiple projects and frameworks

From version `0.14.5`, `vite-plugin-pwa` includes types for each framework, and so you can import proper virtual module in your monorepo project. Instead using [client.d.ts](https://github.com/vite-pwa/vite-plugin-pwa/blob/main/client.d.ts) via `vite-plugin-pwa/client` (tsconfig.json file or TypeScript reference), use one of the following virtual modules:

* `virtual:pwa-register/react`: configure `vite-plugin-pwa/react`.
* `virtual:pwa-register/preact`: configure `vite-plugin-pwa/preact`.
* `virtual:pwa-register/solid`: configure `vite-plugin-pwa/solid`.
* `virtual:pwa-register/svelte`: configure `vite-plugin-pwa/svelte`.
* `virtual:pwa-register/vanillajs`: configure `vite-plugin-pwa/vanillajs`.
* `virtual:pwa-register/vue`: configure `vite-plugin-pwa/vue`.

You can find some examples for `preact`, `solid` and `svelte` in the examples folder in the [vite-plugin-pwa repo](https://github.com/vite-pwa/vite-plugin-pwa/tree/main/examples).

## Suppress workbox-build warnings in dev

If you are using `vite-plugin-pwa` with `generateSW` strategy, you can suppress `workbox-build` warnings in dev using `suppressWarnings` dev option:

```ts
devOptions: {
  suppressWarnings: true
}
```

Enabling this option, `vite-plugin-pwa` dev plugin will:

* generate an empty `suppress-warnings.js` file in the `dev-dist` folder.
* change `workbox.globPatterns` option to `[*.js']`.

---

---
url: /workbox/generate-sw.md
---

# generateSW

You must read [Which Mode to Use](https://developer.chrome.com/docs/workbox/modules/workbox-build/#which-mode-to-use) before decide using this strategy on `vite-plugin-pwa` plugin.

You can find the documentation for this method on `workbox` site: [generateSW](https://developer.chrome.com/docs/workbox/modules/workbox-build#method-generateSW).

You can find a guide for plugins on `workbox` site: [Using Plugins](https://developer.chrome.com/docs/workbox/using-plugins/).

## Cache External Resources

If you use some `CDN` to download some resources like `fonts` and `css`, you must include them into the service worker precache, and so your application will work when offline.

The following example will use `css` from `https://fonts.googleapis.com` and `fonts` from `https://fonts.gstatic.com`.

On `index.html` file you must configure the `css` `link`, you **MUST** also include `crossorigin="anonymous"` attribute for the external resources  (see [Handle Third Party Requests](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime#cross-origin_considerations)):

::: details index.html

```html
<head>
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://fonts.gstatic.com">
  <link rel="preconnect" crossorigin="anonymous" href="https://fonts.googleapis.com">
  <link rel="preconnect" crossorigin="anonymous" href="https://fonts.gstatic.com">
  <link rel="stylesheet" crossorigin="anonymous" href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap">
</head>
```

:::

Then on your `vite.config.ts` file add the following code:

::: details VitePWA options

```ts
VitePWA({
  workbox: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'gstatic-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          },
        }
      }
    ]
  }
})
```

:::

## Exclude routes

To exclude some routes from being intercepted by the service worker, you just need to add those routes using a `regex` list to the `navigateFallbackDenylist` option of `workbox`:

```ts
VitePWA({
  workbox: {
    navigateFallbackDenylist: [/^\/backoffice/]
  }
})
```

::: warning
You must deal with offline support for excluded routes: if requesting a page excluded on `navigateFallbackDenylist` you will get `No internet connection`.
:::

## Background Sync

You can add this code to the plugin on your `vite.config.ts` file to add a `Background Sync` manager to your service worker:

::: details VitePWA options

```ts
VitePWA({
  workbox: {
    runtimeCaching: [{
      handler: 'NetworkOnly',
      urlPattern: /\/api\/.*\.json/,
      method: 'POST',
      options: {
        backgroundSync: {
          name: 'myQueueName',
          options: {
            maxRetentionTime: 24 * 60
          }
        }
      }
    }]
  }
})
```

:::

---

---
url: /deployment.md
---

# Getting Started

Since you need to install your application as a [Progressive Web App](https://web.dev/explore/progressive-web-apps), you must configure your server to meet [PWA Minimal Requirements](/guide/pwa-minimal-requirements), that is, your server **must**:

* serve `manifest.webmanifest` with `application/manifest+json` mime type
* you must serve your application over `https`
* you must redirect from `http` to `https`

## Cache-Control

Ensure you have a very restrictive setup for your `Cache-Control` headers in place.

Double check that **you do not** have caching features enabled, especially `immutable`, on locations like:

* `/`
* `/sw.js`
* `/index.html`
* `/manifest.webmanifest`

::: danger
**Always re-test and re-assure** that the caching for mission critical files is **as low** as possible if not hashed files or you might invalidate clients for a long time.
:::

## Servers

* [Netlify](/deployment/netlify)
* [AWS Amplify](/deployment/aws)
* [Vercel](/deployment/vercel)
* [NGINX](/deployment/nginx)
* [Apache Http Server 2.4+](/deployment/apache)

## Testing your application on production

Once you deploy your application to your server, you can test it using [WebPageTest](https://www.webpagetest.org/).

There are many test sites, but we suggest you use `WebPageTest` as this is the most comprehensive in terms of test:

* Security.
* First byte time.
* Keep alive enabled.
* Compress transfer.
* Cache static content.
* Effective use of CDN.
* Lighthouse: Core Web Vitals, Performance, Images size optimization...
* And more...

Enter the url of your application, click `Start Test` button, wait for the test to finish, the `WebPageTest` result will hint you what things on your application must be fixed/changed. The `WebPageTest` result will also score your application, it will also test your site with `Lighthouse`.

For example, go to [WebPageTest](https://www.webpagetest.org/), enter `https://vite-pwa-org.netlify.app/`, click `Start Test` button, wait a few seconds for the test to finish, and see the results for this site.

---

---
url: /examples.md
---

# Getting Started

You can find a set of examples projects on [Vite Plugin PWA GitHub repo](https://github.com/antfu/vite-plugin-pwa/tree/main/examples).

All the examples projects are under `examples` package/directory of the repo root directory.

::: info
The main purpose of these examples projects is to test the service worker and not to meet the [PWA Minimal Requirements](/guide/pwa-minimal-requirements), that is, if you use any of these examples for your projects, you will need to modify the code supplied and then test that it meets the [PWA Minimal Requirements](/guide/pwa-minimal-requirements). Almost all the examples projects should meet [PWA Minimal Requirements](/guide/pwa-minimal-requirements), but you must check it on your target project.

All the examples projects use `@rollup/plugin-replace` to configure a timestamp initialized to `now` on each build, and so, the service worker will be regenerated/versioned on each build: this timestamp will help us since the service worker won't be regenerated/versioned if none source code changed (on your project you shouldn't want this behavior,  you should want to only regenerate/version the service worker when your source code change).
:::

::: warning TRY TO AVOID INCLUDING AUTOMATIC TIMESTAMP ON YOU APPLICATION IF YOU DON'T CHANGE YOUR CODE
We use the timestamp in the examples projects to avoid having to touch a file each time we need to test: for example, to test `Prompt for update`, we need to install the service worker first time (first build), then rebuild and restart the example project and finally refresh the browser to check the `Prompt for update` is shown.
:::

## How to run examples projects?

If you want to run any of the examples projects you will need to download/clone to your local machine the `Vite Plugin PWA GitHub repo`.

You will need `node 14` (or newer) to be able to build the `Vite Plugin PWA`.

::: warning
Before following the instructions below, read the [Contribution Guide](https://github.com/antfu/vite-plugin-pwa/blob/main/CONTRIBUTING.md).
:::

If you don't have installed `PNPM`, you must install it globally via `npm`:

```shell
npm install -g pnpm
```

Once the repo is on your local machine, you must install project dependencies and build the `vite-plugin-pwa` plugin, just run (from `vite-plugin-pwa` directory cloned locally):

```shell
pnpm install
pnpm run build
```

We use `PNPM` but should work with any `package manager`, for example, with `YARN`:

```shell
yarn && yarn build
```

::: info
From here on, we will only show the commands to run the examples projects using `PNPM`, we leave it to you how to execute them with any other` package manager`.
:::

Before we start running the examples projects, you should consider the following:

* Use `Chromium based` browser: `Chrome`, `Chromium` or `Edge`
* All the examples that are executed in this guide will be done over https, that is, all the projects will respond at address `https://localhost`
* When testing an example project, the `service worker` will be installed in `https://localhost`, and so, subsequent tests in another examples projects may interfere with the previous test, because the `service worker` of the previous project will keep installed on the browser
* Tests should be done on a private window, and so, browser addons/plugins will not interfere with the test

To avoid `service worker` interference, you should do the following tasks when switching between examples projects:

* Open `dev tools` (`Option + ⌘ + J` on `macOS`, `Shift + CTRL + J` on `Windows/Linux`)
* Go to `Application > Storage`, you should check following checkboxes:
  * Application: \[x] Unregister service worker
  * Storage: \[x] Local and session storage
  * Cache: \[x] Cache storage and \[x] Application cache
* Click on `Clear site data` button
* Go to `Application > Service Workers` and check the current `service worker` is missing or has the state `deleted`

Once we remove the `service worker`, run the corresponding script and just press browser `Refresh` button (or enter `https://localhost` on browser address).

## How to test the examples projects Offline?

To test any of the examples projects (or your project) on `offline`, just open `dev tools` (`Option + ⌘ + J` on `macOS`, `Shift + CTRL + J` on  `Windows/Linux`) and go to `Application > Network`, then locate `No throttling` selector: open it and select `Offline` option.

A common pitfall is to select `Offline` option, then restart the example project (or your project), and refresh the page. In that case, you will have unexpected behavior, and you should remove the service worker.

If you click the browser `Refresh` button, you can inspect `Application > Network` tab on `dev tools` to check that the `Service Worker` is serving all assets instead request them to the server.

::: danger
Don't do a `hard refresh` since it will force the browser to go to the server, and then you will get `No internet connection` page.
:::

## Available Examples Projects

We provide the following examples projects:

* [Vue 3](/examples/vue)
  * [Vue 3 generateSW Router Examples](/examples/vue#generatesw): set of examples with disparate behaviors.
  * [Vue 3 injectManifest Router Examples](/examples/vue#generatesw): set of examples with disparate behaviors.
* [React](/examples/react)
  * [React generateSW Router Examples](/examples/react#generatesw): set of examples with disparate behaviors.
  * [React injectManifest Router Examples](/examples/react#generatesw): set of examples with disparate behaviors.
* [Svelte](/examples/svelte)
  * [Svelte generateSW Router Examples](/examples/svelte#generatesw): set of examples with disparate behaviors.
  * [Svelte injectManifest Router Examples](/examples/svelte#generatesw): set of examples with disparate behaviors.
* [SvelteKit](/examples/sveltekit)
* [SolidJS](/examples/solidjs)
  * [SolidJS generateSW Router Examples](/examples/solidjs#generatesw): set of examples with disparate behaviors.
  * [SolidJS injectManifest Router Examples](/examples/solidjs#generatesw): set of examples with disparate behaviors.
* [Preact](/examples/preact)
  * [Preact generateSW Router Examples](/examples/preact#generatesw): set of examples with disparate behaviors.
  * [Preact injectManifest Router Examples](/examples/preact#generatesw): set of examples with disparate behaviors.
* [VitePress](/examples/vitepress).
* [îles](/examples/iles): prompt for update.
* [Astro](/examples/astro).

---

---
url: /frameworks.md
---

# Getting Started

::: tip
If you use the default `registerType` which is `prompt`, and you want to prompt the users to reload, then you could use our framework modules.

But if you:

1. use `autoUpdate`
2. don't like `autoUpdate`, but also don't feel it's necessary to prompt
3. use `injectManifest`

Then, you **don't need** to learn the framework stuff.
:::

This plugin is Framework-agnostic and so you can use it with Vanilla JavaScript, TypeScript and with any framework.

## Type declarations

You can find all the `vite-plugin-pwa` virtual modules declarations in the following [types.ts module](https://github.com/antfu/vite-plugin-pwa/blob/main/client.d.ts).

::: tip

From version `0.14.5` you can also use types definition for each framework, instead of using `vite-plugin-pwa/client`, include only one of the following types:

```json
{
  "compilerOptions": {
    "types": [
      "vite-plugin-pwa/react",
      "vite-plugin-pwa/preact",
      "vite-plugin-pwa/solid",
      "vite-plugin-pwa/svelte",
      "vite-plugin-pwa/vanillajs",
      "vite-plugin-pwa/vue"
    ]
  }
}
```

Or you can add one of following references in any of your `d.ts` files (for example, in `vite-env.d.ts` or `global.d.ts`):

```ts
/// <reference types="vite-plugin-pwa/react" />
/// <reference types="vite-plugin-pwa/preact" />
/// <reference types="vite-plugin-pwa/solid" />
/// <reference types="vite-plugin-pwa/svelte" />
/// <reference types="vite-plugin-pwa/vanillajs" />
/// <reference types="vite-plugin-pwa/vue" />
```

:::

```ts
declare module 'virtual:pwa-register' {
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types'

  export type { RegisterSWOptions }

  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>
}
```

where `vite-plugin-pwa/types` is:

```ts
export interface RegisterSWOptions {
  immediate?: boolean
  onNeedRefresh?: () => void
  onOfflineReady?: () => void
  /**
   * Called only if `onRegisteredSW` is not provided.
   *
   * @deprecated Use `onRegisteredSW` instead.
   * @param registration The service worker registration if available.
   */
  onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
  /**
   * Called once the service worker is registered (requires version `0.12.8+`).
   *
   * @param swScriptUrl The service worker script url.
   * @param registration The service worker registration if available.
   */
  onRegisteredSW?: (swScriptUrl: string, registration: ServiceWorkerRegistration | undefined) => void
  onRegisterError?: (error: any) => void
}
```

## Accessing PWA Info

From version `0.12.8`, `vite-plugin-pwa` exposes a new Vite virtual module to access the PWA info: [virtual:pwa-info](https://github.com/vite-pwa/vite-plugin-pwa/blob/main/info.d.ts).

If your **TypeScript** build step or **IDE** complain about not being able to find modules or type definitions on imports, add the following to the `compilerOptions.types` array of your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": [
      "vite-plugin-pwa/info"
    ]
  }
}
```

Or you can add the following reference in any of your `d.ts` files (for example, in `vite-env.d.ts` or `global.d.ts`):

```ts
/// <reference types="vite-plugin-pwa/info" />
```

## Import Virtual Modules

`vite-plugin-pwa` plugin exposes a `Vite` virtual module to interact with the service worker.

::: tip
You only need to import the virtual modules exposed by `vite-plugin-pwa` plugin when you need to interact with the user, otherwise you don't need to import any of them, that is, when using `registerType: 'prompt'` or when using `registerType: 'autoUpdate'` and you want to inform the user that the application is ready to work offline.
:::
