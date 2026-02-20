### Removal of the `fallback` option

The `fallback` option is no longer supported when creating the router:

```diff
-new VueRouter({
+createRouter({
-  fallback: false,
// other options...
})
```

**Reason**: All browsers supported by Vue support the [HTML5 History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API), allowing us to avoid hacks around modifying `location.hash` and directly use `history.pushState()`.
