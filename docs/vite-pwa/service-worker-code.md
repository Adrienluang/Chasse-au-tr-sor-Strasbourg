### Service Worker Code

Your custom service worker (`public/sw.js`) should have at least this code (you also need to install `workbox-precaching` as `dev dependency` to your project):

```js
import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)
```

If you're not using `precaching` (`self.__WB_MANIFEST`), you need to disable `injection point` to avoid compilation errors (available only from version `^0.14.0`), add the following option to your pwa configuration:

```ts
injectManifest: {
  injectionPoint: undefined
}
```
