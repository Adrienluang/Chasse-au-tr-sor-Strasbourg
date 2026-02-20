### 3. Update vite.config.ts and tsconfig.json

It's recommended to move the generated types file inside `src/` and rename it to `route-map.d.ts`, as it's automatically included by most setups:

```ts
// vite.config.ts
export default defineConfig({
  plugins: [
    VueRouter({
      dts: 'src/route-map.d.ts', // [!code ++]
    }),
    Vue(),
  ],
})
```

Remove the old client types reference. These were either added to an `env.d.ts`:

```ts
/// <reference types="unplugin-vue-router/client" /> // [!code --]
```

or to your `tsconfig.json`:

```jsonc
{
  "include": [
    "./typed-router.d.ts", // [!code --]
    "unplugin-vue-router/client", // [!code --]
    // ...
  ],
}
```

## Troubleshooting

**Types not recognized:** Restart your TypeScript server and check that your generated types file (e.g., `src/route-map.d.ts`) is included in your tsconfig.

**Routes not generating:** Verify your `routesFolder` path and check file extensions.

**Route name errors:** Use the generated names or add `definePage({ name: 'custom-name' })` to your components.

## New Exports Reference

| Export                                 | Purpose                            |
| -------------------------------------- | ---------------------------------- |
| `vue-router`                           | Main API (unchanged)               |
| `vue-router/vite`                      | Vite plugin                        |
| `vue-router/auto-routes`               | Generated routes                   |
| `vue-router/unplugin`                  | Webpack/Rollup/esbuild + utilities |
| `vue-router/experimental`              | Data loaders                       |
| `vue-router/experimental/pinia-colada` | Pinia Colada loader                |

---

---
url: /guide/essentials/named-routes.md
---
# Named Routes

When creating a route, we can optionally give the route a `name`:

```js
const routes = [
  {
    path: '/user/:username',
    name: 'profile', // [!code highlight]
    component: User,
  },
]
```

We can then use the `name` instead of the `path` when passing the `to` prop to `<router-link>`:

```vue-html
<router-link :to="{ name: 'profile', params: { username: 'erina' } }">
  User profile
</router-link>
```

The example above would create a link to `/user/erina`.

