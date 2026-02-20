### Auto Update

You must import the virtual module when you configure `registerType: 'autoUpdate'` and you want your application inform the user when the application is ready to work `offline`:

```ts
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onOfflineReady() {}
})
```

You need to show a ready to work offline message to the user with an OK button inside `onOfflineReady` method.

When the user clicks the `OK` button, just hide the prompt shown on `onOfflineReady` method.
