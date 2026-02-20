### Single-File Components

Vue Router is most commonly used in applications built using a bundler (e.g. Vite) and [SFCs](https://vuejs.org/guide/introduction.html#single-file-components) (i.e. `.vue` files). Most of the examples in this guide will be written in that style, but Vue Router itself doesn't require you to use build tools or SFCs.

For example, if you're using the *global builds* of [Vue](https://vuejs.org/guide/quick-start.html#using-vue-from-cdn) and [Vue Router](../installation#Direct-Download-CDN), the libraries are exposed via global objects, rather than imports:

```js
const { createApp } = Vue
const { createRouter, createWebHistory } = VueRouter
```
