### Missing required `params` on named routes

Pushing or resolving a named route without its required params will throw an error:

```js
// given the following route:
const routes = [{ path: '/users/:id', name: 'user', component: UserDetails }]

// Missing the `id` param will fail
router.push({ name: 'user' })
router.resolve({ name: 'user' })
```

**Reason**: Same as above.
