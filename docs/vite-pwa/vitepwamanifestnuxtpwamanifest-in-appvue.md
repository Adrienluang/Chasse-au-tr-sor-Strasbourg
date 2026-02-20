### VitePwaManifest/NuxtPwaManifest in app.vue

When adding `VitePwaManifest` or `NuxtPwaComponent` component to your `app.vue`:

```vue
<template>
  <VitePwaManifest />
  <NuxtPage />
</template>
```

or

```vue
<template>
  <NuxtPwaManifest />
  <NuxtPage />
</template>
```

then, the web manifest link will be added to your HTML pages:

```html
<html>
<head>
    <link rel="manifest" href="/manifest.webmanifest">
</head>
</html>
```
