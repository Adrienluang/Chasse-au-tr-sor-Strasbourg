### `routes` option is required in `options`

The property `routes` is now required in `options`.

```js
createRouter({ routes: [] })
```

**Reason**: The router is designed to be created with routes even though you can add them later on. You need at least one route in most scenarios and this is written once per app in general.
