# showError

Within the [Nuxt context](https://nuxt.com/docs/4.x/guide/going-further/nuxt-app#the-nuxt-context) you can use `showError` to show an error.

**Parameters:**

- `error`: `string | Error | Partial<{ cause, data, message, name, stack, status, statusText }>`

```ts
showError('😱 Oh no, an error has been thrown.')
showError({
  status: 404,
  statusText: 'Page Not Found',
})
```

The error is set in the state using [`useError()`](https://nuxt.com/docs/4.x/api/composables/use-error) to create a reactive and SSR-friendly shared error state across components.

::tip
`showError` calls the `app:error` hook.
::

:read-more{to="https://nuxt.com/docs/4.x/getting-started/error-handling"}
