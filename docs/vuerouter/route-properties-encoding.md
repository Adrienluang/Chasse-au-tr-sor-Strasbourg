### `$route` properties Encoding

Decoded values in `params`, `query`, and `hash` are now consistent no matter where the navigation is initiated (older browsers will still produce unencoded `path` and `fullPath`). The initial navigation should yield the same results as in-app navigations.

Given any [normalized route location](/api/#RouteLocationNormalized):

* Values in `path`, `fullPath` are not decoded anymore. They will appear as provided by the browser (most browsers provide them encoded). e.g. directly writing on the address bar `https://example.com/hello world` will yield the encoded version: `https://example.com/hello%20world` and both `path` and `fullPath` will be `/hello%20world`.
* `hash` is now decoded, that way it can be copied over: `router.push({ hash: $route.hash })` and be used directly in [scrollBehavior](/api/interfaces/RouterOptions.md#scrollBehavior)'s `el` option.
* When using `push`, `resolve`, and `replace` and providing a `string` location or a `path` property in an object, **it must be encoded** (like in the previous version). On the other hand, `params`, `query` and `hash` must be provided in its unencoded version.
* The slash character (`/`) is now properly decoded inside `params` while still producing an encoded version on the URL: `%2F`.

**Reason**: This allows to easily copy existing properties of a location when calling `router.push()` and `router.resolve()`, and make the resulting route location consistent across browsers. `router.push()` is now idempotent, meaning that calling `router.push(route.fullPath)`, `router.push({ hash: route.hash })`, `router.push({ query: route.query })`, and `router.push({ params: route.params })` will not create extra encoding.
