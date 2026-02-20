### Using Application UI Framework

If you're using some Application UI Framework in your Astro application, you can use/import the corresponding PWA plugin virtual module:

* [Vue 3](/frameworks/vue)
* [React](/frameworks/react)
* [Svelte](/frameworks/svelte)
* [SolidJS](/frameworks/solidjs)
* [Preact](/frameworks/preact)

Check also the documentation for [Astro Frameworks Components](https://docs.astro.build/en/core-concepts/framework-components/) for more information.

## Navigation Fallback

If you have a `404` route, you can use it as the fallback navigation for your service worker.

When using `generateSW` strategy, configure the `404` route in the `workbox` pwa integration option:

```ts
AstroPWA({
  workbox: { navigateFallback: '/404' }
})
```

If you are using `injectManifest` strategy, configure the `404` route in the navigation fallback in your custom service worker:

```ts
registerRoute(new NavigationRoute(createHandlerBoundToURL('/404')))
```

## Experimental
