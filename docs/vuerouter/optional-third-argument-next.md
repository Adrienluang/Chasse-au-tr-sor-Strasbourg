### Optional third argument `next`

In previous versions of Vue Router, it was also possible to use a *third argument* `next`, this was a common source of mistakes and went through an [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0037-router-return-guards.md#motivation) to remove it. However, it is still supported, meaning you can pass a third argument to any navigation guard. In that case, **you must call `next` exactly once** in any given pass through a navigation guard. It can appear more than once, but only if the logical paths have no overlap, otherwise the hook will never be resolved or produce errors. Here is **a bad example** of redirecting the user to `/login` if they are not authenticated:

```js
// BAD
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  // if the user is not authenticated, `next` is called twice
  next()
})
```

Here is the correct version:

```js
// GOOD
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})
```

## Global Resolve Guards

You can register a global guard with `router.beforeResolve`. This is similar to `router.beforeEach` because it triggers on **every navigation**, but resolve guards are called right before the navigation is confirmed, **after all in-component guards and async route components are resolved**. Here is an example that ensures the user has given access to the Camera for routes that [have defined a custom meta](./meta.md) property `requiresCamera`:

```js
router.beforeResolve(async to => {
  if (to.meta.requiresCamera) {
    try {
      await askForCameraPermission()
    } catch (error) {
      if (error instanceof NotAllowedError) {
        // ... handle the error and then cancel the navigation
        return false
      } else {
        // unexpected error, cancel the navigation and pass the error to the global handler
        throw error
      }
    }
  }
})
```

`router.beforeResolve` is the ideal spot to fetch data or do any other operation that you want to avoid doing if the user cannot enter a page.

## Global After Hooks

You can also register global after hooks, however unlike guards, these hooks do not get a `next` function and cannot affect the navigation:

```js
router.afterEach((to, from) => {
  sendToAnalytics(to.fullPath)
})
```

They are useful for analytics, changing the title of the page, accessibility features like announcing the page and many other things.

They also reflect [navigation failures](./navigation-failures.md) as the third argument:

```js
router.afterEach((to, from, failure) => {
  if (!failure) sendToAnalytics(to.fullPath)
})
```

Learn more about navigation failures on [its guide](./navigation-failures.md).

## Global injections within guards

Since Vue 3.3, it is possible to use `inject()` within navigation guards. This is useful for injecting global properties like the [pinia stores](https://pinia.vuejs.org). Anything that is provided with `app.provide()` is also accessible within `router.beforeEach()`, `router.beforeResolve()`, `router.afterEach()`:

```ts [main.ts]
const app = createApp(App)
app.provide('global', 'hello injections')

// router.ts or main.ts
router.beforeEach((to, from) => {
  const global = inject('global') // 'hello injections'
  // a pinia store
  const userStore = useAuthStore()
  // ...
})
```

## Per-Route Guard

You can define `beforeEnter` guards directly on a route's configuration object:

```js
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from) => {
      // reject the navigation
      return false
    },
  },
]
```

`beforeEnter` guards **only trigger when entering the route**, they don't trigger when the `params`, `query` or `hash` change e.g. going from `/users/2` to `/users/3` or going from `/users/2#info` to `/users/2#projects`. They are only triggered when navigating **from a different** route.

You can also pass an array of functions to `beforeEnter`, this is useful when reusing guards for different routes:

```js
function removeQueryParams(to) {
  if (Object.keys(to.query).length)
    return { path: to.path, query: {}, hash: to.hash }
}

function removeHash(to) {
  if (to.hash) return { path: to.path, query: to.query, hash: '' }
}

const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: [removeQueryParams, removeHash],
  },
  {
    path: '/about',
    component: UserDetails,
    beforeEnter: [removeQueryParams],
  },
]
```

When working with [nested routes](../essentials/nested-routes), both parent and child routes can use `beforeEnter`. When placed on a parent route, it won't be triggered when moving between children with that same parent. For example:

```js
const routes = [
  {
    path: '/user',
    beforeEnter() {
      // ...
    },
    children: [
      { path: 'list', component: UserList },
      { path: 'details', component: UserDetails },
    ],
  },
]
```

The `beforeEnter` in the example above won't be called when moving between `/user/list` and `/user/details`, as they share the same parent. If we put the `beforeEnter` guard directly on the `details` route instead, that would be called when moving between those two routes.

::: tip
It is possible to achieve similar behavior to per-route guards by using [route meta fields](./meta) and global navigation guards.
:::

## In-Component Guards

Finally, you can directly define route navigation guards inside route components (the ones passed to the router configuration)
