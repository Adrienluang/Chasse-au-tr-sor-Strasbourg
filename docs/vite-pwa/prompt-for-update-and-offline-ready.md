### Prompt for update and offline ready

```vue
<script setup>
// If you want to use it in setup, import from the nuxtApp.
const { $pwa } = useNuxtApp()

const toast = useToast()

onMounted(() => {
  if ($pwa.offlineReady)
    toast.success('App ready to work offline')
})
</script>

<template>
  <!-- You can use $pwa directly in templates! -->
  <div v-show="$pwa.needRefresh">
    <span>
      New content available, click on reload button to update.
    </span>

    <button @click="$pwa.updateServiceWorker()">
      Reload
    </button>
  </div>
</template>
```

## PWA Assets &#x20;

This new feature includes:

* new `NuxtPwaAssets` component to include the PWA assets in your HTML pages: if you're using `VitePwaManifest` or `NuxtPwaManifest` component, replace it with `NuxtPwaAssets`: it will inject the web manifest link, the `theme-color` meta and the PWA icon links.
* new `PwaAppleImage`, `PwaAppleSplashScreenImage`, `PwaFaviconImage`, `PwaMaskableImage` and `PwaTransparentImage` components to use PWA icons in your code base
* new `useApplePwaIcon`, `useAppleSplashScreenPwaIcon`, `useFaviconPwaIcon`, `useMaskablePwaIcon` and `useTransparentPwaIcon` composables
* injects `$pwaIcons` with all configured PWA icons: you can use them via `useNuxtApp().$pwaIcons` or inside your Vue templates

New components, composables and `$pwaIcons` injection are statically analisable, that's, pwa icons types are generated when running `nuxt prepare` command: if you want to disable the PWA assets you don't need to remove the code (you can remove unused components/code later if you want to remove the new feature).

---

---
url: /guide/periodic-sw-updates.md
---

# Periodic Service Worker Updates

:::info
If you're not importing any of the virtual modules provided by `vite-plugin-pwa` you'll need to figure out how to configure it, it is out of the scope of this guide.
:::

