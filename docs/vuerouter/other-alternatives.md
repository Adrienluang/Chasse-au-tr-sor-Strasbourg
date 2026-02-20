### Other alternatives

* Allowing blocking data loaders to return objects of properties:

  ::: details

  ```ts
  export const useUserData = defineLoader(async route => {
    const user = await getUserById(route.params.id)
    // instead of return user
    return { user }
  })
  // instead of const { data: user } = useUserData()
  const { user } = useUserData()
  ```

  This was the initial proposal but since this is not possible with lazy loaders it was more complex and less intuitive. Having one single version is overall easier to handle. It does allow to return pending promises in the object that aren't awaited:

  ```ts
    export const useUserData = defineLoader(async (route) => {
    return {
      // awaited
      user: await getUserById(route.params.id)
      // not awaited, like lazy
      nonCriticalData: getNonCriticalData() // Promise<...>
    }
  })
  ```

  But this version overlaps with `lazy: true`. While semantically it would be more natural if it was defined with **one** loader, it limits the API to one loader per page and not being able to reuse the data, loading state, error, etc across pages and components, which also limits the extensibility.

  :::

* Adding a new `<script loader>` similar to `<script setup>`:

  ::: details

  ```vue
  <script lang="ts" loader="useUserData">
  import { getUserById } from '~/api/users'
  import { useRoute } from 'vue-router' // could be automatically imported

  const route = useRoute()
  // any variable created here is available in useLoader()
  const user = await getUserById(route.params.id)
  </script>

  <script lang="ts" setup>
  const { user, isLoading, error } = useUserData()
  </script>
  ```

  Too magical without clear benefit.

  :::

* Pass route properties instead of the whole `route` object:

  ::: details

  ```ts
  import { getUserById } from '../api'

  export const useUserData = defineLoader(async ({ params }) => {
    const user = await getUserById(params.id)
    return { user }
  })
  ```

  This has the problem of not being able to use the `route.name` to determine the correct typed params (with [unplugin-vue-router][uvr]):

  ```ts
  import { getUserById } from '../api'

  export const useUserData = defineLoader(async route => {
    if (route.name === 'user-details') {
      const user = await getUserById(route.params.id)
      //                                    ^ typed!
      return { user }
    }
  })
  ```

  :::

* Naming

  ::: details

  Variables could be named differently and proposals are welcome:

  * `isLoading` -> `isPending`, `pending` (same as Nuxt)
  * Rename `defineLoader()` to `defineDataFetching()` (or others)

  :::

* Nested/Sequential Loaders drawbacks

  ::: details

  * Allowing `await getUserById()` could make people think they should also await inside `<script setup>` and that would be a problem because it would force them to use `<Suspense>` when they don't need to. I think this is solved by changing the return type of the loader to a promise of just data, making it easy to spot the mistake. It could also be solved by forcing the need of a parameter `to` to ensure the type safety as explained [above](#sequential-fetching).

  * Another alternative is to pass an array of loaders to the loader that needs them and let it retrieve them through an argument, but it feels *considerably* less ergonomic:

    ```ts
    import { useUserData } from '~/pages/users/[id].vue'

    export const useUserFriends = defineLoader(
      async (route, { loaders: [userData] }) => {
        const friends = await getFriends(user.value.id)
        return { ...userData.value, friends }
      },
      {
        // explicit dependencies
        waitFor: [useUserData],
      }
    )
    ```

  :::

* Advanced `lazy`

  ::: details

  The `lazy` flag could be extended to also accept a number (timeout) or a function (dynamic value). I think this is too much and should therefore not be included. It can always be implemented by custom data loaders but I don't think it should be a requirement for the basic API.

  Passing a *number* to `lazy` could block the navigation for that number of milliseconds, then let it be:

  ```vue
  <script lang="ts">
  import { getUserById } from '../api'

  export const useUserData = defineLoader(
    async route => {
      const user = await getUserById(route.params.id)
      return user
    },
    // block the navigation for 1 second and then let the navigation go through
    { lazy: 1000 }
  )
  </script>

  <script setup>
  const { data, isLoading, error } = useUserData()
  //      ^ Ref<User | undefined>
  </script>
  ```

  Note that lazy loaders can only control their own blocking mechanism. They can't control the blocking of other loaders. If multiple loaders are being used and one of them is blocking, the navigation will be blocked until all of the blocking loaders are resolved.

  A function could allow to conditionally block upon navigation:

  ```ts
  export const useUserData = defineLoader(
    loader,
    // ...
    {
      lazy: route => {
        // ...
        return true // or a number
      },
    }
  )
  ```

  :::

* One could argue being able to reuse the result of loaders across any component other than page makes this more complex. Other frameworks expose a single *load* function from page components (SvelteKit, Remix)

## Adoption strategy

Introduce this as part of [unplugin-vue-router][uvr] to test it first and make it part of the router later on.

## Unresolved questions

* Integration with Server specifics in Frameworks like Nuxt: cookies, headers, server only loaders (can create redirect codes)
* Should there by a `beforeLoad()` hook that is called and awaited before all data loaders
* Same for `afterLoad()` that is always called after all data loaders
* What else is needed besides the `route` inside loaders?
* \~~Add option for placeholder data?~~ Data Loaders should implement this themselves
* What other operations might be necessary for users?

[uvr]: https://github.com/posva/unplugin-vue-router "unplugin-vue-router"

[pinia-colada]: https://github.com/posva/pinia-colada "@pinia/colada"

[vue-query]: https://tanstack.com/query/latest/docs/framework/vue/overview "@tanstack/vue-query"

---

---
url: /data-loaders/defining-loaders.md
---
# Defining Data Loaders

In order to use data loaders, you need to define them first. Data loaders themselves are the composables returned by the different `defineLoader` functions. Each loader definition is specific to the `defineLoader` function used. For example, `defineBasicLoader` expects an async function as the first argument while `defineColadaLoader` expects an object with a `query` function. All loaders should allow to pass an async function that can throw errors, and call `reroute()` to control the navigation.

Any composables returned by *any* `defineLoader` function share the same signature:

```vue twoslash
<script lang="ts">
import 'vue-router/auto-routes'
// ---cut---
import { defineBasicLoader } from 'vue-router/experimental'
import { getUserById } from '../api'

export const useUserData = defineBasicLoader('/users/[id]', async to => {
  return getUserById(to.params.id)
})
</script>

<script setup lang="ts">
const {
  data: user, // the data returned by the loader
  isLoading, // a boolean indicating if the loader is fetching data
  error, // an error object if the loader failed
  reload, // a function to refetch the data without navigating
} = useUserData()
</script>
```

**But they are not limited by it!** For example, the `defineColadaLoader` function returns a composable with a few more properties like `status` and `refresh`. Because of this it's important to refer to the documentation of the specific loader you are using.

This page will guide you through the **foundation** of defining data loaders, no matter their implementation.

## The loader function

The loader function is the *core* of data loaders. They are asynchronous functions that return the data you want to expose in the `data` property of the returned composable.
