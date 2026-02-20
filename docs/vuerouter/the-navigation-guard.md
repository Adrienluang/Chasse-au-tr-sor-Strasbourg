### The Navigation Guard

The bulk of the logic of data loaders is handled with navigation guards:

* one `router.beforeEach()` to collect loaders from lazy loaded components
* one `router.beforeResolve()` (triggers after other guards) to execute the loaders

`router.afterEach()` and `router.onError()` are also used to handle errors and cleanup.

Handling the data loading in a navigation guards has the following advantages:

* Ensure data is present before mounting the component
* Flexibility to not wait for non critical data with lazy data loaders
* Enables the UX pattern of letting the browser handle loading state (aligns with [future Navigation API](https://github.com/WICG/navigation-api))
* Makes scrolling work out of the box when navigating between pages (when data loaders are blocking)
* Ensure one single request per loader and navigation
* Allows controlling the navigation (aborting, redirecting, etc)

#### Controlling the navigation

Since the data fetching happens within a navigation guard, it's possible to control the navigation like in regular navigation guards:

* Thrown errors (or rejected Promises) cancel the navigation (same behavior as in a regular navigation guard) and are intercepted by [Vue Router's error handling](https://router.vuejs.org/api/interfaces/router.html#onerror)
* Redirection: `return new NavigationResult(targetLocation)` -> like `return targetLocation` in a regular navigation guard
* Cancelling the navigation: `return new NavigationResult(false)` like `return false` in a regular navigation guard
* Any other returned value is considered as the *resolved data*

```ts{1,11,14}
import { NavigationResult } from 'vue-router'

export const useUserData = defineLoader(
  async (to) => {
    try {
      const user = await getUserById(to.params.id)

      return user
    } catch (error) {
      if (error.status === 404) {
        return new NavigationResult({ name: 'not-found', params: { pathMatch: '' } }
        )
      } else {
        throw error // aborts the vue router navigation
      }
    }
  }
)
```

`new NavigationResult()` accepts as its only argument anything that [can be returned in a navigation guard](https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards) to alter the navigation. e.g. it doesn't accept `true` or `undefined` as these do not modify the navigation.

Some alternatives:

::: details

* `createNavigationResult()`: too verbose
* `NavigationResult()` (no `new`): `NavigationResult` is not a primitive so it should use `new`
* Accept a second argument for extra custom context that can be retrieved in `selectNavigationResult()`

:::

::: tip

Throwing an error does not trigger the `selectNavigationResult()` method. Instead, it immediately cancels the navigation and triggers the `router.onError()` method, just like in a regular navigation guard.

:::

#### Handling multiple navigation results

Since navigation loaders can run in parallel, they can return different navigation results as well. In this case, you can decide which result should be used by providing a `selectNavigationResult()` method to [`DataLoaderPlugin`](#data-loader-setup):

```ts{3-6} twoslash
import 'vue-router/auto-routes'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { DataLoaderPlugin } from 'vue-router/experimental'
const app = createApp({})
const router = createRouter({
  history: createWebHistory(),
  routes: [],
})
// ---cut---
// @moduleResolution: bundler
// @noErrors
app.use(DataLoaderPlugin, {
  router,
  selectNavigationResult(results) {
    for (const { value } of results) {
      if (
        typeof value === 'object' &&
        'name' in value &&
        value.name === 'not-found'
      ) {
        return value
      }
    }
  },
})
```

`selectNavigationResult()` is called with an array of all the returned `new NavigationResult(value)` **after all data loaders** have been resolved. **If any of them throws an error** or if none of them return a `NavigationResult`, `selectNavigationResult()` isn't called.

By default, `selectNavigation` returns the first value of the array.

#### Eagerly changing the navigation

If a loader wants to eagerly alter the navigation, it can `throw` the `NavigationResult` instead of returning it. This skips the `selectNavigationResult()` and take precedence without triggering `router.onError()`.

```ts{10-15}
import { NavigationResult } from 'vue-router/experimental'

export const useUserData = defineLoader(
  async (to) => {
    try {
      const user = await getUserById(to.params.id)

      return user
    } catch (error) {
      throw new NavigationResult({
        name: 'not-found',
        params: { pathMatch: to.path.split('/') },
        query: to.query,
        hash: to.hash,
      })
    }
  }
)
```

::: info

When using vue router named views, each named view can have their own loaders but note any navigation to the route will trigger **all loaders from all page components**. This is because the router doesn't know which named views will be used.

:::
