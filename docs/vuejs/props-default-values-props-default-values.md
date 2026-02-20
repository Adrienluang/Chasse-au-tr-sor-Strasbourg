### Props Default Values {#props-default-values}

When using type-based declaration, we lose the ability to declare default values for the props. This can be resolved by using [Reactive Props Destructure](/guide/components/props#reactive-props-destructure) <sup class="vt-badge" data-text="3.5+" />:

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const { msg = 'hello', labels = ['one', 'two'] } = defineProps<Props>()
```

In 3.4 and below, Reactive Props Destructure is not enabled by default. An alternative is to use the `withDefaults` compiler macro:

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

This will be compiled to equivalent runtime props `default` options. In addition, the `withDefaults` helper provides type checks for the default values, and ensures the returned `props` type has the optional flags removed for properties that do have default values declared.

:::info
Note that default values for mutable reference types (like arrays or objects) should be wrapped in functions when using `withDefaults` to avoid accidental modification and external side effects. This ensures each component instance gets its own copy of the default value. This is **not** necessary when using default values with destructure.
:::
