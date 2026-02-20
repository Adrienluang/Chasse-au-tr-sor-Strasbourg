### SPA

If you are using SvelteKit SPA mode, the `static-adapter` will create the fallback after `@vite-pwa/sveltekit` plugin generates the service worker, and so the plugin doesn't have access to the adapter fallback page to include the revision in the service worker precache manifest.

To generate the revision for the fallback page, the plugin will use the `.svelte-kit/output/client/_app/version.json` file.

You can configure the `spa.fallbackRevision` function to generate a custom revision.

## PWA Assets &#x20;

We suggest you using external configuration file, `@vite-pwa/sveltekit` plugin will watch it for changes, avoiding dev server restarts. If you use inlined configuration, Vite will restart the dev server when changing any option.

To inject the PWA icons links and the `theme-color`, you can use the `virtual:pwa-assets/head` virtual module in your `+layout.svelte` component:

* add `import 'vite-plugin-pwa/pwa-assets';` to your `src/app.d.ts` file
* remove all links with rel `icon`, `apple-touch-icon` and `apple-touch-startup-image` from `<svelte:head>` or from your `app.html` file
* remove the `theme-color` meta tag from `<svelte:head>` or from your `app.html` file
* add the virtual import
* include theme color and icons links using code-snippet shown below

```html
<script>
import { pwaAssetsHead } from 'virtual:pwa-assets/head';
</script>

<svelte:head>
  {#if pwaAssetsHead.themeColor}
  <meta name="theme-color" content={pwaAssetsHead.themeColor.content} />
  {/if}
  {#each pwaAssetsHead.links as link}
  <link {...link} />
  {/each}
</svelte:head>
```

