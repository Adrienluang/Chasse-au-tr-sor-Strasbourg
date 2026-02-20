### Passing Destructured Props into Functions {#passing-destructured-props-into-functions}

When we pass a destructured prop into a function, e.g.:

```js
const { foo } = defineProps(['foo'])

watch(foo, /* ... */)
```

This will not work as expected because it is equivalent to `watch(props.foo, ...)` - we are passing a value instead of a reactive data source to `watch`. In fact, Vue's compiler will catch such cases and throw a warning.

Similar to how we can watch a normal prop with `watch(() => props.foo, ...)`, we can watch a destructured prop also by wrapping it in a getter:

```js
watch(() => foo, /* ... */)
```

In addition, this is the recommended approach when we need to pass a destructured prop into an external function while retaining reactivity:

```js
useComposable(() => foo)
```

The external function can call the getter (or normalize it with [toValue](/api/reactivity-utilities.html#tovalue)) when it needs to track changes of the provided prop, e.g. in a computed or watcher getter.

</div>

## Prop Passing Details {#prop-passing-details}
