### Global Properties

In the loader function, you can access global properties like the router instance, a store, etc. This is because using `inject()` within the loader function **is possible**, just like within navigation guards. Since loaders are asynchronous, make sure you are using the `inject` function **before any `await`**:

```ts twoslash
import 'vue-router/auto-routes'
import { defineBasicLoader } from 'vue-router/experimental'
import { getUserById } from '../api'
// ---cut---
import { inject } from 'vue'
import { useSomeStore, useOtherStore } from '@/stores'

export const useUserData = defineBasicLoader('/users/[id]', async to => {
  // ✅ This will work
  const injectedValue = inject('key') // [!code ++]
  const store = useSomeStore() // [!code ++]

  const user = await getUserById(to.params.id)
  // ❌ These won't work
  const injectedValue2 = inject('key-2') // [!code error]
  const store2 = useOtherStore() // [!code error]
  // ...
  return user
})
```
