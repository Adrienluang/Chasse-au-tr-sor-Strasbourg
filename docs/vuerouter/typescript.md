### TypeScript

Types are automatically generated for the routes by [unplugin-vue-router][uvr] and can be referenced with the name of each route to hint `defineLoader()` the possible values of the current types. On top of that, `defineLoader()` infers the returned types:

```vue twoslash
<script lang="ts">
// ---cut-start---
import 'vue-router/auto-routes'
import { defineBasicLoader as defineLoader } from 'vue-router/experimental'
// ---cut-end---
import { getUserById } from '../api'

export const useUserData = defineLoader('/users/[id]', async route => {
  //                                                ^|

  //
  const user = await getUserById(route.params.id)
  //                                          ^|
  // ...
  return user
})
</script>

<script lang="ts" setup>
const { data: user, isLoading, error } = useUserData()
//            ^?
//            👆 hover or tap
</script>
```

The arguments can be removed during the compilation step in production mode since they are only used for types and are ignored at runtime.
