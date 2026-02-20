### The `to` argument

The `to` argument represents the location object we are navigating to. It should be used as the source of truth for all data fetching parameters.

```ts twoslash
import 'vue-router/auto-routes'
import { defineBasicLoader } from 'vue-router/experimental'
import { getUserById } from '../api'
// ---cut---
export const useUserData = defineBasicLoader('/users/[id]', async to => {
  const user = await getUserById(to.params.id)
  // here we can modify the data before returning it
  return user
})
```

By using the route location to fetch data, we ensure a consistent relationship between the data and the URL, **improving the user experience**.
