### Global Selectors {#global-selectors}

If you want just one rule to apply globally, you can use the `:global` pseudo-class rather than creating another `<style>` (see below):

```vue
<style scoped>
:global(.red) {
  color: red;
}
</style>
```
