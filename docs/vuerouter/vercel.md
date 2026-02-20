### Vercel

Create a `vercel.json` file under the root directory of your project with the following:

```json [vercel.json ~vscode-icons:file-type-light-vercel~]
{
  "rewrites": [{ "source": "/:path*", "destination": "/index.html" }]
}
```

## Caveat

There is a caveat to this: Your server will no longer report 404 errors as all not-found paths now serve up your `index.html` file. To get around the issue, you should implement a catch-all route within your Vue app to show a 404 page:

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/:pathMatch(.*)', component: NotFoundComponent }],
})
```

Alternatively, if you are using a Node.js server, you can implement the fallback by using the router on the server side to match the incoming URL and respond with 404 if no route is matched. Check out the [Vue server side rendering documentation](https://vuejs.org/guide/scaling-up/ssr.html) for more information.

---

---
url: /guide/essentials/dynamic-matching.md
---
# Dynamic Route Matching with Params

Very often we will need to map routes with the given pattern to the same component. For example, we may have a `User` component which should be rendered for all users but with different user IDs. In Vue Router we can use a dynamic segment in the path to achieve that, we call that a *param*:

```js
import User from './User.vue'

// these are passed to `createRouter`
const routes = [
  // dynamic segments start with a colon
  { path: '/users/:id', component: User },
]
```

Now URLs like `/users/johnny` and `/users/jolyne` will both map to the same route.

A *param* is denoted by a colon `:`. When a route is matched, the value of its *params* will be exposed as `route.params` in every component. Therefore, we can render the current user ID by updating `User`'s template to this:

```vue
<template>
  <div>
    <!-- The current route is accessible as $route in the template -->
    User {{ $route.params.id }}
  </div>
</template>
```

You can have multiple *params* in the same route, and they will map to corresponding fields on `route.params`. Examples:

| pattern                        | matched path             | route.params                             |
| ------------------------------ | ------------------------ | ---------------------------------------- |
| /users/:username               | /users/eduardo           | `{ username: 'eduardo' }`                |
| /users/:username/posts/:postId | /users/eduardo/posts/123 | `{ username: 'eduardo', postId: '123' }` |

In addition to `route.params`, the `route` object also exposes other useful information such as `route.query` (if there is a query in the URL), `route.hash`, etc. You can check out the full details in the [API Reference](../../api/#RouteLocationNormalized).

A working demo of this example can be found [here](https://codesandbox.io/s/route-params-vue-router-examples-mlb14?from-embed\&initialpath=%2Fusers%2Feduardo%2Fposts%2F1).

## Reacting to Params Changes

One thing to note when using routes with params is that when the user navigates from `/users/johnny` to `/users/jolyne`, **the same component instance will be reused**. Since both routes render the same component, this is more efficient than destroying the old instance and then creating a new one. **However, this also means that some lifecycle hooks of the component will not be called**.

To react to params changes in the same component, you can simply watch anything on the `route` object, in this scenario, the `route.params`:

::: code-group

```vue [Composition API]
<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(
  () => route.params.id,
  (newId, oldId) => {
    // react to route changes...
  }
)
</script>
```

```vue [Options API]
<script>
export default {
  created() {
    this.$watch(
      () => this.$route.params.id,
      (newId, oldId) => {
        // react to route changes...
      }
    )
  },
}
</script>
```

:::

Or, use the `beforeRouteUpdate` [navigation guard](../advanced/navigation-guards.md), which also allows you to cancel the navigation:

::: code-group

```vue [Composition API]
<script setup>
import { onBeforeRouteUpdate } from 'vue-router'
// ...

