### PWA Installation Status&#x20;

`@vite-pwa/nuxt` provides the new `$pwa?.isPWAInstalled` reactive property to check if your PWA application is installed.

## Registering Web Manifest

To register the PWA web manifest in your Nuxt 3 application, `@vite-pwa/nuxt` provides the functional components `VitePwaManifest` and `NuxtPwaManifest`, you should add one of them to your `app.vue` or to all of your layouts (add only `VitePwaManifest` or `NuxtPwaManifest`).

::: tip
You can enable `registerWebManifestInRouteRules` property in PWA configuration to register the web manifest in Nitro `routeRules` property: useful for example if your application is deployed to Netlify.
:::

## Payload Extraction &#x20;

When you enable the experimental `payloadExtraction` flag in your Nuxt configuration file, `@vite-pwa/nuxt` will add `**/_payload.json` to the `globPatterns` array inside `workbox` or `injectManifest` option, depending on the configured  `strategy`.

## App Manifest  &#x20;

When you enable the experimental `appManifest` flag in your Nuxt configuration file, `@vite-pwa/nuxt` will:

* add `_nuxt/builds/**/*.json` to the `globPatterns` array inside `workbox` or `injectManifest` option, depending on the configured  `strategy`
* remove `revision` entry from all service worker precache manifest files inside `_nuxt/builds/` folder  matching `<UUID>.json` pattern ([UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) is a random generated string by Nuxt).

## TypeScript

```ts
export interface PwaInjection {
  /**
   * @deprecated use `isPWAInstalled` instead
   */
  isInstalled: boolean
  /**
   * From version v0.3.5+.
   */
  isPWAInstalled: Ref<boolean>
  showInstallPrompt: Ref<boolean>
  cancelInstall: () => void
  install: () => Promise<void>
  swActivated: Ref<boolean>
  registrationError: Ref<boolean>
  offlineReady: Ref<boolean>
  needRefresh: Ref<boolean>
  updateServiceWorker: (reloadPage?: boolean | undefined) => Promise<void>
  cancelPrompt: () => Promise<void>
  getSWRegistration: () => ServiceWorkerRegistration | undefined
}

declare module '#app' {
  interface NuxtApp {
    $pwa: UnwrapNestedRefs<PwaInjection>
  }
}
```

## Examples
