### Service Worker Code

You **must** include in your service worker code at least this code (you also need to install `workbox-core` as `dev dependency` to your project):

```js
import { clientsClaim } from 'workbox-core'

self.skipWaiting()
clientsClaim()
```

## Prompt For Update Behavior

If you need your custom service worker works with `Prompt For Update` behavior, you need to change your service worker code.
