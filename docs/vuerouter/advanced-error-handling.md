### Advanced Error handling

Since throwing an error in a loader cancels the navigation, this doesn't allow to have an error property in *non lazy loaders* to display the error in the UI. To solve this, we can specify expected errors when defining the loader:

```ts{2-9,16}
// custom error class
class MyError extends Error {
  // override is only needed in TS
  override name = 'MyError' // Displays in logs instead of 'Error'
  // defining a constructor is optional
  constructor(message: string) {
    super(message)
  }
}

export const useUserData = defineLoader(
  async (to) => {
    // ...
  },
  {
    errors: [MyError],
  }
)
```

These can also be specified globally:

```ts{11-13}
class MyError extends Error {
  name = 'MyError'
  constructor(message: string) {
    super(message)
  }
}

app.use(DataLoaderPlugin, {
  router,
// checks with `instanceof MyError`
  errors: [MyError],
})
```

::: tip

In a lazy loader, you can throw an error and since it doesn't block the navigation it will **always** appear in the `error` property. Defining an `errors` property won't change anything.

:::
