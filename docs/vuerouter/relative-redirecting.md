### Relative redirecting

It's also possible to redirect to a relative location:

```js
const routes = [
  {
    // will always redirect /users/123/posts to /users/123/profile
    path: '/users/:id/posts',
    redirect: to => {
      // the function receives the target route as the argument
      return to.path.replace(/posts$/, 'profile')
    },
  },
]
```

## Alias

A redirect means when the user visits `/home`, the URL will be replaced by `/`, and then matched as `/`. But what is an alias?

**An alias of `/` as `/home` means when the user visits `/home`, the URL remains `/home`, but it will be matched as if the user is visiting `/`.**

The above can be expressed in the route configuration as:

```js
const routes = [{ path: '/', component: Homepage, alias: '/home' }]
```

An alias gives you the freedom to map a UI structure to an arbitrary URL, instead of being constrained by the configuration's nesting structure. Make the alias start with a `/` to make the path absolute in nested routes. You can even combine both and provide multiple aliases with an array:

```js
const routes = [
  {
    path: '/users',
    component: UsersLayout,
    children: [
      // this will render the UserList for these 3 URLs
      // - /users
      // - /users/list
      // - /people
      { path: '', component: UserList, alias: ['/people', 'list'] },
    ],
  },
]
```

If your route has parameters, make sure to include them in any absolute alias:

```js
const routes = [
  {
    path: '/users/:id',
    component: UsersByIdLayout,
    children: [
      // this will render the UserDetails for these 3 URLs
      // - /users/24
      // - /users/24/profile
      // - /24
      { path: 'profile', component: UserDetails, alias: ['/:id', ''] },
    ],
  },
]
```

