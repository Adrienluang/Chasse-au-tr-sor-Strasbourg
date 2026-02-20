### Auto Update

The best place to use/import the PWA virtual module will be in the main layout of the application (you should register it in any layout):

::: details src/layouts/Layout.astro

```astro
---
import { pwaInfo } from 'virtual:pwa-info';

export interface Props {
  title: string;
}

const { title } = Astro.props as Props;
---
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/pwa-192x192.png">
    <link rel="mask-icon" href="/favicon.svg" color="#FFFFFF">
    <meta name="msapplication-TileColor" content="#FFFFFF">
    <meta name="theme-color" content="#ffffff">
    <title>{title}</title>
    <meta name="description" content={title}>
    <script src="/src/pwa.ts"></script>
    { pwaInfo && <Fragment set:html={pwaInfo.webManifest.linkTag} /> }
  </head>
  <body>
    <main>
        <article>
            <slot />
        </article>
    </main>
  </body>
</html>
```

:::

::: details src/pwa.ts

```ts
import { registerSW } from 'virtual:pwa-register'

registerSW({
  immediate: true,
  onRegisteredSW(swScriptUrl) {
    console.log('SW registered: ', swScriptUrl)
  },
  onOfflineReady() {
    console.log('PWA application ready to work offline')
  },
})
```

:::
