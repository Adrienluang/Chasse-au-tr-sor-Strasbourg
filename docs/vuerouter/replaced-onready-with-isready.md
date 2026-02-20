### Replaced `onReady` with `isReady`

The existing `router.onReady()` function has been replaced with `router.isReady()` which doesn't take any argument and returns a Promise:

```js
// replace
router.onReady(onSuccess, onError)
// with
router.isReady().then(onSuccess).catch(onError)
// or use await:
try {
  await router.isReady()
  // onSuccess
} catch (err) {
  // onError
}
```
