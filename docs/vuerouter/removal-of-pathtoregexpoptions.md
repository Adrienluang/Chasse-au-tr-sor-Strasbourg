### Removal of `pathToRegexpOptions`

The `pathToRegexpOptions` and `caseSensitive` properties of route records have been replaced with `sensitive` and `strict` options for `createRouter()`. They can now also be directly passed when creating the router with `createRouter()`. Any other option specific to `path-to-regexp` has been removed as `path-to-regexp` is no longer used to parse paths.
