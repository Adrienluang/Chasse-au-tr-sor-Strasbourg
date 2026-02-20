### Global API

It's possible to access a global state of when data loaders are fetching (during navigation or when `reload()` is called) as well as when the data fetching navigation guard is running (only when navigating).

* `isFetchingData: Ref<boolean>`: is any loader currently fetching data? e.g. calling the `reload()` method of a loader
* `isNavigationFetching: Ref<boolean>`: is navigation being hold by a loader? (implies `isFetchingData.value === true`). Calling the `reload()` method of a loader doesn't change this.

TBD: is this worth it? Are any other functions needed?
