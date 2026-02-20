### `$router.push()` and `$router.replace()` - `onComplete` and `onAbort` callbacks

Previously, `$router.push()` and `$router.replace()` accepted two callbacks, `onComplete` and `onAbort`, as second and third arguments. They were called after a navigation based on the result. With the introduction of a Promise based API, these callbacks are redundant and have been removed. See [Navigation Failures](/guide/advanced/navigation-failures.md) for more information on how to detect successful and failed navigations.

**Reason**: Reduce library size by adapting to established JS standards (Promises).
