### Cross-Request State Pollution {#cross-request-state-pollution}

In the State Management chapter, we introduced a [simple state management pattern using Reactivity APIs](state-management#simple-state-management-with-reactivity-api). In an SSR context, this pattern requires some additional adjustments.

The pattern declares shared state in a JavaScript module's root scope. This makes them **singletons** - i.e. there is only one instance of the reactive object throughout the entire lifecycle of our application. This works as expected in a pure client-side Vue application, since the modules in our application are initialized fresh for each browser page visit.

However, in an SSR context, the application modules are typically initialized only once on the server, when the server boots up. The same module instances will be reused across multiple server requests, and so will our singleton state objects. If we mutate the shared singleton state with data specific to one user, it can be accidentally leaked to a request from another user. We call this **cross-request state pollution.**

We can technically re-initialize all the JavaScript modules on each request, just like we do in browsers. However, initializing JavaScript modules can be costly, so this would significantly affect server performance.

The recommended solution is to create a new instance of the entire application - including the router and global stores - on each request. Then, instead of directly importing it in our components, we provide the shared state using [app-level provide](/guide/components/provide-inject#app-level-provide) and inject it in components that need it:

```js [app.js]
// (shared between server and client)
import { createSSRApp } from 'vue'
import { createStore } from './store.js'

// called on each request
export function createApp() {
  const app = createSSRApp(/* ... */)
  // create new instance of store per request
  const store = createStore(/* ... */)
  // provide store at the app level
  app.provide('store', store)
  // also expose store for hydration purposes
  return { app, store }
}
```

State Management libraries like Pinia are designed with this in mind. Consult [Pinia's SSR guide](https://pinia.vuejs.org/ssr/) for more details.
