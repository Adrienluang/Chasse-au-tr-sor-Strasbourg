### Ready To Work Offline

You must include the following code on your `main.ts` or `main.js` file:

```ts
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onOfflineReady() {},
})
```

You will need to show a ready to work offline dialog to the user with an `OK` button inside `onOfflineReady` callback.

When the user clicks the `OK` button, just hide the prompt shown on `onOfflineReady` method.
