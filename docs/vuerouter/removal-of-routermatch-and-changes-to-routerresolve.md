### Removal of `router.match` and changes to `router.resolve`

Both `router.match`, and `router.resolve` have been merged together into `router.resolve` with a slightly different signature. [Refer to the API](/api/interfaces/Router.md#resolve) for more details.

**Reason**: Uniting multiple methods that were used for the same purpose.
