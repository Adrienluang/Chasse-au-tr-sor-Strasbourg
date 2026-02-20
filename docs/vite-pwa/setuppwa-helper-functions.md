### `setupPwa` helper functions

`@vite-pwa/remix` provides an internal `setupPWA` module you can use to register a default implementation (similar to Workbox recipes), using the `remix` \`PWA options and Remix configuration:

* cleanup outdated caches: Workbox's `cleanupOutdatedCaches` in `generateSW` Workbox build module for `injectManifest` strategy
* clients claim mode: similar to Workbox's `cleanupOutdatedCaches` in `generateSW` Workbox build module for `injectManifest` strategy
* precaching and offline configuration

You only need to import `setupPWA` from `@vite-pwa/remix/sw` and call it in your service worker:

```ts
import { setupPwa } from '@vite-pwa/remix/sw'

setupPwa({ manifest: self.__WB_MANIFEST })
```
