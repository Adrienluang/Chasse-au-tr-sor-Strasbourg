### *Disconnecting* a loader from a page

It is also possible **not to connect a loader to a page**. This allows you to delay the loading until the component is mounted. Usually you want to start loading the data as soon as possible but in some cases, it might be better to wait until the component is mounted. This can be achieved by not exporting the loader from the page component.

---

---
url: /guide/essentials/history-mode.md
---
# Different History modes

The `history` option when creating the router instance allows us to choose among different history modes.

## HTML5 Mode

The HTML5 mode is created with `createWebHistory()` and is the recommended mode:

```js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    //...
  ],
})
```

When using `createWebHistory()`, the URL will look "normal," e.g. `https://example.com/user/id`. Beautiful!

Here comes a problem, though: Since our app is a single page client side app, without a proper server configuration, the users will get a 404 error if they access `https://example.com/user/id` directly in their browser. Now that's ugly.

Not to worry: To fix the issue, all you need to do is add a simple catch-all fallback route to your server. If the URL doesn't match any static assets, it should serve the same `index.html` page that your app lives in. Beautiful, again!

## Hash Mode

The hash history mode is created with `createWebHashHistory()`:

```js
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    //...
  ],
})
```

It uses a hash character (`#`) before the actual URL that is internally passed. Because this section of the URL is never sent to the server, it doesn't require any special treatment on the server level. **It does however have a bad impact in SEO**. If that's a concern for you, use the HTML5 history mode.

## Memory mode

The memory history mode doesn't assume a browser environment and therefore doesn't interact with the URL **nor automatically triggers the initial navigation**. This makes it perfect for Node environment and SSR. It is created with `createMemoryHistory()` and **requires you to push the initial navigation** after calling `app.use(router)`.

```js
import { createRouter, createMemoryHistory } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    //...
  ],
})
```

While it's not recommended, you can use this mode inside Browser applications but note **there will be no history**, meaning you won't be able to go *back* or *forward*.

## Example Server Configurations

**Note**: The following examples assume you are serving your app from the root folder. If you deploy to a subfolder, you should use [the `publicPath` option of Vue CLI](https://cli.vuejs.org/config/#publicpath) and the related [`base` property of the router](../../api/interfaces/Router.md#createWebHistory). You also need to adjust the examples below to use the subfolder instead of the root folder (e.g. replacing `RewriteBase /` with `RewriteBase /name-of-your-subfolder/`).