You can find a working example in the [examples folder](https://github.com/vite-pwa/sveltekit/tree/main/examples/sveltekit-ts-assets-generator).

---

---
url: /guide/testing-service-worker.md
---

# Testing Service Worker

There are quite a few test libraries, `vite-plugin-pwa` uses [Vitest](https://vitest.dev/) for build testing and [Playwright](https://playwright.dev/) for in-browser testing (with the Chromium browser only).

You can check any framework example in the `examples` folder in the corresponding repo:

* [vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa/tree/main/examples)
* [@vite-pwa/nuxt](https://github.com/vite-pwa/nuxt) (in root folder)
* [@vite-pwa/sveltekit](https://github.com/vite-pwa/sveltekit/tree/main/examples)

and the corresponding contributing guide:

* [running tests in vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa/blob/main/CONTRIBUTING.md#running-tests)
* [running tests in @vite-pwa/nuxt](https://github.com/vite-pwa/nuxt/blob/main/CONTRIBUTING.md#running-tests)
* [running tests in @vite-pwa/sveltekit](https://github.com/vite-pwa/sveltekit/blob/main/CONTRIBUTING.md#running-tests)

`vite-plugin-pwa` and `@vite-pwa/nuxt` have been added to the [Vite ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) and [Nuxt ecosystem-ci](https://github.com/nuxt/ecosystem-ci) respectively to detect possible regressions in new Vite/Nuxt versions:

* [Discord Vite ecosystem-ci](https://discord.com/channels/804011606160703521/928398470086291456)
* [Discord Nuxt ecosystem-ci](https://discord.com/channels/473401852243869706/1098558476483055656)

We're also working to include `@vite-pwa/sveltekit` in the [Svelte ecosystem-ci](https://github.com/sveltejs/svelte-ecosystem-ci).

## Testing build

Check `vitest.config.mts` in the root folder and the `test` folder in each example.

You have a `test` script in each example `package.json` file to run build and in-browser tests.

## Testing in-browser

Check `playwright.config.ts` in the root folder and the `client-test` folder in each example.

You have a `test` script in each example `package.json` file to run build and in-browser tests.

In this case, we also need to start a server to run the tests, check `webServer` in `playwright.config.ts`.

---

---
url: /guide/unregister-service-worker.md
---

# Unregister Service Worker

If you want to unregister the service worker from your PWA application, you only need to add `selfDestroying: true` to the plugin configuration.

`vite-plugin-pwa` plugin will create a new special service worker and replace the existing one in your application once deployed in production: it has to be put in the place of the previous broken/unwanted service worker, with the same name.

::: info
From version `0.17.2+`, the service worker will delete all of its cache storage entries.
:::

::: danger
It is **IMPORTANT TO NOT CHANGE ANYTHING** in the plugin configuration, especially **DO NOT CHANGE THE SERVICE WORKER NAME**, just keep the options and the PWA UI components (if included), the plugin will take care of changing the service worker and avoid interacting with the UI if configured.
:::

In a future, if you want to add the PWA again to your application, you only need to remove the `selfDestroying` option or just disable it: `selfDestroying: false`.

## Custom `selfDestroying` Service Worker

If you want to remove the current deployed service worker but installing a new one, don't use `selfDestroying`:

* create a new JavaScript file with the current deployed service worker name in the `public` folder, check the example below
* change `filename` in the PWA configuration (this will generate a new service worker with the new name)

For example, if you don't specify the `filename`, the service worker name will be `sw.js` (default). Change the `filename` PWA option to `service-worker.js` or other name different to `sw.js`, then add the following code to `public/sw.js` file (the current deployed service worker):

```js
// public/sw.js
self.addEventListener('install', (e) => {
  self.skipWaiting()
})
self.addEventListener('activate', (e) => {
  self.registration.unregister()
    .then(() => self.clients.matchAll())
    .then((clients) => {
      clients.forEach((client) => {
        if (client instanceof WindowClient)
          client.navigate(client.url)
      })
      return Promise.resolve()
    })
    .then(() => {
      self.caches.keys().then((cacheNames) => {
        Promise.all(
          cacheNames.map((cacheName) => {
            return self.caches.delete(cacheName)
          })
        )
      })
    })
})
```

You can repeat the above process as many times as necessary, **remember not to delete** any service worker from the public directory (you don't know what version the users of your application have installed).

## Development

You can also check the `selfDestroying` plugin option in the dev server with development options enabled: check [Development section](/guide/development) for more info.

## Examples

You have in the examples folder the `**-destroy` scripts in their corresponding `package.json`, you can try it on the development server or from the production build.

## Credits

The implementation is based on this GitHub repo [Self-destroying ServiceWorker](https://github.com/NekR/self-destroying-sw), for more info read [Medium: Self-destroying ServiceWorker](https://medium.com/@nekrtemplar/self-destroying-serviceworker-73d62921d717).

---

---
url: /.vitepress/theme/components/TypeScriptError2307.md
---
If your **TypeScript** build step or **IDE** complain about not being able to find modules or type definitions on imports, add the following to the `compilerOptions.types` array of your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": [
      "vite-plugin-pwa/client"
    ]
  }
}
```

Or you can add the following reference in any of your `d.ts` files (for example, in `vite-env.d.ts` or `global.d.ts`):

```ts
/// <reference types="vite-plugin-pwa/client" />
```

---

---
url: /.vitepress/theme/components/ScaffoldingPWAProject.md
---
::: tip Compatibility Note
Vite requires [Node.js](https://nodejs.org/en/) version 18.x.x or 20+. However, some templates may require a higher Node.js version to work, please upgrade Node if your package manager warns about it.
:::

::: code-group

```bash [pnpm]
$ pnpm create @vite-pwa/pwa
```

```bash [yarn]
$ yarn create @vite-pwa/pwa
```

```bash [npm]
$ npm create @vite-pwa/pwa@latest
```

```bash [bun]
$ bun create @vite-pwa/pwa
```

:::

Then follow the prompts!

You can also directly specify the project name and the template you want to use via additional command line options. For example, to scaffold a Vite PWA + Vue project, run:

::: code-group

```bash [pnpm]
$ pnpm create @vite-pwa/pwa my-vue-app --template vue
```

```bash [yarn]
$ yarn create @vite-pwa/pwa my-vue-app --template vue
```

```bash [npm]
$ npm create @vite-pwa/pwa@latest my-vue-app -- --template vue
```

```bash [bun]
$ bun create @vite-pwa/pwa my-vue-app --template vue
```

:::

See [create-pwa](https://github.com/vite-pwa/create-pwa) for more details on each supported template: `vanilla`, `vanilla-ts`, `vue`, `vue-ts`, `react`, `react-ts`, `preact`, `preact-ts`, `lit`, `lit-ts`, `svelte`, `svelte-ts`, `solid`, `solid-ts` (templates can be found inside the `templates` folder).

---

---
url: /.vitepress/theme/components/ServiceWorkerClientErrors.md
---
Check [New Vite Build](/guide/change-log#new-vite-build) section for more details, the error described below has been fixed in `v0.18.0+` and there is no need to use `iife` format to build your service worker.

If your service worker code is being compiled with unexpected `exports` (for example: `export default require_sw();`), you can change the build output format to `iife`, add the following code to your pwa configuration:

```ts
injectManifest: {
  rollupFormat: 'iife'
}
```

---

---
url: /.vitepress/theme/components/ExamplesGenerateSW.md
---
`generateSW` has the following behaviors:

---

---
url: /.vitepress/theme/components/InjectManifestCleanupOutdatedCaches.md
---
When the user installs the new version of the application, we will have on the service worker cache all new assets and also the old ones. To delete old assets (from previous versions that are no longer necessary), and since you are building your own service worker, you will need to add the following code to your custom service worker:

```js
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)
```

We strongly recommend you to include previous code on your custom service worker.

---

---
url: /.vitepress/theme/components/GenerateSWSourceMap.md
---
Since plugin version `0.11.2`, your service worker's source map will not be generated as it uses the `build.sourcemap` option from the Vite config, which by default is `false`.

Your service worker source map will be generated when Vite's `build.sourcemap` configuration option has the value `true`,  `'inline'` or `'hidden'`, and you have not configured the `workbox.sourcemap` option in the plugin configuration.  If you configure the `workbox.sourcemap` option, the plugin will not change that value.

If you want to generate the source map of your service worker, you can use this code:

```ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      workbox: {
        sourcemap: true
      }
    })
  ]
})
```

---

---
url: /.vitepress/theme/components/GenerateSWCleanupOutdatedCaches.md
---
When the browser detects and installs the new version of your application, it will have in the cache storage all new assets and also the old ones. To delete old assets (from previous versions that are no longer necessary), you have to configure an option in the `workbox` entry of the plugin configuration.

When using the `generateSW` strategy, it is not necessary to configure it, the plugin will activate it by default.

We strongly recommend you to **NOT** deactivate the option. If you are curious, you can deactivate it using the following code in your plugin configuration:

```ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      workbox: {
        cleanupOutdatedCaches: false
      }
    })
  ]
})
```

---

---
url: /.vitepress/theme/components/ChangeLog.md
---
::: info
Check [change log page for more info](/guide/change-log.html).
:::

---

---
url: /.vitepress/theme/components/InjectManifestSourceMap.md
---
::: info
From `v0.18.0+` you can use `minify`, `sourcemap` and `enableWorkboxModulesLogs` in your `injectManifest` configuration option, check [New Vite Build](/guide/change-log#new-vite-build) section for more details.
:::

Since you are building your own service worker, this plugin will use Vite's `build.sourcemap` configuration option, which default value is `false`, to generate the source map.

If you want to generate the source map for your service worker, you will need to generate the source map for the entire application.

---

---
url: /.vitepress/theme/components/ReactReactiveWarning.md
---
::: warning
The options provided to hooks are not reactive. Therefore, the callback references will be the first rendered options instead of the latest hook’s options. If you are doing complex logic with state changes, you will need to provide a stable reference function.
:::

---

---
url: /.vitepress/theme/components/InjectManifestBuild.md
---
From `v0.18.0`, `vite-plugin-pwa` adds five new options to `injectManifest` option to allow customizing the service worker build output:

* `target`: you can change the `target` build, the plugin will use the Vite's [build.target](https://vitejs.dev/config/build-options.html#build-target) option if not configured
* `minify`: you can change the `minify` build, the plugin will use the Vite's [build.minify](https://vitejs.dev/config/build-options.html#build-minify) option if not configured
* `sourcemap`: you can change the `sourcemap` build, the plugin will use the Vite's [build.sourcemap](https://vitejs.dev/config/build-options.html#build-sourcemap) option if not configured
* `enableWorkboxModulesLogs`: you can enable/disable the `workbox` modules log for a development or production build, by default, the plugin will use `process.env.NODE_ENV` (Workbox modules logs logic will be removed from the service worker in `production` build: dead code elimination)
* `buildPlugins`: you can add custom Rollup and/or Vite plugins to the service worker build

The new Vite build will allow you to use [.env Files](https://vitejs.dev/guide/env-and-mode.html#env-files), the `mode` option in your PWA configuration will not be used when using `injectManifest` strategy, the plugin will use the Vite's [mode](https://vitejs.dev/config/#mode) option instead:

* use `import.meta.env.MODE` to access the Vite mode inside your service worker.
* use `import.meta.env.DEV` or `import.meta.env.PROD` to check if the service worker is running on development or production (equivalent to `process.env.NODE_ENV`), check Vite [NODE\_ENV and Modes](https://vitejs.dev/guide/env-and-mode#node-env-and-modes) docs.

::: tip
If you are using TypeScript in your service worker accessing `import.meta.env` variables, if TypeScript complains, add the following reference to the beginning of your service worker code:

```ts
/// <reference types="vite/client" />
```

:::

---

---
url: /.vitepress/theme/components/CleanupOutdatedCaches.md
---
The service worker will store all your application assets in a browser cache (or set of caches). Every time you make changes to your application and rebuild it, the `service worker` will also be rebuilt, including in its precache manifest all new modified assets, which will have their revision changed (all assets that have been modified will have a new version). Assets that have not been modified will also be included in the service worker precache manifest, but their revision will not change from the previous one.

::: tip Precache Manifest Entry Revision
The precache manifest entry revision is just a `MD5` hash of the asset content, if an asset is not modified, the calculated hash will be always the same.
:::

---

---
url: /.vitepress/theme/components/SsrSsg.md
---
If you are using `SSR/SSG`, you need to import `virtual:pwa-register` module using dynamic import and checking if `window` is not `undefined`.

You can register the service worker on `src/pwa.ts` module:

```ts
import { registerSW } from 'virtual:pwa-register'