* [See it in the Playground](https://play.vuejs.org/#eNqtVVtP2zAU/itWNqlFauNNIB6iUMEQEps0NjH2tOzBtKY1JLZlO6VTlP++4+PcelnFwyRofe7fubaKCiZk/GyjJBKFVsaRiswNZ45faU1q8mRUQUbrko8yuaPwlRfK/LkV1sHXpGHeq9JxMzScGmT19t5xkMaUaR1vOb9VBe+kntgWXz2Cs06O1LbCTwvRW7knGnEm50paRwIYcrEFd1xlkpBVyCQ5lN74ZOJV0Nom5JcnCFRCM7dKyIiOJkSygsNzBZiBmivAI7l0SUipRvuhCfPge7uWHBiGZPctS0iLJv7T2/YutFFPIt+JjgUJPn7DZ32CtWg7PIZ/4BASg7txKE6gC1VKNx69gw6NTqJJ1HQK5iR1vNA52M+8Yrr6OLuD+AuCtbQpBQYK9Oy6NAZAhLI1KKuKvEc69jSp65Tqw/oh3V7f00P9MsdveOWiecE75DDNhXwhiVMXWVRttYbUWdRpE2xOZ0sHxq1v2jl/a5jQyZ042Mv/HKjvt2aGFTCXFWmnAsTcCMkAxw4SHIjG9E2AUtpUusWyFvyVUGCltBsFmJB2W/dHZCHWswdYLwJ/XiulnrNr323zcQeodthDuAHTgmm4aEqCH1zsrBHYLIISheyyqD9Nnp1FK+e0TSgtpX5ZxrBBtNe4PItP4w8Q07oBN+a2mD4a9erPzDN4bzY1iy5BiS742imV2ynT4l8h9hQvz+Pz+COU/pGCdyrkgm/Qt3ddw/5Cms7CLXsSy50k/dJDT8037QTcuq1kWZ6r1y/Ic6bkHdD5is9fDvCf7SZA/m44ZLfmg+QcM0vugvjmxx3fwLsTFmpRwlwdE95zq/LSYwxqn0q5ANgDPUT7GXsm5PLB3mwcl7ZNygPFaqA+NvL6SOo93NP4bFDF9sfh+LThtgxvkF80fyxxy/Ac7U9i/RcYNWrd).

Using a `name` has various advantages:

* No hardcoded URLs.
* Automatic encoding of `params`.
* Avoids URL typos.
* Bypassing path ranking, e.g. to display a lower-ranked route that matches the same path.

Each name **must be unique** across all routes. If you add the same name to multiple routes, the router will only keep the last one. You can read more about this [in the Dynamic Routing](../advanced/dynamic-routing#Removing-routes) section.

There are various other parts of Vue Router that can be passed a location, e.g. the methods `router.push()` and `router.replace()`. We'll go into more detail about those methods in the guide to [programmatic navigation](./navigation). Just like the `to` prop, these methods also support passing a location by `name`:

```js
router.push({ name: 'profile', params: { username: 'erina' } })
```

---

---
url: /guide/essentials/named-views.md
---
# Named Views

Sometimes you need to display multiple views at the same time instead of nesting them, e.g. creating a layout with a `sidebar` view and a `main` view. This is where named views come in handy. Instead of having one single outlet in your view, you can have multiple and give each of them a name. A `router-view` without a name will be given `default` as its name.

```vue-html
<router-view class="view left-sidebar" name="LeftSidebar" />
<router-view class="view main-content" />
<router-view class="view right-sidebar" name="RightSidebar" />
```

A view is rendered by using a component, therefore multiple views require
multiple components for the same route. Make sure to use the `components` (with
an **s**) option:

```js
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      components: {
        default: Home,
        // short for LeftSidebar: LeftSidebar
        LeftSidebar,
        // they match the `name` attribute on `<router-view>`
        RightSidebar,
      },
    },
  ],
})
```

A working demo of this example can be found [here](https://codesandbox.io/s/named-views-vue-router-4-examples-rd20l).

## Nested Named Views

It is possible to create complex layouts using named views with nested views. When doing so, you will also need to give nested `router-view` a name. Let's take a Settings panel example:

```
/settings/emails                                       /settings/profile
+-----------------------------------+                  +------------------------------+
| UserSettings                      |                  | UserSettings                 |
| +-----+-------------------------+ |                  | +-----+--------------------+ |
| | Nav | UserEmailsSubscriptions | |  +------------>  | | Nav | UserProfile        | |
| |     +-------------------------+ |                  | |     +--------------------+ |
| |     |                         | |                  | |     | UserProfilePreview | |
| +-----+-------------------------+ |                  | +-----+--------------------+ |
+-----------------------------------+                  +------------------------------+
```

* `Nav` is just a regular component
* `UserSettings` is the parent view component
* `UserEmailsSubscriptions`, `UserProfile`, `UserProfilePreview` are nested view components

**Note**: *Let's forget about how the HTML/CSS should look like to represent such layout and focus on the components used.*

The `<template>` section for `UserSettings` component in the above layout would look something like this:

```vue-html [UserSettings.vue]
<div>
  <h1>User Settings</h1>
  <NavBar />
  <router-view />
  <router-view name="helper" />
</div>
```

Then you can achieve the layout above with this route configuration:

```js
{
  path: '/settings',
  // You could also have named views at the top
  component: UserSettings,
  children: [
    {
      path: 'emails',
      component: UserEmailsSubscriptions
    },
    {
      path: 'profile',
      components: {
        default: UserProfile,
        helper: UserProfilePreview
      }
    }
  ]
}
```

A working demo of this example can be found [here](https://codesandbox.io/s/nested-named-views-vue-router-4-examples-re9yl?\&initialpath=%2Fsettings%2Femails).

---

---
url: /data-loaders/navigation-aware.md
---
# Navigation aware

Since the data fetching happens within a navigation guard, it's possible to control the navigation like in regular navigation guards:

* Thrown errors (or rejected Promises) cancel the navigation (same behavior as in a regular navigation guard) and are intercepted by [Vue Router's error handling](https://router.vuejs.org/api/interfaces/router.html#onerror)
* By calling `reroute()`, you can redirect or cancel the navigation

Any other returned value is considered as the *resolved data* and will appear in the `data` property.

## Controlling the navigation with `reroute()`

`reroute()` changes the current navigation from within a data loader. It accepts the same arguments as the [return value of a navigation guard](https://router.vuejs.org/guide/advanced/navigation-guards.html#Global-Before-Guards) **as long as it changes the navigation**. It doesn't accept `true` or `undefined` as these values do not change the navigation. It **throws internally** to immediately stop the loader execution.

```ts{1,6-8,16,18}
import { reroute } from 'vue-router/experimental'
import { defineBasicLoader } from 'vue-router/experimental'

export const useUserData = defineBasicLoader(
  async (to) => {
    // cancel the navigation for invalid IDs
    if (isInvalidId(to.params.id)) {
      reroute(false)
    }

    try {
      const user = await getUserById(to.params.id)

      return user
    } catch (error) {
      if (error.status === 404) {
        reroute({ name: 'not-found' })
      } else {
        throw error // aborts the router navigation
      }
    }
  }
)
```

::: tip

Since `reroute()` throws internally (its return type is `never`), you don't need to use `return` or `else` after calling it.

:::

## Consistent updates

During a navigation, data loaders are grouped together like a *pack*. If the navigation is canceled, none of the results are used. This avoids having partial data updates in a page and inconsistencies between the URL and the page content. On the other hand, if the navigation is successful, all the data loaders are resolved together and the data is only updated **once all the loaders are resolved**. This is true even for lazy loaders. This ensures that even if you have loaders that are really fast, the old data is not displayed until all the loaders are resolved and the new data is completely ready to be displayed.

## Lazy loaders

Apart from consistent updates, lazy loaders are not navigation-aware. They cannot control the navigation with errors or `reroute()`. They still start loading as soon as the navigation is initiated.

## Loading after the navigation

It's possible to not start loading the data until the navigation is done. To do this, simply [**do not attach the loader to the page**](./defining-loaders.md#disconnecting-a-loader-from-a-page). It will eventually start loading when the page is mounted.

---

---
url: /guide/advanced/navigation-guards.md
---
# Navigation Guards

As the name suggests, the navigation guards provided by Vue router are primarily used to guard navigations either by redirecting it or canceling it. There are a number of ways to hook into the route navigation process: globally, per-route, or in-component.

## Global Before Guards

You can register global before guards using `router.beforeEach`:

```js
const router = createRouter({ ... })

router.beforeEach((to, from) => {
  // ...
  // explicitly return false to cancel the navigation
  return false
})
```

Global before guards are called in creation order, whenever a navigation is triggered. Guards may be resolved asynchronously, and the navigation is considered **pending** before all hooks have been resolved.

Every guard function receives two arguments:

* **`to`**: the target route location [in a normalized format](../../api/#RouteLocationNormalized) being navigated to.
* **`from`**: the current route location [in a normalized format](../../api/#RouteLocationNormalized) being navigated away from.

And can optionally return any of the following values:

* `false`: cancel the current navigation. If the browser URL was changed (either manually by the user or via back button), it will be reset to that of the `from` route.
* A [Route Location](../../api/#RouteLocationRaw): Redirect to a different location by passing a route location as if you were calling `router.push()`, which allows you to pass options like `replace: true` or `name: 'home'`. The current navigation is dropped and a new one is created with the same `from`.

  ```js
  router.beforeEach(async (to, from) => {
    if (
      // make sure the user is authenticated
      !isAuthenticated &&
      // ❗️ Avoid an infinite redirect
      to.name !== 'Login'
    ) {
      // redirect the user to the login page
      return { name: 'Login' }
    }
  })
  ```

It's also possible to throw an `Error` if an unexpected situation was met. This will also cancel the navigation and call any callback registered via [`router.onError()`](../../api/interfaces/Router.md#onError).

If nothing, `undefined` or `true` is returned, **the navigation is validated**, and the next navigation guard is called.

All of the things above **work the same way with `async` functions** and Promises:

```js
router.beforeEach(async (to, from) => {
  // canUserAccess() returns `true` or `false`
  const canAccess = await canUserAccess(to)
  if (!canAccess) return '/login'
})
```
