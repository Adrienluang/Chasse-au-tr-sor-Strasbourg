### Removal of `parent` from route locations

The `parent` property has been removed from normalized route locations (`this.$route` and object returned by `router.resolve`). You can still access it via the `matched` array:

```js
const parent = this.$route.matched[this.$route.matched.length - 2]
```

**Reason**: Having `parent` and `children` creates unnecessary circular references while the properties could be retrieved already through `matched`.
