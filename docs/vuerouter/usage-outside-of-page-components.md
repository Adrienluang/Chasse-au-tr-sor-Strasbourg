### Usage outside of page components

Loaders can be attached to a page even if the page component doesn't use it (invoke the composable returned by `defineLoader()`). This is possible if a nested component uses the data. It can be used in any component by importing the *returned composable*, even outside of the scope of the page components, even by a parent.

On top of that, loaders can be **defined anywhere** and imported where using the data makes sense. This allows to define loaders in a separate `src/loaders` folder and reuse them across pages:

```ts
// src/loaders/user.ts
export const useUserData = defineLoader(...)
// ...
```

Then, in a page component, export it:

```vue
<!-- src/pages/users/[id].vue -->
<script>
export { useUserData } from '~/loaders/user.ts'
</script>
<script setup>
// ...
</script>
```

The page component might not even use `useUserData()` but we can still use it anywhere else:

```vue
<!-- src/components/NavBar.vue -->
<script setup>
import { useUserData } from '~/loaders/user.ts'

const { data: user } = useUserData()
</script>
```

::: warning
If you use a loader in a component while it wasn't exported by a page, it won't be awaited during navigation. This can lead to unexpected behavior but it can be caught during development with a warning.
:::
