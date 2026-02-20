### Using the Composition API

If you are writing your component using the Composition API, you can add update and leave guards through `onBeforeRouteUpdate` and `onBeforeRouteLeave` respectively. Please refer to the [Composition API section](./composition-api.md#navigation-guards) for more details.

## The Full Navigation Resolution Flow

1. Navigation triggered.
2. Call `beforeRouteLeave` guards in deactivated components.
3. Call global `beforeEach` guards.
4. Call `beforeRouteUpdate` guards in reused components.
5. Call `beforeEnter` in route configs.
6. Resolve async route components.
7. Call `beforeRouteEnter` in activated components.
8. Call global `beforeResolve` guards.
9. Navigation is confirmed.
10. Call global `afterEach` hooks.
11. DOM updates triggered.
12. Call callbacks passed to `next` in `beforeRouteEnter` guards with instantiated instances.

---

---
url: /data-loaders/nested-loaders.md
---
# Nested loaders

Sometimes, requests depend on other fetched data (e.g. fetching additional user information). For these scenarios, we can simply import the other loaders and use them **within a different loader**:

Call **and `await`** the loader inside the one that needs it, it will only be fetched once no matter how many times it is called during a navigation:

```ts twoslash
import 'vue-router/auto-routes'
import { defineBasicLoader } from 'vue-router/experimental'
// ---cut---
// import the loader for user information
import { useUserData } from './loaders/users'
import { getCommonFriends, getCurrentUser } from './api'

export const useUserCommonFriends = defineBasicLoader(async route => {
  // loaders must be awaited inside other loaders
  // .        ⤵
  const user = await useUserData()

  // fetch other data
  const me = await getCurrentUser()
  const commonFriends = await getCommonFriends(me.id, user.id)
  return { ...user, commonFriends }
})
```

You will notice here that we have two different usages for `useUserData()`:

* One that returns all the necessary information we need *synchronously* (not used here). This is the composable that we use in components
* A second version that **only returns a promise of the data**. This is the version used within data loaders that enables sequential fetching.

## Nested invalidation

Since `useUserCommonFriends()` loader calls `useUserData()`, if `useUserData()` is somehow *invalidated*, it will also automatically invalidate `useUserCommonFriends()`. This depends on the implementation of the loader and is not a requirement of the API.

::: warning
Two loaders cannot use each other as that would create a *dead lock*.
:::

This can get complex with multiple pages exposing the same loader and other pages using some of their *already exported* loaders within other loaders. But it's not an issue, **the user shouldn't need to handle anything differently**, loaders are still only called once:

```ts twoslash
import 'vue-router/auto-routes'
import { defineBasicLoader } from 'vue-router/experimental'
// ---cut---
import {
  getFriends,
  getCommonFriends,
  getUserById,
  getCurrentUser,
} from './api'

export const useUserData = defineBasicLoader('/users/[id]', async route => {
  return getUserById(route.params.id)
})

export const useCurrentUserData = defineBasicLoader(
  '/users/[id]',
  async route => {
    const me = await getCurrentUser()
    // imagine legacy APIs that cannot be grouped into one single fetch
    const friends = await getFriends(me.id)

    return { ...me, friends }
  }
)

export const useUserCommonFriends = defineBasicLoader(
  '/users/[id]',
  async route => {
    const user = await useUserData()
    const me = await useCurrentUserData()

    const friends = await getCommonFriends(user.id, me.id)
    return { ...me, commonFriends: { with: user, friends } }
  }
)
```

In the example above we are exporting multiple loaders but we don't need to care about the order in which they are called nor try optimizing them because **they are only called once and share the data**.

::: danger
**Caveat**: must call **and await** all nested loaders at the top of the parent loader (see `useUserData()` and `useCurrentUserData()`). You cannot put a different regular `await` in between. If you really need to await **anything that isn't a loader** in between, wrap the promise with `withDataContext()` to ensure the loader context is properly restored:

```ts{3}
export const useUserCommonFriends = defineBasicLoader(async (route) => {
  const user = await useUserData()
  await withContext(functionThatReturnsAPromise())
  const me = await useCurrentUserData()

  // ...
})
```

This allows nested loaders to be aware of their *parent loader*. This could probably be linted with an eslint plugin. It is similar to the problem `<script setup>` had before introducing the automatic `withAsyncContext()`. The same feature could be introduced (via a vite plugin) but will also have a performance cost. In the future, this *should* be solved with the [async-context](https://github.com/tc39/proposal-async-context) proposal (stage 2).
:::

---

---
url: /guide/essentials/nested-routes.md
---
# Nested Routes

Some applications' UIs are composed of components that are nested multiple levels deep. In this case, it is very common that the segments of a URL correspond to a certain structure of nested components, for example:

```
/user/johnny/profile                   /user/johnny/posts
┌──────────────────┐                  ┌──────────────────┐
│ User             │                  │ User             │
│ ┌──────────────┐ │                  │ ┌──────────────┐ │
│ │ Profile      │ │  ────────────>   │ │ Posts        │ │
│ │              │ │                  │ │              │ │
│ └──────────────┘ │                  │ └──────────────┘ │
└──────────────────┘                  └──────────────────┘
```

With Vue Router, you can express this relationship using nested route configurations.

Given the app we created in the last chapter:

```vue [App.vue]
<template>
  <router-view />
</template>
```

```vue [User.vue]
<template>
  <div>User {{ $route.params.id }}</div>
</template>
```

```js
import User from './User.vue'

// these are passed to `createRouter`
const routes = [{ path: '/user/:id', component: User }]
```

The `<router-view>` here is a top-level `router-view`. It renders the component matched by a top level route. Similarly, a rendered component can also contain its own, nested `<router-view>`. For example, if we add one inside the `User` component's template:

```vue [User.vue]
<template>
  <div class="user">
    <h2>User {{ $route.params.id }}</h2>
    <router-view />
  </div>
</template>
```

To render components into this nested `router-view`, we need to use the `children` option in any of the routes:

```js
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        // UserProfile will be rendered inside User's <router-view>
        // when /user/:id/profile is matched
        path: 'profile',
        component: UserProfile,
      },
      {
        // UserPosts will be rendered inside User's <router-view>
        // when /user/:id/posts is matched
        path: 'posts',
        component: UserPosts,
      },
    ],
  },
]
```

**Note that nested paths that start with `/` will be treated as root paths. This allows you to leverage the component nesting without having to use a nested URL.**

As you can see, the `children` option is just another Array of routes like `routes` itself. Therefore, you can keep nesting views as much as you need.

At this point, with the above configuration, when you visit `/user/eduardo`, nothing will be rendered inside `User`'s `router-view`, because no nested route is matched. Maybe you do want to render something there. In such case you can provide an empty nested path:

```js
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      // UserHome will be rendered inside User's <router-view>
      // when /user/:id is matched
      { path: '', component: UserHome },

      // ...other sub routes
    ],
  },
]
```

A working demo of this example can be found [here](https://codesandbox.io/s/nested-views-vue-router-4-examples-hl326?initialpath=%2Fusers%2Feduardo).

## Nested Named Routes

When dealing with [Named Routes](./named-routes.md), you usually **name the children routes**:

```js
const routes = [
  {
    path: '/user/:id',
    component: User,
    // notice how only the child route has a name
    children: [{ path: '', name: 'user', component: UserHome }],
  },
]
```

This will ensure navigating to `/user/:id` will always display the nested route.

In some scenarios, you may want to navigate to a named route without navigating to the nested route. For example, if you want to navigate to `/user/:id` without displaying the nested route. In that case, you can **also** name the parent route but note **that reloading the page will always display the nested child** as it's considered a navigation to the path `/users/:id` instead of the named route:

```js
const routes = [
  {
    path: '/user/:id',
    name: 'user-parent',
    component: User,
    children: [{ path: '', name: 'user', component: UserHome }],
  },
]
```

## Omitting parent components&#x20;

We can also take advantage of the parent-child relationship between routes without needing to nest route components. This can be useful for grouping together routes with a common path prefix, or when working with more advanced features, such as [per-route navigation guards](../advanced/navigation-guards#Per-Route-Guard) or [route meta fields](../advanced/meta).

To achieve this, we omit the `component` and `components` options from the parent route:

```js
const routes = [
  {
    path: '/admin',
    children: [
      { path: '', component: AdminOverview },
      { path: 'users', component: AdminUserList },
      { path: 'users/:id', component: AdminUserDetails },
    ],
  },
]
```

As the parent doesn't specify a route component, the top-level `<router-view>` will skip over the parent and just use the component from the relevant child instead.

---

---
url: /data-loaders/nuxt.md
---
# Nuxt

To use Data Loaders in Nuxt, create a new plugin file in the `plugins` directory of your Nuxt project and setup the Data Loaders plugin like usual:

```ts
// plugins/data-loaders.ts
import { DataLoaderPlugin } from 'vue-router/experimental'

export default defineNuxtPlugin({
  name: 'data-loaders',
  dependsOn: ['nuxt:router'],
  setup(nuxtApp) {
    const appConfig = useAppConfig()

    nuxtApp.vueApp.use(DataLoaderPlugin, {
      router: nuxtApp.vueApp.config.globalProperties.$router,
      isSSR: import.meta.server,
      // other options...
    })
  },
})
```

The two required options are:

* `router`: the Vue Router instance
* `isSSR`: a boolean indicating if the app is running on the server side

## No module?

> "Why do I need to write the plugin myself instead of using a Module?"

The Data Loader plugin has options that are not serializable (e.g. `selectNavigationResult()` and `errors`). In order to support those within a module, we would have to pass them through the `app.config.ts`, splitting up the configuration and making it harder to maintain. A short plugin is easier to understand and closer to the *vanilla* version.

---

---
url: /guide/essentials/passing-props.md
---
# Passing Props to Route Components

Using `$route` or `useRoute()` in your component creates a tight coupling with the route which limits the flexibility of the component as it can only be used on certain URLs. While this is not necessarily a bad thing, we can decouple this behavior with a `props` option.

Let's return to our earlier example:

```vue [User.vue]
<template>
  <div>User {{ $route.params.id }}</div>
</template>
```

with:

```js
import User from './User.vue'

// these are passed to `createRouter`
const routes = [{ path: '/users/:id', component: User }]
```

We can remove the direct dependency on `$route` in `User.vue` by declaring a prop instead:

::: code-group

```vue [Composition API]
<!-- User.vue -->
<script setup>
defineProps({
  id: String,
})
</script>

<template>
  <div>User {{ id }}</div>
</template>
```

```vue [Options API]
<!-- User.vue -->
<script>
export default {
  props: {
    id: String,
  },
}
</script>

<template>
  <div>User {{ id }}</div>
</template>
```

:::

We can then configure the route to pass the `id` param as a prop by setting `props: true`:

```js
const routes = [{ path: '/user/:id', component: User, props: true }]
```

This allows you to use the component anywhere, which makes the component easier to reuse and test.

## Boolean mode

When `props` is set to `true`, the `route.params` will be set as the component props.

## Named views

For routes with named views, you have to define the `props` option for each named view:

```js
const routes = [
  {
    path: '/user/:id',
    components: { default: User, sidebar: Sidebar },
    props: { default: true, sidebar: false },
  },
]
```

## Object mode

When `props` is an object, this will be set as the component props as-is. Useful for when the props are static.

```js
const routes = [
  {
    path: '/promotion/from-newsletter',
    component: Promotion,
    props: { newsletterPopup: false },
  },
]
```

## Function mode

You can create a function that returns props. This allows you to cast parameters into other types, combine static values with route-based values, etc.

```js
const routes = [
  {
    path: '/search',
    component: SearchUser,
    props: route => ({ query: route.query.q }),
  },
]
```

The URL `/search?q=vue` would pass `{query: 'vue'}` as props to the `SearchUser` component.

Try to keep the `props` function stateless, as it's only evaluated on route changes. Use a wrapper component if you need state to define the props, that way Vue can react to state changes.

## Via RouterView

You can also pass any props via the [`<RouterView>` slot](../advanced/router-view-slot):

```vue-html
<RouterView v-slot="{ Component }">
  <component
    :is="Component"
    view-prop="value"
   />
</RouterView>
```

::: warning
In this case, **all view components** will receive `view-prop`. This is usually not a good idea as it means that all of the view components have declared a `view-prop` prop, which is not necessarily true. If possible, use any of the options above.
:::

---

---
url: /guide/essentials/navigation.md
---

# Programmatic Navigation

Aside from using `<router-link>` to create anchor tags for declarative navigation, we can do this programmatically using the router's instance methods.

## Navigate to a different location

**Note: The examples below refer to the router instance as `router`. Inside a component, you can access the router using the `$router` property, e.g. `this.$router.push(...)`. If you're using the Composition API, the router is accessible by calling [`useRouter()`](../advanced/composition-api).**

To navigate to a different URL, use `router.push`. This method pushes a new entry into the history stack, so when the user clicks the browser back button they will be taken to the previous URL.

This is the method called internally when you click a `<router-link>`, so clicking `<router-link :to="...">` is the equivalent of calling `router.push(...)`.

| Declarative               | Programmatic       |
| ------------------------- | ------------------ |
| `<router-link :to="...">` | `router.push(...)` |

The argument can be a string path, or a location descriptor object. Examples:

```js
// literal string path
router.push('/users/eduardo')

// object with path
router.push({ path: '/users/eduardo' })

// named route with params to let the router build the url
router.push({ name: 'user', params: { username: 'eduardo' } })

// with query, resulting in /register?plan=private
router.push({ path: '/register', query: { plan: 'private' } })

// with hash, resulting in /about#team
router.push({ path: '/about', hash: '#team' })
```

**Note**: `params` are ignored if a `path` is provided, which is not the case for `query`, as shown in the example above. Instead, you need to provide the `name` of the route or manually specify the whole `path` with any parameter:

```js
const username = 'eduardo'
// we can manually build the url but we will have to handle the encoding ourselves
router.push(`/user/${username}`) // -> /user/eduardo
// same as
router.push({ path: `/user/${username}` }) // -> /user/eduardo
// if possible use `name` and `params` to benefit from automatic URL encoding
router.push({ name: 'user', params: { username } }) // -> /user/eduardo
// `params` cannot be used alongside `path`
router.push({ path: '/user', params: { username } }) // -> /user
```

When specifying `params`, make sure to either provide a `string` or `number` (or an array of these for [repeatable params](./route-matching-syntax.md#Repeatable-params)). **Any other type (like objects, booleans, etc) will be automatically stringified**. For [optional params](./route-matching-syntax.md#Optional-parameters), you can provide an empty string (`""`) or `null` as the value to remove it.

Since the prop `to` accepts the same kind of object as `router.push`, the exact same rules apply to both of them.

`router.push` and all the other navigation methods return a *Promise* that allows us to wait till the navigation is finished and to know if it succeeded or failed. We will talk more about that in [Navigation Handling](../advanced/navigation-failures.md).

## Replace current location

It acts like `router.push`, the only difference is that it navigates without pushing a new history entry, as its name suggests - it replaces the current entry.

| Declarative                       | Programmatic          |
| --------------------------------- | --------------------- |
| `<router-link :to="..." replace>` | `router.replace(...)` |

It's also possible to directly add a property `replace: true` to the `to` argument that is passed to `router.push`:

```js
router.push({ path: '/home', replace: true })
// equivalent to
router.replace({ path: '/home' })
```

## Traverse history

This method takes a single integer as parameter that indicates by how many steps to go forward or go backward in the history stack, similar to `window.history.go(n)`.

Examples

```js
// go forward by one record, the same as router.forward()
router.go(1)

// go back by one record, the same as router.back()
router.go(-1)

// go forward by 3 records
router.go(3)

// fails silently if there aren't that many records
router.go(-100)
router.go(100)
```

## History Manipulation

You may have noticed that `router.push`, `router.replace` and `router.go` are counterparts of [`window.history.pushState`, `window.history.replaceState` and `window.history.go`](https://developer.mozilla.org/en-US/docs/Web/API/History), and they do imitate the `window.history` APIs.

Therefore, if you are already familiar with [Browser History APIs](https://developer.mozilla.org/en-US/docs/Web/API/History_API), manipulating history will feel familiar when using Vue Router.

It is worth mentioning that Vue Router navigation methods (`push`, `replace`, `go`) work consistently no matter the `history` option passed when creating the router instance.

---

---
url: /guide/essentials/redirect-and-alias.md
---
# Redirect and Alias

## Redirect

Redirecting is also done in the `routes` configuration. To redirect from `/home` to `/`:

```js
const routes = [{ path: '/home', redirect: '/' }]
```

The redirect can also be targeting a named route:

```js
const routes = [{ path: '/home', redirect: { name: 'homepage' } }]
```

Or even use a function for dynamic redirecting:

```js
const routes = [
  {
    // /search/screens -> /search?q=screens
    path: '/search/:searchText',
    redirect: to => {
      // the function receives the target route as the argument
      // we return a redirect path/location here.
      return { path: '/search', query: { q: to.params.searchText } }
    },
  },
  {
    path: '/search',
    // ...
  },
]
```

Note that **[Navigation Guards](../advanced/navigation-guards.md) are not applied on the route that redirects, only on its target**. e.g. In the above example, adding a `beforeEnter` guard to the `/home` route would not have any effect.

When writing a `redirect`, you can omit the `component` option because it is never directly reached so there is no component to render. The only exception are [nested routes](./nested-routes.md): if a route record has `children` and a `redirect` property, it should also have a `component` property.
