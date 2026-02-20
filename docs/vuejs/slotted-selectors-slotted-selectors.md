### Slotted Selectors {#slotted-selectors}

By default, scoped styles do not affect contents rendered by `<slot/>`, as they are considered to be owned by the parent component passing them in. To explicitly target slot content, use the `:slotted` pseudo-class:

```vue
<style scoped>
:slotted(div) {
  color: red;
}
</style>
```
