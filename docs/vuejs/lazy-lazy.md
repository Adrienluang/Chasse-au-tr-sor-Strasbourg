### `.lazy` {#lazy}

By default, `v-model` syncs the input with the data after each `input` event (with the exception of IME composition as [stated above](#vmodel-ime-tip)). You can add the `lazy` modifier to instead sync after `change` events:

```vue-html
<!-- synced after "change" instead of "input" -->
<input v-model.lazy="msg" />
```
