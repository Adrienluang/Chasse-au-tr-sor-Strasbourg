### Delaying data updates with `commit`

By default, the data is updated only once all loaders are resolved. This is useful to avoid displaying partially loaded data or worse, incoherent data aggregation.

Sometimes you might want to immediately update the data as soon as it's available, even if other loaders are still pending. This can be achieved by changing the `commit` option:

```ts twoslash
import { defineBasicLoader } from 'vue-router/experimental'
interface Book {
  title: string
  isbn: string
  description: string
}
function fetchBookCollection(): Promise<Book[]> {
  return {} as any
}
// ---cut---
export const useBookCollection = defineBasicLoader(fetchBookCollection, {
  commit: 'immediate',
})
```

In the case of [lazy loaders](#lazy-loaders), they also default to `commit: 'after-load'`. They will commit after all other non-lazy loaders if they can but since they are not awaited, they might not be able to. In this case, the data will be available when finished loading, which can be much later than the navigation is completed.
