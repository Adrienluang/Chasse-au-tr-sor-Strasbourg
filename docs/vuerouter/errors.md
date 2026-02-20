### Errors

Any thrown Error will abort the navigation, just like in navigation guards. They will trigger the `router.onError` handler if defined.

::: tip

Note that [lazy loaders](#lazy-loaders) cannot control the navigation since they do not block it, any thrown error will appear in the `error` property and not abort the navigation nor appear in the `router.onError` handler.

:::

It's possible to define expected errors so they don't abort the navigation. You can read more about it in the [Error Handling](./error-handling.md) section.

## Options

Data loaders are designed to be flexible and allow for customization. Despite being navigation-centric, they can be used outside of a navigation and this flexibility is key to their design.
