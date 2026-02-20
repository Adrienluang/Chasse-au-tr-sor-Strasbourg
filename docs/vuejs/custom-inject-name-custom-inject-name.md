### Custom Inject Name {#custom-inject-name}

You can customize the property key of the injected classes object by giving the `module` attribute a value:

```vue
<template>
  <p :class="classes.red">red</p>
</template>

<style module="classes">
.red {
  color: red;
}
</style>
```