As explained in [Manual Updates](https://web.dev/articles/service-worker-lifecycle#manual_updates) entry in [The Service Worker Lifecycle](https://web.dev/articles/service-worker-lifecycle) article, you can use this code to configure periodic service worker updates on your application on your `main.ts` or `main.js`:

::: details main.ts / main.js

```ts
import { registerSW } from 'virtual:pwa-register'

const intervalMS = 60 * 60 * 1000

const updateSW = registerSW({
  onRegistered(r) {
    r && setInterval(() => {
      r.update()
    }, intervalMS)
  }
})
```

:::

The interval must be in milliseconds, in the example above it is configured to check the service worker every hour.

## Handling Edge Cases

::: info
From version `0.12.8+` we have a new option, `onRegisteredSW`, and `onRegistered` has been deprecated. If `onRegisteredSW` is present, `onRegistered` will never be called.
:::

Previous script will allow you to check if there is a new version of your application available, but you will need also to deal with some edge cases like:

* server is down when calling the update method
* the user can go offline at any time

To mitigate previous problems, use this more complex snippet:

::: details main.ts / main.js

```ts
import { registerSW } from 'virtual:pwa-register'

const intervalMS = 60 * 60 * 1000

const updateSW = registerSW({
  onRegisteredSW(swUrl, r) {
    r && setInterval(async () => {
      if (r.installing || !navigator)
        return

      if (('connection' in navigator) && !navigator.onLine)
        return

      const resp = await fetch(swUrl, {
        cache: 'no-store',
        headers: {
          'cache': 'no-store',
          'cache-control': 'no-cache',
        },
      })

      if (resp?.status === 200)
        await r.update()
    }, intervalMS)
  }
})
```

:::

---

---
url: /examples/preact.md
---

# Preact

The `Preact` example project can be found on [examples/preact-router](https://github.com/vite-pwa/vite-plugin-pwa/tree/main/examples/preact-router) package/directory.

The router used on this example project is [preact-router](https://github.com/preactjs/preact-router).

To test `new content available`, you should rerun the corresponding script, and then refresh the page.

If you are running an example with `Periodic SW updates`, you will need to wait 1 minute:


## Executing the examples

## generateSW

## injectManifest

---

---
url: /frameworks/preact.md
---

# Preact

You can use the built-in `Vite` virtual module `virtual:pwa-register/preact` for `Preact` which will return `useState` stateful values (`useState<boolean>`) for `offlineReady` and `needRefresh`.

::: warning
You will need to add `workbox-window` as a `dev` dependency to your `Vite` project.
:::

## Type declarations

::: tip

From version `0.14.5` you can also use types definition for preact instead of `vite-plugin-pwa/client`:

```json
{
  "compilerOptions": {
    "types": [
      "vite-plugin-pwa/preact"
    ]
  }
}
```

Or you can add the following reference in any of your `d.ts` files (for example, in `vite-env.d.ts` or `global.d.ts`):

```ts
/// <reference types="vite-plugin-pwa/preact" />
```

:::

```ts
declare module 'virtual:pwa-register/preact' {
  import type { StateUpdater } from 'preact/hooks'
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types'

  export type { RegisterSWOptions }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [boolean, StateUpdater<boolean>]
    offlineReady: [boolean, StateUpdater<boolean>]
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}
```

## Prompt for update

You can use this `ReloadPrompt.tsx` component:

::: details ReloadPrompt.tsx

```tsx
import './ReloadPrompt.css'

import { useRegisterSW } from 'virtual:pwa-register/preact'

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <div className="ReloadPrompt-container">
      { (offlineReady || needRefresh)
        && <div className="ReloadPrompt-toast">
            <div className="ReloadPrompt-toast-message">
              { offlineReady
                ? <span>App ready to work offline</span>
                : <span>New content available, click on reload button to update.</span>
              }
            </div>
            { needRefresh && <button className="ReloadPrompt-toast-button" onClick={() => updateServiceWorker(true)}>Reload</button> }
            <button className="ReloadPrompt-toast-button" onClick={() => close()}>Close</button>
        </div>
      }
    </div>
  )
}

export default ReloadPrompt
```

:::

and its corresponding `ReloadPrompt.css` styles file:

::: details ReloadPrompt.css

```css
.ReloadPrompt-container {
    padding: 0;
    margin: 0;
    width: 0;
    height: 0;
}
.ReloadPrompt-toast {
    position: fixed;
    right: 0;
    bottom: 0;
    margin: 16px;
    padding: 12px;
    border: 1px solid #8885;
    border-radius: 4px;
    z-index: 1;
    text-align: left;
    box-shadow: 3px 4px 5px 0 #8885;
    background-color: white;
}
.ReloadPrompt-toast-message {
    margin-bottom: 8px;
}
.ReloadPrompt-toast-button {
    border: 1px solid #8885;
    outline: none;
    margin-right: 5px;
    border-radius: 2px;
    padding: 3px 10px;
}
```

:::

## Periodic SW Updates

As explained in [Periodic Service Worker Updates](/guide/periodic-sw-updates), you can use this code to configure this behavior on your application with the virtual module `virtual:pwa-register/preact`:

```ts
import { useRegisterSW } from 'virtual:pwa-register/preact'

const intervalMS = 60 * 60 * 1000

const updateServiceWorker = useRegisterSW({
  onRegistered(r) {
    r && setInterval(() => {
      r.update()
    }, intervalMS)
  }
})
```

The interval must be in milliseconds, in the example above it is configured to check the service worker every hour.

---

---
url: /guide/prompt-for-update.md
---

# Prompt for new content refreshing

## Plugin Configuration

Since this is the default behavior for the `registerType` plugin option, you don't need to configure it.
