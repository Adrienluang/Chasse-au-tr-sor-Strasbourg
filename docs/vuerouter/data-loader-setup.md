### Data Loader Setup

`DataLoaderPlugin` adds the [navigation guard](#the-navigation-guard) that handles the data loaders. It requires access to the router instance to attach the navigation guard as well as some other options:

* `router`: The Vue Router instance.
* `selectNavigationResult` (optional): Called wih an array of `NavigationResult` returned by loaders. It allows to decide the *fate* of the navigation that was modified by loaders. See [NavigationResult](#handling-multiple-navigation-results)

```ts{2,9}
import { createApp } from 'vue'
import { createRouter } from 'vue-router'
import { DataLoaderPlugin } from 'vue-router/experimental'

const router = createRouter({
  // ...
})

const app = createApp(App)
app.use(DataLoaderPlugin, { router })
// add the router after the DataLoaderPlugin
app.use(router)
```

It's important to add the `DataLoaderPlugin` before the router to ensure the navigation guards are attached before the router initiates the first navigation.