onBeforeRouteUpdate(async (to, from) => {
  // react to route changes...
  userData.value = await fetchUser(to.params.id)
})
</script>
```

```vue [Options API]
<script>
export default {
  async beforeRouteUpdate(to, from) {
    // react to route changes...
    this.userData = await fetchUser(to.params.id)
  },
  // ...
}
</script>
```

:::

## Catch all / 404 Not found Route

Regular params will only match characters in between url fragments, separated by `/`. If we want to match **anything**, we can use a custom *param* regexp by adding the regexp inside parentheses right after the *param*:

```js
const routes = [
  // will match everything and put it under `route.params.pathMatch`
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  // will match anything starting with `/user-` and put it under `route.params.afterUser`
  { path: '/user-:afterUser(.*)', component: UserGeneric },
]
```

In this specific scenario, we are using a [custom regexp](./route-matching-syntax.md#custom-regexp-in-params) between parentheses and marking the `pathMatch` param as [optionally repeatable](./route-matching-syntax.md#optional-parameters). This allows us to directly navigate to the route if we need to by splitting the `path` into an array:

```js
router.push({
  name: 'NotFound',
  // preserve current path and remove the first char to avoid the target URL starting with `//`
  params: { pathMatch: route.path.substring(1).split('/') },
  // preserve existing query and hash if any
  query: route.query,
  hash: route.hash,
})
```

See more in the [repeated params](./route-matching-syntax.md#Repeatable-params) section.

If you are using [History mode](./history-mode.md), make sure to follow the instructions to correctly configure your server as well.

## Advanced Matching Patterns

Vue Router uses its own path matching syntax, inspired by the one used by `express`, so it supports many advanced matching patterns such as optional params, zero or more / one or more requirements, and even custom regex patterns. Please check the [Advanced Matching](./route-matching-syntax.md) documentation to explore them.

---

---
url: /guide/advanced/dynamic-routing.md
---
# Dynamic Routing

Adding routes to your router is usually done via the `routes` option but in some situations, you might want to add or remove routes while the application is already running. Applications with extensible interfaces like [Vue CLI UI](https://cli.vuejs.org/dev-guide/ui-api.html) can use this to make the application grow.

## Adding routes

Dynamic routing is achieved mainly via two functions: `router.addRoute()` and `router.removeRoute()`. They **only** register a new route, meaning that if the newly added route matches the current location, it would require you to **manually navigate** with `router.push()` or `router.replace()` to display that new route. Let's take a look at an example:

Imagine having the following router with one single route:

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/:articleName', component: Article }],
})
```

Going to any page like `/about`, `/store`, or `/3-tricks-to-improve-your-routing-code` ends up rendering the `Article` component. If we are on `/about` and we add a new route:

```js
router.addRoute({ path: '/about', component: About })
```

The page will still show the `Article` component. We need to manually call `router.replace()` to change the current location and overwrite where we were (instead of pushing a new entry, ending up in the same location twice in our history):

```js
router.addRoute({ path: '/about', component: About })
// we could also use this.$route or useRoute()
router.replace(router.currentRoute.value.fullPath)
```

Remember you can `await router.replace()` if you need to wait for the new route to be displayed.

## Adding routes inside navigation guards

If you decide to add or remove routes inside of a navigation guard, you should not call `router.replace()` but trigger a redirection by returning the new location:

```js
router.beforeEach(to => {
  if (!hasNecessaryRoute(to)) {
    router.addRoute(generateRoute(to))
    // trigger a redirection
    return to.fullPath
  }
})
```

The example above assumes two things: first, the newly added route record will match the `to` location, effectively resulting in a different location from the one we were trying to access. Second, `hasNecessaryRoute()` returns `true` after adding the new route to avoid an infinite redirection.

Because we are redirecting, we are replacing the ongoing navigation, effectively behaving like the example shown before. In real world scenarios, adding is more likely to happen outside of navigation guards, e.g. when a view component mounts, it register new routes.

## Removing routes

There are few different ways to remove existing routes:

* By adding a route with a conflicting name. If you add a route that has the same name as an existing route, it will remove the route first and then add the route:

  ```js
  router.addRoute({ path: '/about', name: 'about', component: About })
  // this will remove the previously added route because they have
  // the same name and names are unique across all routes
  router.addRoute({ path: '/other', name: 'about', component: Other })
  ```

* By calling the callback returned by `router.addRoute()`:

  ```js
  const removeRoute = router.addRoute(routeRecord)
  removeRoute() // removes the route if it exists
  ```

  This is useful when the routes do not have a name

* By using `router.removeRoute()` to remove a route by its name:

  ```js
  router.addRoute({ path: '/about', name: 'about', component: About })
  // remove the route
  router.removeRoute('about')
  ```

  Note you can use `Symbol`s for names in routes if you wish to use this function but want to avoid conflicts in names.

Whenever a route is removed, **all of its aliases and children** are removed with it.

## Adding nested routes

To add nested routes to an existing route, you can pass the *name* of the route as its first parameter to `router.addRoute()`. This will effectively add the route as if it was added through `children`:

