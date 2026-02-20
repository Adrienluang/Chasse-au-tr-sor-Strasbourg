### Redirects and Rewrites

* **Rewrites**:
  ```json
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
  ```
  This rewrite rule is essential for single-page applications (SPAs). It directs any request to any path back to your `index.html`, allowing the front-end routing in your SPA to handle the path.

---

---
url: /guide/cookbook.md
---

# Vite, Rollup, PWA and Workbox cookbook

In this page we're going to explain how `vite-plugin-pwa` builds the service worker.

You can open Excalidraw source diagram for the SVG images.

## Vite config file

## Vite Build CLI

## vite-plugin-pwa closeBundle hook

## workbox-build injectManifest

---

---
url: /examples/vitepress.md
---

# VitePress

You can find a set of examples in the [@vite-pwa/vitepress integration repo](https://github.com/vite-pwa/vitepress/tree/main/examples).

You can also test `VitePress` integration using the source code of this documentation website, you can find it in the [documentation repo](https://github.com/vite-pwa/vite-pwa-docs).

The behavior used in this website is [Prompt for update](/guide/prompt-for-update).

To run this site on your local, execute the following script from your shell (from root folder):

```shell
pnpm run preview
```

---

---
url: /frameworks/vitepress.md
---

# VitePress

::: warning
We recommend you use the latest version of VitePress. The latest versions will also require you to update your application to use Vite ^3.1.0.
:::

::: info
For `Type declarations`, `Prompt for update` and `Periodic SW Updates` go to [Vue 3](/frameworks/vue#vue-3) entry.
:::

## VitePress PWA Module

`vite-plugin-pwa` provides the new `withPwa` module augmentation that will allow you to use `vite-plugin-pwa` in your VitePress applications.

You will need to install `@vite-pwa/vitepress` using:
::: code-group

```bash [pnpm]
pnpm add -D @vite-pwa/vitepress
```

```bash [yarn]
yarn add -D @vite-pwa/vitepress
```

```bash [npm]
npm install -D @vite-pwa/vitepress
```

:::

To update your project to use the new `vite-plugin-pwa` for VitePress, you only need to wrap your VitePress config with `withPwa` (you don't need oldest `pwa` and `pwa-configuration` modules):

```ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'

export default withPwa(defineConfig({
  /* your VitePress options */
  /* Vite PWA Options */
  pwa: {}
}))
```

## Import Virtual Modules

Since VitePress uses SSR/SSG, we need to call the `vite-plugin-pwa` virtual module using a dynamic `import`. This can be done in the [theme](https://vitepress.vuejs.org/guide/theme-introduction). You can either configure the plugin to auto update or prompt for update. Refer below for examples.
