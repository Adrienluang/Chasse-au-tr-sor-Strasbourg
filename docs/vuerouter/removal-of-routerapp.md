### Removal of `router.app`

`router.app` used to represent the last root component (Vue instance) that injected the router. Vue Router can now be safely used by multiple Vue applications at the same time. You can still add it when using the router:

```js
app.use(router)
router.app = app
```

You can also extend the TypeScript definition of the `Router` interface to add the `app` property.

**Reason**: Vue 3 applications do not exist in Vue 2 and now we properly support multiple applications using the same Router instance, so having an `app` property would have been misleading because it would have been the application instead of the root instance.
