### Creating the router instance

The router instance is created by calling the function `createRouter()`:

```js
import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './HomeView.vue'
import AboutView from './AboutView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
```

The `routes` option defines the routes themselves, mapping URL paths to components. The component specified by the `component` option is the one that will be rendered by the `<RouterView>` in our earlier `App.vue`. These route components are sometimes referred to as *views*, though they are just normal Vue components.

Routes support various other options that we'll see later in the guide, but for now we only need `path` and `component`.

The `history` option controls how routes are mapped onto URLs and vice versa. For the Playground example we're using `createMemoryHistory()`, which ignores the browser URL entirely and uses its own internal URL instead. That works well for the Playground, but it's unlikely to be what you'd want in a real application. Typically, you'd want to use `createWebHistory()` instead, or perhaps `createWebHashHistory()`. We'll cover that topic in more detail in the guide to [History modes](./essentials/history-mode).
