### Core Data Loader features

These are the core features of the Data Loader API that every data loader should implement. Throughout the RFC, we will use a **non-existent**, **generic** `defineLoader()`. This is a placeholder for the actual name of the function, e.g. [`defineBasicLoader()`](./basic/), [`defineColadaLoader()`](./colada/), etc. In practice, one can globally alias the function to `defineLoader` with [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import).

Data Loaders should be able to load data based **solely on the URL**. This ensures that the page can be shared and that the rendering is consistent between the server and the client.

#### `defineLoader()` signature

Data Loaders must accept an optional first parameter to type the route:

```ts twoslash
import 'vue-router/auto-routes'
import { defineBasicLoader as defineLoader } from 'vue-router/experimental'
// ---cut---
import { getUserById } from '../api'

export const useUserData = defineLoader('/users/[id]', async route => {
  return getUserById(route.params.id)
})
```

The rest of the parameters are up to the implementation of the loader but they should accept [extra options](#defineloader-options).

Within loaders there is no access to the current component or page instance, but it's possible to access global injections created with `app.provide()`. This includes stores created with [Pinia](https://pinia.vuejs.org).

#### Returned Composables

Data Loaders are composables that return a set of properties:

```ts twoslash
import 'vue-router/auto-routes'
import { useUserData } from './loaders/users'
// ---cut---
const {
  // hover over each property to see the type
  data,
  isLoading,
  error,
  reload,
} = useUserData()
```

* `data` contains the resolved value returned by the loader. It's a shallow ref to be more performant, especially with large data-sets
* `isLoading` is `true` while a request is isLoading and becomes `false` once the request is settled
* `error` contains any error thrown by the loader. It's also a shallow ref
* `reload()` reruns the loader outside of a navigation

In practice, rename `data` (or others) to something more meaningful:

```ts twoslash
import 'vue-router/auto-routes'
import { useUserData } from './loaders/users'
// ---cut---
const { data: user } = useUserData()
```

#### `defineLoader()` options

* `lazy`: By default, loaders block the navigation. This means that the navigation is only allowed to continue once all loaders are resolved. Lazy loaders **do not block the navigation**. `data`, `error` and other properties might be updated after the navigation finishes. Setting this to `true` is useful for non-critical data fetching and will change the type of the returned `data` to `ShallowRef<T | undefined>`:

  ```ts twoslash
  import { defineBasicLoader as defineLoader } from 'vue-router/experimental'
  interface Book {
    title: string
    isbn: string
    description: string
  }
  function fetchBookCollection(): Promise<Book[]> {
    return {} as any
  }
  // ---cut---
  export const useBookCollection = defineLoader(fetchBookCollection, {
    lazy: true,
  })
  const { data: bookCollection } = useBookCollection()
  //            ^ can be undefined
  ```

* `commit`: Controls when the async state is reflected in `data` and `error`. You can choose to immediately reflect the state of the loader or
  delay the update of the data until all loaders are resolved (default). The latter is useful to avoid displaying partially up-to-date data and inconsistent state.

  ```ts twoslash
  import { defineBasicLoader as defineLoader } from 'vue-router/experimental'
  interface Book {
    title: string
    isbn: string
    description: string
  }
  function fetchBookCollection(): Promise<Book[]> {
    return {} as any
  }
  // ---cut---
  export const useBookCollection = defineLoader(fetchBookCollection, {
    commit: 'immediate',
  })
  ```

  A lazy loader can use `commit: 'after-load'` but since it's not awaited during the navigation, it might be reflected **after the navigation**.

* `server`: By default, loaders are executed on both, client, and server. Setting this to false will skip its execution on the server. Like `lazy: true`, this also changes the type of the returned `data` to `ShallowRef<T | undefined>`:

  ```ts twoslash
  import { defineBasicLoader as defineLoader } from 'vue-router/experimental'
  interface Book {
    title: string
    isbn: string
    description: string
  }
  function fetchBookCollection(): Promise<Book[]> {
    return {} as any
  }
  // ---cut---
  export const useBookCollection = defineLoader(fetchBookCollection, {
    server: false,
  })
  ```

Each custom implementation can augment the returned properties with more information. For example, [Pinia Colada](./colada/) adds `refresh()`, `status` and other properties specific to its features.

#### Parallel Fetching

By default, loaders are executed as soon as possible, in parallel. This scenario works well for most use cases where data fetching only requires route params/query params or nothing at all.

#### Sequential fetching

Sometimes, requests depend on other fetched data (e.g. fetching additional user information). For these scenarios, we can simply import the other loaders and use them **within a different loader**:

Call **and `await`** the loader inside the one that needs it, it will only be fetched once no matter how many times it is called during a navigation:

```ts twoslash
import 'vue-router/auto-routes'
import { defineBasicLoader as defineLoader } from 'vue-router/experimental'
// ---cut---
// import the loader for user information
import { useUserData } from './loaders/users'
import { getCommonFriends, getCurrentUser } from './api'

export const useUserCommonFriends = defineLoader(async route => {
  // loaders must be awaited inside other loaders
  // .        ⤵
  const user = await useUserData() // magically works
  const me = await getCurrentUser()

  // fetch other data
  const commonFriends = await getCommonFriends(me.id, user.id)
  return { ...user, commonFriends }
})
```

You will notice here that we have two different usages for `useUserData()`:

* One that returns all the necessary information we need *synchronously* (not used here). This is the composable that we use in components
* A second version that **only returns a promise of the data**. This is the version used within data loaders that enables sequential fetching.

::: danger
`useUserData()` expects the route to have an `id` param to fetch the current user. We could maybe allow passing the route as a parameter to ensure the type safety as well to further differentiate the two usages (and their type).
:::

##### Nested invalidation

Since `useUserCommonFriends()` loader calls `useUserData()`, if `useUserData()` is somehow *invalidated*, it will also automatically invalidate `useUserCommonFriends()`. This depends on the implementation of the loader and is not a requirement of the API.

::: warning
Two loaders cannot use each other as that would create a *dead lock*.
:::

This can get complex with multiple pages exposing the same loader and other pages using some of their *already exported* loaders within other loaders. But it's not an issue, **the user shouldn't need to handle anything differently**, loaders are still only called once:

```ts twoslash
import 'vue-router/auto-routes'
import { defineBasicLoader as defineLoader } from 'vue-router/experimental'
// ---cut---
import {
  getFriends,
  getCommonFriends,
  getUserById,
  getCurrentUser,
} from './api'

export const useUserData = defineLoader('/users/[id]', async route => {
  return getUserById(route.params.id)
})

export const useCurrentUserData = defineLoader('/users/[id]', async route => {
  const me = await getCurrentUser()
  // imagine legacy APIs that cannot be grouped into one single fetch
  const friends = await getFriends(me.id)

  return { ...me, friends }
})

export const useUserCommonFriends = defineLoader('/users/[id]', async route => {
  const user = await useUserData()
  const me = await useCurrentUserData()

  const friends = await getCommonFriends(user.id, me.id)
  return { ...me, commonFriends: { with: user, friends } }
})
```

In the example above we are exporting multiple loaders but we don't need to care about the order in which they are called nor try optimizing them because **they are only called once and share the data**.

::: danger
**Caveat**: must call **and await** all nested loaders at the top of the parent loader (see `useUserData()` and `useCurrentUserData()`). You cannot put a different regular `await` in between. If you really need to await **anything that isn't a loader** in between, wrap the promise with `withDataContext()` to ensure the loader context is properly restored:

```ts{3}
export const useUserCommonFriends = defineLoader(async (route) => {
  const user = await useUserData()
  await withContext(functionThatReturnsAPromise())
  const me = await useCurrentUserData()

  // ...
})
```

This allows nested loaders to be aware of their *parent loader*. This could probably be linted with an eslint plugin. It is similar to the problem `<script setup>` had before introducing the automatic `withAsyncContext()`. The same feature could be introduced (via a vite plugin) but will also have a performance cost. In the future, this *should* be solved with the [async-context](https://github.com/tc39/proposal-async-context) proposal (stage 2).
:::

#### Cache&#x20;

::: warning
This part has been removed from the core features of the API. It's now part of custom implementations like [Pinia Colada](./colada/).
:::

#### Smart Refreshing

This is not a requirement of the API.

When navigating, depending on the loader, the data is refreshed **automatically based on what params, query params, and hash** are used within the loader.

e.g. using [Pinia Colada](./colada/), given this loader in page `/users/:id`:

```ts
export const useUserData = defineColadaLoader(async route => {
  const user = await getUserById(route.params.id)
  return user
})
```

Going from `/users/1` to `/users/2` will reload the data but going from `/users/2` to `/users/2#projects` will not unless the cache expires or is manually invalidated (known as *refresh*).

#### Deduplication

Loaders also have the advantage of behaving as singleton requests. This means that they are only fetched once per navigation no matter how many times the loader is attached or how many regular components use it. It also means that all the refs (`data`, `isLoading`, etc) are created only once and shared by all components, reducing memory usage.

#### SSR

Each Data Loader implementation is responsible for providing a way to serialize the data loaded on the server and pass it to the client. This is a requirement for SSR to work properly.

Different implementations could have different kind of keys. The simplest form is a string:

```ts
export const useBookCollection = defineLoader(
  async () => {
    const books = await fetchBookCollection()
    return books
  },
  { key: 'bookCollection' }
)
```

##### Avoiding double fetch on the client

One of the advantages of having an initial state is that we can avoid fetching on the client. Data Loaders can implement a mechanism to skip fetching on the client if the initial state is provided ([Pinia Colada](./colada/) implements this). This means nested loaders **aren't executed either**. Since data loaders shouldn't contain side effects besides data fetching, this shouldn't be a problem.
