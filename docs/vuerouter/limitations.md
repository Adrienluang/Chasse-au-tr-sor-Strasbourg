### Limitations

* \~~Injections (`inject`/`provide`) cannot be used within a loader~~ They can now
* Watchers and other composables shouldn't be used within data loaders:
  * if `await` is used before calling a composable e.g. `watch()`, the scope **is not guaranteed**
  * In practice, **this shouldn't be a problem** because there is **no need** to create composables within a loader

## Drawbacks

* At first, it looks less intuitive than just awaiting something inside `setup()` with `<Suspense>` [but it doesn't have its limitations](#suspense) and have many more features
* Requires an extra `<script>` tag but only for page components. A macro `definePageLoader()`/`defineLoader()` could be error-prone as it's very tempting to use reactive state declared within the component's `<script setup>` but that's not possible as the loader must be created outside of its `setup()` function

## Alternatives
