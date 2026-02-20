### Suspense

Using Suspense is probably the first alternative that comes to mind and it has been considered as a solution for data fetching by implementing proofs of concepts. It however suffers from major drawbacks that are tied to its current design and is not a viable solution for data fetching.

One could imagine being able to write something like:

```vue
<!-- src/pages/users.vue = /users -->
<!-- Displays a list of all users -->
<script setup>
const userList = shallowRef(await fetchUserList())

// manually expose a reload function to be called whenever needed
function reload() {
  userList.value = await fetchUserList()
}
</script>
```

Or when params are involved in the data fetching:

```vue
<!-- src/pages/users.[id].vue = /users/:id -->
<!-- Displays a list of all users -->
<script setup>
const route = useRoute()
const user = shallowRef(await fetchUserData(route.params.id))

// manually expose a reload function to be called whenever needed
function reload() {
  user.value = await fetchUserData(route.params.id)
}

// hook into navigation instead of a watcher because we want to block the navigation
onBeforeRouteUpdate(async (to) => {
  // note how we need to use `to` and not `route` here
  user.value = await fetchUserData(to.params.id)
})
</script>
```

This setup has many limitations:

* Nested routes will force **sequential data fetching**: it's not possible to ensure an **optimal parallel fetching**

* Manual data refreshing is necessary **unless you add a `key` attribute** to the `<RouterView>` which will force a remount of the component on navigation. This is not ideal because it will remount the component on every navigation, even when the data is the same. It's necessary if you want to do a `<transition>` but less flexible than the proposed solution which also works with a `key` if needed.

* By putting the fetching logic within the `setup()` of the component we face other issues:
  * No abstraction of the fetching logic => **code duplication** when fetching the same data in multiple components
  * No native way to deduplicate requests among multiple components using them: it requires using a store and extra logic to skip redundant fetches when multiple components are using the same data
  * Does not block the navigation
    * We can block it by mounting the upcoming page component (while the navigation is still blocked by the data loader navigation guard) which can be **expensive in terms of rendering and memory** as we still need to render the old page while we ***try** to mount the new page*.
  * Cannot modify the output of the navigation (e.g. redirecting, cancelling, etc), if the fetching fails, we end up in an error state

* No native way of caching data, even for very simple cases (e.g. no refetching when fast traveling back and forward through browser UI)

* Not possible to precisely read (or write) the loading state (see [vuejs/core#1347](https://github.com/vuejs/core/issues/1347)])

On top of this it's important to note that this RFC doesn't limit you: you can still use Suspense for data fetching or other async state or even use both, **this API is completely tree shakable** and doesn't add any runtime overhead if you don't use it. Aligning with the progressive enhancement nature of Vue.js.
