### New `history` option to replace `mode`

The `mode: 'history'` option has been replaced with a more flexible one named `history`. Depending on which mode you were using, you will have to replace it with the appropriate function:

* `"history"`: `createWebHistory()`
* `"hash"`: `createWebHashHistory()`
* `"abstract"`: `createMemoryHistory()`

Here is a full snippet:

```js
import { createRouter, createWebHistory } from 'vue-router'
// there is also createWebHashHistory and createMemoryHistory

createRouter({
  history: createWebHistory(),
  routes: [],
})
```

On SSR, you need to manually pass the appropriate history:

```js
// router.js
let history = isServer ? createMemoryHistory() : createWebHistory()
let router = createRouter({ routes, history })
// somewhere in your server-entry.js
router.push(req.url) // request url
router.isReady().then(() => {
  // resolve the request
})
```

**Reason**: enable tree shaking of non used histories as well as implementing custom histories for advanced use cases like native solutions.