registerSW({ /* ... */ })
```

and then import it from your `main.ts`:

```ts
if (typeof window !== 'undefined')
  import('./pwa')
```

You can see the [FAQ](/guide/faq#navigator-window-is-undefined) entry for more info.

---

---
url: /.vitepress/theme/components/ExamplesInjectManifest.md
---
`injectManifest` has the following behavior:

---

---
url: /.vitepress/theme/components/RunExamples.md
---
::: warning
Before following the instructions below, read the [Contribution Guide](https://github.com/antfu/vite-plugin-pwa/blob/main/CONTRIBUTING.md).
:::

Make sure you install project dependencies, and build the repo on your local clone/fork:

```bash
cd vite-plugin-pwa
pnpm install
pnpm run build
```

To run the examples, execute the following script from your shell (from root folder), it will start a CLI where you will select the framework and the pwa options:

```shell
pnpm run examples
```

If you don't run `pnpm build` first, you may see an error like, `failed to load config` or `Please verify that the package.json has a valid "main" entry`.

---

---
url: /.vitepress/theme/components/HeuristicWorkboxWindow.md
---
::: warning
**This only applies when importing any of the virtual modules or using `workbox-window` module**.

Since `workbox-window` uses a time-based `heuristic` algorithm to handle service worker updates, if you build your service worker and register it again, if the time between last registration and the new one is less than 1 minute, then, `workbox-window` will handle the `service worker update found` event as an external event, and so the behavior could be strange (for example, if using `prompt`, instead showing the dialog for new content available, the ready  to work offline dialog will be shown; if using `autoUpdate`, the ready to work offline dialog will be shown and shouldn't be shown).
:::

---

---
url: /.vitepress/theme/components/ExamplesBehaviors.md
---
* `Prompt for update`:
  * Show `Ready to work offline` on first visit and once the `service worker` ready.
  * Show `Prompt for update` when new `service worker` available.

* `Auto update`:
  * Show `Ready to work offline` on first visit and once the `service worker` ready.
  * When new content available, the service worker will be updated automatically.

* `Prompt for update` with `Periodic service worker updates`:
  * Show `Ready to work offline` on first visit and once the `service worker` ready.
  * Show `Prompt for update` when new `service worker` available.
  * The example project will register a `Periodic service worker updates`

* `Auto update` with `Periodic service worker updates`:
  * Show `Ready to work offline` on first visit and once the `service worker` ready.
  * The example project will register a `Periodic service worker updates`
  * When new content available, the service worker will be updated automatically.

---

---
url: /deployment/vercel.md
---

# Vercel

## Instructions

This guide provides step-by-step instructions on how to deploy a Vite PWA on Vercel, including specific configurations for HTTP headers using a `vercel.json` file.