**Note about SEO**: when using aliases, make sure to [define canonical links](https://support.google.com/webmasters/answer/139066?hl=en).

---

---
url: /data-loaders/reloading-data.md
---
# Reloading data

Very often, it is required to reload the data (e.g. fetch the latest data) without navigating. Since Vue Router considers that a duplicated navigation, we cannot just `router.push()` and expect navigation guards to run again to fetch the latest data. To overcome this, data loaders expose a convenient `reload` method that can be invoked to manually rerun the loader **without navigating**. This has some extra implications we will cover in this page.

## Navigation Unaware

When reloading data, the navigation is not involved, so not only the navigation guards will not run (`beforeRouteUpdate`, `beforeRouteLeave`, etc) but also any `NavigationResult` returned or thrown by the data loader will be ignored.

## Errors

Because we are not within a navigation, errors are actually kept in the `error` property of the loader. Similar to lazy loaders. This allows to display any errors that might have occurred during the reload.

---

---
url: /guide/advanced/meta.md
---
# Route Meta Fields

Sometimes, you might want to attach arbitrary information to routes like： transition names, or roles to control who can access the route, etc. This can be achieved through the `meta` property which accepts an object of properties and can be accessed on the route location and navigation guards. You can define `meta` properties like this:

```js
const routes = [
  {
    path: '/posts',
    component: PostsLayout,
    children: [
      {
        path: 'new',
        component: PostsNew,
        // only authenticated users can create posts
        meta: { requiresAuth: true },
      },
      {
        path: ':id',
        component: PostsDetail,
        // anybody can read a post
        meta: { requiresAuth: false },
      },
    ],
  },
]
```

So how do we access this `meta` field?

First, each route object in the `routes` configuration is called a **route record**. Route records may be nested. Therefore when a route is matched, it can potentially match more than one route record.

For example, with the above route config, the URL `/posts/new` will match both the parent route record (`path: '/posts'`) and the child route record (`path: 'new'`).

All route records matched by a route are exposed on the `route` object (and also route objects in navigation guards) as the `route.matched` Array. We could loop through that array to check all `meta` fields, but Vue Router also provides you a `route.meta` that is a non-recursive merge of **all `meta`** fields from parent to child. Meaning you can simply write:

```js
router.beforeEach((to, from) => {
  // instead of having to check every route record with
  // to.matched.some(record => record.meta.requiresAuth)
  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    return {
      path: '/login',
      // save the location we were at to come back later
      query: { redirect: to.fullPath },
    }
  }
})
```

## TypeScript

It is possible to type the meta field by extending the `RouteMeta` interface from `vue-router`:

```ts
// This can be directly added to any of your `.ts` files like `router.ts`
// It can also be added to a `.d.ts` file. Make sure it's included in
// project's tsconfig.json "files"
import 'vue-router'

// To ensure it is treated as a module, add at least one `export` statement
export {}

declare module 'vue-router' {
  interface RouteMeta {
    // is optional
    isAdmin?: boolean
    // must be declared by every route
    requiresAuth: boolean
  }
}
```

---

---
url: /guide/advanced/router-view-slot.md
---
# RouterView slot

The RouterView component exposes a slot that can be used to render the route component:

```vue-html
<router-view v-slot="{ Component }">
  <component :is="Component" />
</router-view>
```

The code above is equivalent to using `<router-view />` without the slot, but the slot provides extra flexibility when we want to work with other features.

## KeepAlive & Transition

When working with the [KeepAlive](https://vuejs.org/guide/built-ins/keep-alive.html) component, we would usually want it to keep the route components alive, not the RouterView itself. We can achieve that by putting the KeepAlive inside the slot:

```vue-html
<router-view v-slot="{ Component }">
  <keep-alive>
    <component :is="Component" />
  </keep-alive>
</router-view>
```

Similarly, the slot allows us to use a [Transition](https://vuejs.org/guide/built-ins/transition.html) component to transition between route components:

```vue-html
<router-view v-slot="{ Component }">
  <transition>
    <component :is="Component" />
  </transition>
</router-view>
```

We can also use KeepAlive inside a Transition:

```vue-html
<router-view v-slot="{ Component }">
  <transition>
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </transition>
</router-view>
```

For more information about using RouterView with the Transition component, see the [Transitions](./transitions) guide.

## Passing props and slots

We can use the slot to pass props or slots to the route component:

```vue-html
<router-view v-slot="{ Component }">
  <component :is="Component" some-prop="a value">
    <p>Some slotted content</p>
  </component>
</router-view>
```

In practice, this usually isn't something you would want to do, as the route components would **all need to use the same props and slots**. See [Passing Props to Route Components](../essentials/passing-props) for other ways to pass props.

## Template refs

Using the slot allows us to put a [template ref](https://vuejs.org/guide/essentials/template-refs.html) directly on the route component:

```vue-html
<router-view v-slot="{ Component }">
  <component :is="Component" ref="mainContent" />
</router-view>
```

If we put the ref on the `<router-view>` instead then the ref would be populated with the RouterView instance, rather than the route component.

---

---
url: /guide/essentials/route-matching-syntax.md
---
# Routes' Matching Syntax

Most applications will use static routes like `/about` and dynamic routes like `/users/:userId` like we just saw in [Dynamic Route Matching](./dynamic-matching.md), but Vue Router has much more to offer!

:::tip
For the sake of simplicity, all route records **are omitting the `component` property** to focus on the `path` value.
:::

## Custom regex in params

When defining a param like `:userId`, we internally use the following regex `([^/]+)` (at least one character that isn't a slash `/`) to extract params from URLs. This works well unless you need to differentiate two routes based on the param content. Imagine two routes `/:orderId` and `/:productName`, both would match the exact same URLs, so we need a way to differentiate them. The easiest way would be to add a static section to the path that differentiates them:

```js
const routes = [
  // matches /o/3549
  { path: '/o/:orderId' },
  // matches /p/books
  { path: '/p/:productName' },
]
```

But in some scenarios, we don't want to add that static section `/o` or `/p`. However, `orderId` is always a number while `productName` can be anything so we can specify a custom regex for a param in parentheses:

```js
const routes = [
  // /:orderId -> matches only numbers
  { path: '/:orderId(\\d+)' },
  // /:productName -> matches anything else
  { path: '/:productName' },
]
```

Now, going to `/25` will match `/:orderId` while going to anything else will match `/:productName`. The order of the `routes` array doesn't even matter!

:::tip
Make sure to **escape backslashes (`\`)** like we did with `\d` (becomes `\\d`) to actually pass the backslash character in a string in JavaScript.
:::

Since the closing parentheses `)` is used to mark the end of a custom regex, you must escape it inside of the regexp (e.g. nested groups):

```js
const routes = [
  // note the escaped closing parentheses of the group within the regexp
  { path: '/:custom(something-(nested|other\\))' },
]
```

## Repeatable params

If you need to match routes with multiple sections like `/first/second/third`, you should mark a param as repeatable with `*` (0 or more) and `+` (1 or more):

```js
const routes = [
  // /:chapters -> matches /one, /one/two, /one/two/three, etc
  { path: '/:chapters+' },
  // /:chapters -> matches /, /one, /one/two, /one/two/three, etc
  { path: '/:chapters*' },
]
```

This will give you an array of params instead of a string and will also require you to pass an array when using named routes:

```js
// given { path: '/:chapters*', name: 'chapters' },
router.resolve({ name: 'chapters', params: { chapters: [] } }).href
// produces /
router.resolve({ name: 'chapters', params: { chapters: ['a', 'b'] } }).href
// produces /a/b

// given { path: '/:chapters+', name: 'chapters' },
router.resolve({ name: 'chapters', params: { chapters: [] } }).href
// throws an Error because `chapters` is empty
```

These can also be combined with a custom regex by adding them **after the closing parentheses**:

```js
const routes = [
  // only match numbers
  // matches /1, /1/2, etc
  { path: '/:chapters(\\d+)+' },
  // matches /, /1, /1/2, etc
  { path: '/:chapters(\\d+)*' },
]
```

## Sensitive and strict route options

By default, all routes are case-insensitive and match routes with or without a trailing slash. e.g. a route `/users` matches `/users`, `/users/`, and even `/Users/`. This behavior can be configured with the `strict` and `sensitive` options, they can be set both at a router and route level:

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // will match /users/posva but not:
    // - /users/posva/ because of strict: true
    // - /Users/posva because of sensitive: true
    { path: '/users/:id', sensitive: true },
    // will match /users, /Users, and /users/42 but not /users/ or /users/42/
    { path: '/users/:id?' },
  ],
  strict: true, // applies to all routes
})
```

## Optional parameters

You can also mark a parameter as optional by using the `?` modifier (0 or 1):

```js
const routes = [
  // will match /users and /users/posva
  { path: '/users/:userId?' },
  // will match /users and /users/42
  { path: '/users/:userId(\\d+)?' },
]
```

Note that `*` technically also marks a parameter as optional but `?` parameters cannot be repeated.

If the route segment contains more than **just an optional parameter**, it won't match a path **without the trailing slash**. For example:

* `/users/:uid?-:name?` won't match `/users`, only `/users/-` or even `/users/-/`
* `/users/:uid(\\d+)?:name?` won't match `/users`, only `/users/`, `/users/2`, `/users/2/`, etc

You can play around with the matching syntax [in the playground](https://paths.esm.dev/?p=AAMsIPQg4AoKzidgQFoEXAmw-IEBBRYYOE0SkABTASiz1qgBpgQA1QTsFjAb3h2onsmlAmGIFsCXjXh4AIA.\&t=/users/2/#)

## Debugging

If you need to dig how your routes are transformed into a regex to understand why a route isn't being matched or, to report a bug, you can use the [path ranker tool](https://paths.esm.dev/?p=AAMeJSyAwR4UbFDAFxAcAGAIJXMAAA..#). It supports sharing your routes through the URL.

## Avoiding slow regex

When using custom regex, make sure to avoid using slow regex patterns. For example, using `.*` will match any character and can lead to **serious performance issues** if it's combined with a repeatable modifier `*` or `+` and anything after it:

```ts
const routes = [
  // This creates a very slow regex because of the greedy `.*` followed by `*` and a static string
  { path: '/:pathMatch(.*)*/something-at-the-end' },
]
```

In practice, use these *match everything* params only **in the very end of the URL**. If you need them in the middle of the path, **do not make them repeatable**:

```ts
const routes = [
  // This is fine because the `.*` is at the end
  { path: '/:pathMatch(.*)/something-at-the-end' },
]
```

This matches the same routes but without an array of params and it's much faster.

---

---
url: /guide/advanced/scroll-behavior.md
---
# Scroll Behavior

When using client-side routing, we may want to scroll to top when navigating to a new route, or preserve the scrolling position of history entries just like real page reload does. Vue Router allows you to achieve these and even better, allows you to completely customize the scroll behavior on route navigation.

**Note: this feature only works if the browser supports `history.pushState`.**

When creating the router instance, you can provide the `scrollBehavior` function:

```js
const router = createRouter({
  history: createWebHashHistory(),
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // return desired position
  }
})
```

The `scrollBehavior` function receives the `to` and `from` route objects, like [Navigation Guards](./navigation-guards.md). The third argument, `savedPosition`, is only available if this is a `popstate` navigation (triggered by the browser's back/forward buttons).

The function can return a [`ScrollToOptions`](https://developer.mozilla.org/en-US/docs/Web/API/ScrollToOptions) position object:

```js
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  },
})
```

You can also pass a CSS selector or a DOM element via `el`. In that scenario, `top` and `left` will be treated as relative offsets to that element.

```js
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    // always scroll 10px above the element #main
    return {
      // could also be
      // el: document.getElementById('main'),
      el: '#main',
      // 10px above the element
      top: 10,
    }
  },
})
```

If a falsy value or an empty object is returned, no scrolling will happen.

Returning the `savedPosition` will result in a native-like behavior when navigating with back/forward buttons:

```js
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})
```

If you want to simulate the "scroll to anchor" behavior:

```js
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
      }
    }
  },
})
```

If your browser supports [scroll behavior](https://developer.mozilla.org/en-US/docs/Web/API/ScrollToOptions/behavior), you can make it smooth:

```js
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
  },
})
```

## Delaying the scroll

Sometimes we need to wait a bit before scrolling in the page. For example, when dealing with transitions, we want to wait for the transition to finish before scrolling. To do this you can return a Promise that returns the desired position descriptor. Here is an example where we wait 500ms before scrolling:

```js
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ left: 0, top: 0 })
      }, 500)
    })
  },
})
```

It's possible to hook this up with events from a page-level transition component to make the scroll behavior play nicely with your page transitions, but due to the possible variance and complexity in use cases, we simply provide this primitive to enable specific userland implementations.

## Advanced offsets

If your page has a fixed navbar or similar elements, you might need an offset to ensure the target element isn't hidden behind other content.
Using a static offset value may not always work. You might try CSS-based solutions, like adding offsets with `scroll-margin` or `scroll-padding`, or using `::before` and `::after` pseudo-elements. However, these approaches can lead to unexpected behavior.

In such cases, it's better to calculate the offset manually. A simple way to do this is by combining CSS with JavaScript's `getComputedStyle()`. This lets each element define its own offset dynamically. Here's an example:

```js
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    const mainElement = document.querySelector('#main')
    if (mainElement) {
      const marginTop = parseFloat(
        getComputedStyle(mainElement).scrollMarginTop
      )
      return {
        el: mainElement,
        top: marginTop,
      }
    } else {
      return { top: 0 }
    }
  },
})
```

---

---
url: /data-loaders/ssr.md
---
# Server side rendering

Use [Colada Loader](./colada/) to take advantage of its SSR caching capabilities. If you don't need SSR, you can use any loader implementation.

---

---
url: /guide/advanced/transitions.md
---
# Transitions

In order to use transitions on your route components and animate navigations, you need to use the [`<RouterView>` slot](./router-view-slot):

```vue-html
<router-view v-slot="{ Component }">
  <transition name="fade">
    <component :is="Component" />
  </transition>
</router-view>
```

[All transition APIs](https://vuejs.org/guide/built-ins/transition.html) work the same here.

## Per-Route Transition

The above usage will apply the same transition for all routes. If you want each route's component to have different transitions, you can instead combine [meta fields](./meta.md) and a dynamic `name` on `<transition>`:

```js
const routes = [
  {
    path: '/custom-transition',
    component: PanelLeft,
    meta: { transition: 'slide-left' },
  },
  {
    path: '/other-transition',
    component: PanelRight,
    meta: { transition: 'slide-right' },
  },
]
```

```vue-html
<router-view v-slot="{ Component, route }">
  <!-- Use a custom transition or fallback to `fade` -->
  <transition :name="route.meta.transition || 'fade'">
    <component :is="Component" />
  </transition>
</router-view>
```

## Route-Based Dynamic Transition

It is also possible to determine the transition to use dynamically based on the relationship between the target route and current route. Using a very similar snippet to the one just before:

```vue-html
<!-- use a dynamic transition name -->
<router-view v-slot="{ Component, route }">
  <transition :name="route.meta.transition">
    <component :is="Component" />
  </transition>
</router-view>
```

We can add an [after navigation hook](./navigation-guards.md#Global-After-Hooks) to dynamically add information to the `meta` field based on the depth of the route

```js
router.afterEach((to, from) => {
  const toDepth = to.path.split('/').length
  const fromDepth = from.path.split('/').length
  to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left'
})
```

## Forcing a transition between reused views

Vue might automatically reuse components that look alike, avoiding any transition. Fortunately, it is possible [to add a `key` attribute](https://vuejs.org/api/built-in-special-attributes.html#key) to force transitions. This also allows you to trigger transitions while staying on the same route with different params:

```vue-html
<router-view v-slot="{ Component, route }">
  <transition name="fade">
    <component :is="Component" :key="route.path" />
  </transition>
</router-view>
```

## Initial navigation and transitions

Usually, enter animations are ignored by Vue's `<Transition>` unless we add the `appear` prop. But you'll notice that, when using it alongside `<RouterView>`, transitions are **always** applied despite the `appear` prop not being set. This is because navigations are asynchronous in Vue Router, meaning that the Vue application renders once before the initial navigation is finished. There are different ways to adapt this. The easiest one is to await the initial navigation before mounting the app with [`isReady`](https://router.vuejs.org/api/interfaces/Router.html#isReady):

```ts
const app = createApp(App)
app.use(router)

// mount after the initial navigation is ready
await router.isReady()
app.mount('#app')
```

---

---
url: /guide/advanced/typed-routes.md
---
# Typed Routes&#x20;

![RouterLink to autocomplete](https://user-images.githubusercontent.com/664177/176442066-c4e7fa31-4f06-4690-a49f-ed0fd880dfca.png)

It's possible to configure the router to have a *map* of typed routes. While this can be done manually, it is recommended to use the [unplugin-vue-router](https://github.com/posva/unplugin-vue-router) plugin to generate the routes and the types automatically from a file based routing system.

## Manual Configuration

Here is an example of how to manually configure typed routes:

```ts
// import the `RouteRecordInfo` type from vue-router to type your routes
import type { RouteRecordInfo } from 'vue-router'

// Define an interface of routes
export interface RouteNamedMap {
  // each key is a name
  home: RouteRecordInfo<
    // here we have the same name
    'home',
    // this is the path, it will appear in autocompletion
    '/',
    // these are the raw params (what can be passed to router.push() and RouterLink's "to" prop)
    // In this case, there are no params allowed
    Record<never, never>,
    // these are the normalized params (what you get from useRoute())
    Record<never, never>,
    // this is a union of all children route names, in this case, there are none
    never
  >
  // repeat for each route...
  // Note you can name them whatever you want
  'named-param': RouteRecordInfo<
    'named-param',
    '/:name',
    { name: string | number }, // Allows string or number
    { name: string }, // but always returns a string from the URL
    'named-param-edit'
  >
  'named-param-edit': RouteRecordInfo<
    'named-param-edit',
    '/:name/edit',
    { name: string | number }, // we also include parent params
    { name: string },
    never
  >
  'article-details': RouteRecordInfo<
    'article-details',
    '/articles/:id+',
    { id: Array<number | string> },
    { id: string[] },
    never
  >
  'not-found': RouteRecordInfo<
    'not-found',
    '/:path(.*)',
    { path: string },
    { path: string },
    never
  >
}

// Last, you will need to augment the Vue Router types with this map of routes
declare module 'vue-router' {
  interface TypesConfig {
    RouteNamedMap: RouteNamedMap
  }
}
```

::: tip

This is indeed tedious and error-prone. That's why it's recommended to use [unplugin-vue-router](https://github.com/posva/unplugin-vue-router) to generate the routes and the types automatically from a file-based routing system.

:::

---

---
url: /guide/advanced/composition-api.md
---
# Vue Router and the Composition API

The introduction of Vue's [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html) opened up new possibilities, but to be able to get the full potential out of Vue Router, we will need to use a few new functions to replace access to `this` and in-component navigation guards.

## Accessing the Router and current Route inside `setup`

Because we don't have access to `this` inside of `setup`, we cannot directly access `this.$router` or `this.$route`. Instead, we use the `useRouter` and `useRoute` composables:

```vue
<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

function pushWithQuery(query) {
  router.push({
    name: 'search',
    query: {
      ...route.query,
      ...query,
    },
  })
}
</script>
```

The `route` object is a reactive object. In most scenarios, you should **avoid watching the whole `route`** object. Instead, you can directly watch the properties you are expecting to change:

```vue
<script setup>
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'

const route = useRoute()
const userData = ref()

// fetch the user information when params change
watch(
  () => route.params.id,
  async newId => {
    userData.value = await fetchUser(newId)
  }
)
</script>
```

Note we still have access to `$router` and `$route` in templates, so there's no need to use `useRouter` or `useRoute` if we only need those objects in the template.

## Navigation Guards

Vue Router exposes update and leave guards as Composition API functions:

```vue
<script setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { ref } from 'vue'

// same as beforeRouteLeave option but with no access to `this`
onBeforeRouteLeave((to, from) => {
  const answer = window.confirm(
    'Do you really want to leave? you have unsaved changes!'
  )
  // cancel the navigation and stay on the same page
  if (!answer) return false
})

const userData = ref()

// same as beforeRouteUpdate option but with no access to `this`
onBeforeRouteUpdate(async (to, from) => {
  // only fetch the user if the id changed as maybe only the query or the hash changed
  if (to.params.id !== from.params.id) {
    userData.value = await fetchUser(to.params.id)
  }
})
</script>
```

Composition API guards can also be used in any component rendered by `<router-view>`, they don't have to be used directly on the route component like in-component guards.

## `useLink`

Vue Router exposes the internal behavior of RouterLink as a composable. It accepts a reactive object like the props of `RouterLink` and exposes low-level properties to build your own `RouterLink` component or generate custom links:

```vue
<script setup>
import { RouterLink, useLink } from 'vue-router'
import { computed } from 'vue'

const props = defineProps({
  // add @ts-ignore if using TypeScript
  ...RouterLink.props,
  inactiveClass: String,
})

const {
  // the resolved route object
  route,
  // the href to use in a link
  href,
  // boolean ref indicating if the link is active
  isActive,
  // boolean ref indicating if the link is exactly active
  isExactActive,
  // function to navigate to the link
  navigate,
} = useLink(props)

const isExternalLink = computed(
  () => typeof props.to === 'string' && props.to.startsWith('http')
)
</script>
```

Note that the RouterLink's `v-slot` gives access to the same properties as the `useLink` composable.

---

---
url: /guide/advanced/navigation-failures.md
---
# Waiting for the result of a Navigation

When using `router-link`, Vue Router calls `router.push` to trigger a navigation. While the expected behavior for most links is to navigate a user to a new page, there are a few situations where users will remain on the same page:

* Users are already on the page that they are trying to navigate to.
* A [navigation guard](./navigation-guards.md) aborts the navigation by doing `return false`.
* A new navigation guard takes place while the previous one not finished.
* A [navigation guard](./navigation-guards.md) redirects somewhere else by returning a new location (e.g. `return '/login'`).
* A [navigation guard](./navigation-guards.md) throws an `Error`.

If we want to do something after a navigation is finished, we need a way to wait after calling `router.push`. Imagine we have a mobile menu that allows us to go to different pages and we only want to hide the menu once we have navigated to the new page, we might want to do something like this:

```js
router.push('/my-profile')
this.isMenuOpen = false
```

But this will close the menu right away because **navigations are asynchronous**, we need to `await` the promise returned by `router.push`:

```js
await router.push('/my-profile')
this.isMenuOpen = false
```

Now the menu will close once the navigation is finished but it will also close if the navigation was prevented. We need a way to detect if we actually changed the page we are on or not.

## Detecting Navigation Failures

If a navigation is prevented, resulting in the user staying on the same page, the resolved value of the `Promise` returned by `router.push` will be a *Navigation Failure*. Otherwise, it will be a *falsy* value (usually `undefined`). This allows us to differentiate the case where we navigated away from where we are or not:

```js
const navigationResult = await router.push('/my-profile')

if (navigationResult) {
  // navigation prevented
} else {
  // navigation succeeded (this includes the case of a redirection)
  this.isMenuOpen = false
}
```

*Navigation Failures* are `Error` instances with a few extra properties that gives us enough information to know what navigation was prevented and why. To check the nature of a navigation result, use the `isNavigationFailure` function:

```js
import { NavigationFailureType, isNavigationFailure } from 'vue-router'

// trying to leave the editing page of an article without saving
const failure = await router.push('/articles/2')

if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
  // show a small notification to the user
  showToast('You have unsaved changes, discard and leave anyway?')
}
```

::: tip
If you omit the second parameter: `isNavigationFailure(failure)`, it will only check if `failure` is a *Navigation Failure*.
:::

## Global navigation failures

You can detect global navigation failures globally by using the [`router.afterEach()` navigation guard](./navigation-guards.md#Global-After-Hooks):

```ts
router.afterEach((to, from, failure) => {
  if (failure) {
    sendToAnalytics(to, from, failure)
  }
})
```

## Differentiating Navigation Failures

As we said at the beginning, there are different situations aborting a navigation, all of them resulting in different *Navigation Failures*. They can be differentiated using the `isNavigationFailure` and `NavigationFailureType`. There are three different types:

* `aborted`: `false` was returned inside of a navigation guard to the navigation.
* `cancelled`: A new navigation took place before the current navigation could finish. e.g. `router.push` was called while waiting inside of a navigation guard.
* `duplicated`: The navigation was prevented because we are already at the target location.

## *Navigation Failures*'s properties

All navigation failures expose `to` and `from` properties to reflect the current location as well as the target location for the navigation that failed:

```js
// trying to access the admin page
router.push('/admin').then(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
    failure.to.path // '/admin'
    failure.from.path // '/'
  }
})
```

In all cases, `to` and `from` are normalized route locations.

## Detecting Redirections

When returning a new location inside of a Navigation Guard, we are triggering a new navigation that overrides the ongoing one. Differently from other return values, a redirection doesn't prevent a navigation, **it creates a new one**. It is therefore checked differently, by reading the `redirectedFrom` property in a Route Location:

```js
await router.push('/my-profile')
if (router.currentRoute.value.redirectedFrom) {
  // redirectedFrom is resolved route location like to and from in navigation guards
}
```
