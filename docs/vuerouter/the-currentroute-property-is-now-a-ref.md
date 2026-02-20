### The `currentRoute` property is now a `ref()`

Previously the properties of the [`currentRoute`](https://v3.router.vuejs.org/api/#router-currentroute) object on a router instance could be accessed directly.

With the introduction of vue-router v4, the underlying type of the `currentRoute` object on the router instance has changed to `Ref<RouteLocationNormalizedLoaded>`, which comes from the newer [reactivity fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html) introduced in Vue 3.

While this doesn't change anything if you're reading the route with `useRoute()` or `this.$route`, if you're accessing it directly on the router instance, you will need to access the actual route object via `currentRoute.value`:

```ts
const { page } = router.currentRoute.query // [!code --]
const { page } = router.currentRoute.value.query // [!code ++]
```
