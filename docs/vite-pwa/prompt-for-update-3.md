### Prompt for update

Since SvelteKit uses SSR/SSG, we need to add the `ReloadPrompt` component using a dynamic `import`.

The best place to include the `ReloadPrompt` component will be in main layout of the application (you should register it in any layout):

::: details src/routes/+layout.svelte

```html
<script>
  import { pwaInfo } from 'virtual:pwa-info'

  $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ''
</script>

<svelte:head>
    {@html webManifest}
</svelte:head>

<main>
  <slot />
</main>

{#await import('$lib/ReloadPrompt.svelte') then { default: ReloadPrompt}}
  <ReloadPrompt />
{/await}
```

:::

::: details $lib/ReloadPrompt.svelte

```html
<script lang="ts">
  import { useRegisterSW } from 'virtual:pwa-register/svelte'
  const {
    needRefresh,
    updateServiceWorker,
    offlineReady
  } = useRegisterSW({
    onRegistered(r) {
      // uncomment following code if you want check for updates
      // r && setInterval(() => {
      //   console.log('Checking for sw update')
      //   r.update()
      // }, 20000 /* 20s for testing purposes */)
      console.log(`SW Registered: ${r}`)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })
  const close = () => {
    offlineReady.set(false)
    needRefresh.set(false)
  }
  $: toast = $offlineReady || $needRefresh
</script>

{#if toast}
<div class="pwa-toast" role="alert">
  <div class="message">
    {#if $offlineReady}
      <span>
        App ready to work offline
      </span>
    {:else}
      <span>
        New content available, click on reload button to update.
      </span>
    {/if}
  </div>
  {#if $needRefresh}
    <button on:click={() => updateServiceWorker(true)}>
      Reload
    </button>
  {/if}
  <button on:click={close}>
    Close
  </button>
</div>
{/if}

<style>
.pwa-toast {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 16px;
  padding: 12px;
  border: 1px solid #8885;
  border-radius: 4px;
  z-index: 2;
  text-align: left;
  box-shadow: 3px 4px 5px 0 #8885;
  background-color: white;
}
.pwa-toast .message {
  margin-bottom: 8px;
}
.pwa-toast button {
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: 2px;
  padding: 3px 10px;
}
</style>
```

:::

## SvelteKit and Adapters

If you set certain SvelteKit options, you should also configure the PWA plugin properly using the `kit` option:

* [outDir](https://kit.svelte.dev/docs/configuration#outdir)
* [adapterFallback](https://github.com/sveltejs/kit/tree/master/packages/adapter-static#fallback)
* [trailingSlash](https://kit.svelte.dev/docs/configuration#trailingslash)

::: warning
Some kit options may have been moved/deprecated, review the SvelteKit documentation site:

* [trailingSlash](https://kit.svelte.dev/docs/page-options#trailingslash): now it should be configured in the page options, and so, we cannot control it in the plugin.
  :::
