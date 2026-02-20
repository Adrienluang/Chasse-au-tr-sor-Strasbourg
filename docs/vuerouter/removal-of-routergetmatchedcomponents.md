### Removal of `router.getMatchedComponents()`

The method `router.getMatchedComponents` is now removed as matched components can be retrieved from `router.currentRoute.value.matched`:

```js
router.currentRoute.value.matched.flatMap(record =>
  Object.values(record.components)
)
```

**Reason**: This method was only used during SSR and is a one liner that can be done by the user.
