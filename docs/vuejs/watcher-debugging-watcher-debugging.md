### Watcher Debugging {#watcher-debugging}

<!-- TODO options API equivalent -->

Similar to `computed()`, watchers also support the `onTrack` and `onTrigger` options:

```js
watch(source, callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})

watchEffect(callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})
```

:::tip
`onTrack` and `onTrigger` watcher options only work in development mode.
:::

## Integration with External State Systems {#integration-with-external-state-systems}

Vue's reactivity system works by deeply converting plain JavaScript objects into reactive proxies. The deep conversion can be unnecessary or sometimes unwanted when integrating with external state management systems (e.g. if an external solution also uses Proxies).

The general idea of integrating Vue's reactivity system with an external state management solution is to hold the external state in a [`shallowRef`](/api/reactivity-advanced#shallowref). A shallow ref is only reactive when its `.value` property is accessed - the inner value is left intact. When the external state changes, replace the ref value to trigger updates.
