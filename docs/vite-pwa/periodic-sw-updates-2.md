### Periodic SW Updates

As explained in [Periodic Service Worker Updates](/guide/periodic-sw-updates), you can use this code to configure this behavior on your application with the `useRegisterSW.js` `mixin`:

```vue
<script>
import useRegisterSW from '@/mixins/useRegisterSW'

const intervalMS = 60 * 60 * 1000

export default {
  name: 'ReloadPrompt',
  mixins: [useRegisterSW],
  methods: {
    handleSWManualUpdates(r) {
      r && setInterval(() => {
        r.update()
      }, intervalMS)
    }
  }
}
</script>
```

The interval must be in milliseconds, in the example above it is configured to check the service worker every hour.
