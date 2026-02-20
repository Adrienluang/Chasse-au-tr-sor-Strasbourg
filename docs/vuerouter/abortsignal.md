### AbortSignal

The loader receives in a second argument access to an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that can be passed on to `fetch` and other Web APIs. If the navigation is cancelled because of errors or a new navigation, the signal aborts, causing any request using it to abort as well.

```ts twoslash
import { defineBasicLoader as defineLoader } from 'vue-router/experimental'
interface Book {
  title: string
  isbn: string
  description: string
}
function fetchBookCollection(options: {
  signal?: AbortSignal
}): Promise<Book[]> {
  return {} as any
}
// ---cut---
export const useBookCollection = defineLoader(async (_route, { signal }) => {
  return fetchBookCollection({ signal })
})
```

This aligns with the future [Navigation API](https://github.com/WICG/navigation-api#navigation-monitoring-and-interception) and other web APIs that use the `AbortSignal` to cancel an ongoing invocation.
