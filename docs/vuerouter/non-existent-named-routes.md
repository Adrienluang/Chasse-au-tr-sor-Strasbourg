### Non existent named routes

Pushing or resolving a non existent named route throws an error:

```js
// Oops, we made a typo in name
router.push({ name: 'homee' }) // throws
router.resolve({ name: 'homee' }) // throws
```

**Reason**: Previously, the router would navigate to `/` but display nothing (instead of the home page). Throwing an error makes more sense because we cannot produce a valid URL to navigate to.
