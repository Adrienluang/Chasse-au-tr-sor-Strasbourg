### App.vue

```vue [App.vue]
<template>
  <h1>Hello App!</h1>
  <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  <nav>
    <RouterLink to="/">Go to Home</RouterLink>
    <RouterLink to="/about">Go to About</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>
```

This template is using two components provided by Vue Router, `RouterLink` and `RouterView`.

Instead of using regular `<a>` tags, we use the custom component `RouterLink` to create links. This allows Vue Router to change the URL without reloading the page, handle URL generation, encoding, and various other features. We'll go into more detail about `RouterLink` in later sections of the guide.

The `RouterView` component tells Vue Router where to render the current **route component**. That's the component that corresponds to the current URL path. It doesn't have to be in `App.vue`, you can put it anywhere to adapt it to your layout, but it does need to be included somewhere, otherwise Vue Router won't render anything.

The example above also uses {{ $route.fullPath }}. You can use `$route` in your component templates to access an object that represents the current route.