```js
router.addRoute({ name: 'admin', path: '/admin', component: Admin })
router.addRoute('admin', { path: 'settings', component: AdminSettings })
```

This is equivalent to:

```js
router.addRoute({
  name: 'admin',
  path: '/admin',
  component: Admin,
  children: [{ path: 'settings', component: AdminSettings }],
})
```

## Looking at existing routes

Vue Router gives you two functions to look at existing routes:

* [`router.hasRoute()`](/api/interfaces/Router.md#hasRoute): check if a route exists.
* [`router.getRoutes()`](/api/interfaces/Router.md#getRoutes): get an array with all the route records.

---

---
url: /data-loaders/error-handling.md
---
# Error handling

By default, all errors thrown in a loader are considered *unexpected errors*: they will abort the navigation, just like in a navigation guard. Because they abort the navigation, they will not appear in the `error` property of the loader. Instead, they will be intercepted by Vue Router's error handling with `router.onError()`.

However, if the loader is **not navigation-aware**, the error cannot be intercepted by Vue Router and will be kept in the `error` property of the loader. This is the case for *lazy loaders* and [*reloading data*](./reloading-data.md).

## Defining expected Errors

To be able to intercept errors in non-lazy loaders, we can specify a list of error classes that are considered *expected errors*. This allows blocking loader to **not abort the navigation** and instead keep the error in the `error` property of the loader and let the page locally display the error state.

```ts{3-10,14,18} twoslash
import { defineBasicLoader } from 'vue-router/experimental'
// custom error class
class MyError extends Error {
  // override is only needed in TS
  override name = 'MyError' // Displays in logs instead of 'Error'
  // defining a constructor is optional
  constructor(message: string) {
    super(message)
  }
}

export const useUserData = defineBasicLoader(
  async (to) => {
    throw new MyError('Something went wrong')
    // ...
    // ---cut-start---
    return { name: 'John' }
    // ---cut-end---
  },
  {
    errors: [MyError],
  }
)
```

You can also specify *expected errors* globally for all loaders by providing the `errors` option to the `DataLoaderPlugin`.

```ts{4} twoslash
import { createApp } from 'vue'
import type { Router } from 'vue-router'
import { DataLoaderPlugin } from 'vue-router/experimental'
const app = createApp({})
const router = {} as Router
class MyError extends Error {
  name = 'MyError'
  constructor(message: string) {
    super(message)
  }
}
// @errors: 2769
// ---cut---
app.use(DataLoaderPlugin, {
  router,
  // checks with `instanceof MyError`
  errors: [MyError],
})
```

Then you need to opt-in in the loader by setting the `errors` option to `true` to keep the error in the `error` property of the loader.

```ts{7} twoslash
import { defineBasicLoader } from 'vue-router/experimental'
// ---cut---
export const useUserData = defineBasicLoader(
  async (to) => {
    throw new Error('Something went wrong')
    // ...
    // ---cut-start---
    return { name: 'John' }
    // ---cut-end---
  },
  {
    errors: true,
  }
)
```

::: details Why is `errors: true` needed?

One of the benefits of Data Loaders is that they ensure the `data` to be ready before the component is rendered. With expected errors, this is no longer true and `data` can be `undefined`:

```ts{11} twoslash
import { defineBasicLoader } from 'vue-router/experimental'
// ---cut---
export const useDataWithErrors = defineBasicLoader(
  async (to) => {
    // ...
    // ---cut-start---
    return { name: 'John' }
    // ---cut-end---
  },
  {
    errors: true,
  }
)

const { data } = useDataWithErrors()
data.value // `data` can be `undefined`
```

:::

## Custom Error handling

If you need more control over the error handling, you can provide a function to the `errors` option. This option is available in both the `DataLoaderPlugin` and when defining a loader.

```ts{3-9} twoslash
// @errors: 2769
import { createApp } from 'vue'
import { DataLoaderPlugin } from 'vue-router/experimental'
const app = createApp({})
const router = {} as any
// ---cut---
app.use(DataLoaderPlugin, {
  router,
  errors: (error) => {
    // Convention for custom errors
    if (error instanceof Error && error.name?.startsWith('My')) {
      return true
    }
    return false // unexpected error
  },
})
```

## Handling both, local and global errors

TODO: this hasn't been implemented yet

## Error handling priority

When you use both, global and local error handling, the local error handling has a higher priority and will override the global error handling. This is how the local and global errors are checked:

* if local `errors` is `false`: abort the navigation -> `data` is not `undefined`
* if local `errors` is `true`: rely on the globally defined `errors` option -> `data` is possibly `undefined`
* else: rely on the local `errors` option -> `data` is possibly `undefined`

## TypeScript

You will notice that the type of `error` is `Error | null` even when you specify the `errors` option. This is because if we call the `reload()` method (meaning we are outside of a navigation), the error isn't discarded, it appears in the `error` property **without being filtered** by the `errors` option.

In practice, depending on how you handle the error, you will add a [type guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards) inside the component responsible for displaying an error or directly in a `v-if` in the template.

```vue-html
<template>
  <!-- ... -->
  <p v-if="isMyError(error)">{{ error.message }}</p>
</template>
```

If you want to be even stricter, you can override the default `Error` type with `unknown` (or anything else) by augmenting the `TypesConfig` interface.

```ts
// types-extension.d.ts
import 'vue-router'
export {}

declare module 'vue-router' {
  interface TypesConfig {
    Error: unknown
  }
}
```

---

---
url: /guide/advanced/extending-router-link.md
---
# Extending RouterLink

The RouterLink component exposes enough `props` to suffice most basic applications but it doesn't try to cover every possible use case and you will likely find yourself using `v-slot` for some advanced cases. In most medium to large sized applications, it's worth creating one if not multiple custom RouterLink components to reuse them across your application. Some examples are Links in a Navigation Menu, handling external links, adding an `inactive-class`, etc.

Let's extend RouterLink to handle external links as well and adding a custom `inactive-class` in an `AppLink.vue` file:

::: code-group

```vue [Composition API]
<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  // add @ts-ignore if using TypeScript
  ...RouterLink.props,
  inactiveClass: String,
})

const isExternalLink = computed(() => {
  return typeof props.to === 'string' && props.to.startsWith('http')
})
</script>

<template>
  <a v-if="isExternalLink" v-bind="$attrs" :href="to" target="_blank">
    <slot />
  </a>
  <router-link
    v-else
    v-bind="$props"
    custom
    v-slot="{ isActive, href, navigate }"
  >
    <a
      v-bind="$attrs"
      :href="href"
      @click="navigate"
      :class="isActive ? activeClass : inactiveClass"
    >
      <slot />
    </a>
  </router-link>
</template>
```

```vue [Options API]
<script>
import { RouterLink } from 'vue-router'

export default {
  name: 'AppLink',
  inheritAttrs: false,

  props: {
    // add @ts-ignore if using TypeScript
    ...RouterLink.props,
    inactiveClass: String,
  },

  computed: {
    isExternalLink() {
      return typeof this.to === 'string' && this.to.startsWith('http')
    },
  },
}
</script>

<template>
  <a v-if="isExternalLink" v-bind="$attrs" :href="to" target="_blank">
    <slot />
  </a>
  <router-link
    v-else
    v-bind="$props"
    custom
    v-slot="{ isActive, href, navigate }"
  >
    <a
      v-bind="$attrs"
      :href="href"
      @click="navigate"
      :class="isActive ? activeClass : inactiveClass"
    >
      <slot />
    </a>
  </router-link>
</template>
```

:::

If you prefer using a render function or create `computed` properties, you can use the `useLink` from the [Composition API](./composition-api.md):

```js
import { RouterLink, useLink } from 'vue-router'

export default {
  name: 'AppLink',

  props: {
    // add @ts-ignore if using TypeScript
    ...RouterLink.props,
    inactiveClass: String,
  },

  setup(props) {
    // `props` contains `to` and any other prop that can be passed to <router-link>
    const { navigate, href, route, isActive, isExactActive } = useLink(props)

    // profit!

    return { isExternalLink }
  },
}
```

In practice, you might want to use your `AppLink` component for different parts of your application. e.g. using [Tailwind CSS](https://tailwindcss.com), you could create a `NavLink.vue` component with all the classes:

```vue
<template>
  <AppLink
    v-bind="$attrs"
    class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out"
    active-class="border-indigo-500 text-gray-900 focus:border-indigo-700"
    inactive-class="text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300"
  >
    <slot />
  </AppLink>
</template>
```

---

---
url: /guide.md
---
# Getting Started

Watch a Free Vue Router Video Course

Vue Router is the official client-side routing solution for Vue.

Client-side routing is used by single-page applications (SPAs) to tie the browser URL to the content seen by the user. As users navigate around the application, the URL updates accordingly, but the page doesn't need to be reloaded from the server.

Vue Router is built on Vue's component system. You configure **routes** to tell Vue Router which components to show for each URL path.

This guide will assume that you are already familiar with Vue itself. You don't need to be a Vue expert, but you may occasionally need to refer back to [the core Vue documentation](https://vuejs.org/) for more information about certain features.

## An example

To introduce some of the main ideas, we're going to consider this example:

* [Vue Playground example](https://play.vuejs.org/#eNqFVttu20YQ/ZUpU0AyapGKekGhKorTIKhTpKlhp81D2QeKXImMl7vM7tKWIOjfc3aXN8l2YsM2Odczc2ZG3gdlUojwkw7mQVFWUhnaU6pYYtirqqIDrZUsaXRXs1EsGgMla8NUowkj/9qrrV+rS6oq9L6x6KKO8XMWC6Kw1mzs3f17KWthxqNncBudBedB4w5sC8PKisN/aQ0X+fPlJeNc2mTfLSK8OnHl/uBBGyXFZvm6VoqJBjFVicnni6jR0X5P3ztFuK45v4KSDgcXJvJxFiK5awNeO5TvCnFLRr6IgygOln9IPNOlLNki6vVPeiQrSDq3V/btgd8ianMuLC/Hsf4t2D1FjV2jXkRdY9Av38tH2fyLlVLtLgtt8Oe8Efq4Q5YnHZsdn7ZAl7oltRU0zLa024KO7DpJPwJS6IYNTS/oP1vK3vNCo2gEWBLBBCib92kP58dmro/Htn1ua/z/SSqFVMN6x3sbMIrovTRsTh/ZSDGqdSE2j/VqfEY5g8FaKpcyMcWq4IXZNUH8132B8TE5oyue7DZIK7KQ3gpKCBE5YZB5kcJVCtrJepQhX51wfhwE69Ag+MhWfXqbuJMmOu81BWpkSeYa1EUxO1uJxeLHHsNmX1ZK3mv04p/rdyHdMMghzGRal2ihQ3YUxZaLLjDkwGPpobvWU+7zQ50xHVqvRjJ/vH8OnicdjweseizY1g1NxtZJzVueMMHD2bJrr1NVVAaDfuLgKCyZyWWm5/6NaCM/SDcKaE0jQjsALvSLrsKq1vm4HSF3c6iZL/sb24/z0GbEy8nRmS1beDg5My9c1cagMxcp+L3FmncYTjfdGz5Y2aMl6SsmzUxtz1C/xpg91JA9fpP3dnjceJ93T08u9sludPZjdGSgG6isptVplqg0tzvVIPL7tGGDtiugV8KHCT/XTO3Cxu3lSxoBRNt2lDn2mt7XU6UYepSy8Z6cP0huMx/IzhAi+GH6BmVdg3vOeLJivLmtNy7mnBaFQDF0N7FTzUOjihJs+oxxQGWy5UxsTA7hbApu/RVuIx1z6jmZlEmFUywFWHWlxY1Cx0E3snHQc2PFcZAbU+l5FNWiut2E6HHUW1z8HE7DWZRhswbSkOly0qw3EsaB66yNfQGjKGN3RkquJ0lVPJXigeHFr8j0S59pqHuQryUDpRuNIVkXm5PC7agUnKm/K3tHjhuAMyjv/3Qyo2rWgU9zlt4+Iv+kt76MK8WA4I4NCjaJwhx69Zub92yL504JZmsO668or5mWvHbH0Jn9jjsO2AM7h/at4xFn9oN+szVM6LYoC7Qfbkfu66+U3sP9Mfxp0EVtdhynNdX2gxz/EZxj/grh/VZSZUzNaVZtCWCLjJ5Np9Pf3D1EuEJMVhKXppzT82m1dfIqyTKA7STIEguEpSU+n37Aj7+m3puzNT5Rh5b5bJi5D98DSNN0AGBOU3zPmgjB4QtAqIeC)

Let's start by looking at the root component, `App.vue`.
