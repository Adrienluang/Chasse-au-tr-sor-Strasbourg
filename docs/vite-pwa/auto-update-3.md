### Auto Update

Since SvelteKit uses SSR/SSG, we need to call the `vite-plugin-pwa` virtual module using a dynamic `import`.

The best place to include the virtual call will be in main layout of the application (you should register it in any layout):

::: details src/routes/+layout.svelte

```svelte
<script>
  import { onMount } from 'svelte'
  import { pwaInfo } from 'virtual:pwa-info'

  onMount(async () => {
    if (pwaInfo) {
      const { registerSW } = await import('virtual:pwa-register')
      registerSW({
        immediate: true,
        onRegistered(r) {
          // uncomment following code if you want check for updates
          // r && setInterval(() => {
          //    console.log('Checking for sw update')
          //    r.update()
          // }, 20000 /* 20s for testing purposes */)
          console.log(`SW Registered: ${r}`)
        },
        onRegisterError(error) {
          console.log('SW registration error', error)
        }
      })
    }
  })

  $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ''
</script>

<svelte:head>
    {@html webManifest}
</svelte:head>

<main>
  <slot />
</main>
```

:::
