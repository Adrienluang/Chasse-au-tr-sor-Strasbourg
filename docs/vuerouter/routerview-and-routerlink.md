### `RouterView` and `RouterLink`

The components `RouterView` and `RouterLink` are both [registered globally](https://vuejs.org/guide/components/registration.html#global-registration), so they don't need to be imported before using them in component templates. However, if you prefer, you can import them locally, e.g. `import { RouterLink } from 'vue-router'`.

In templates, component names can be written in either PascalCase or kebab-case. Vue's template compiler supports either format, so `<RouterView>` and `<router-view>` are usually equivalent. You should follow whatever convention is used within your project.

If you're using in-DOM templates then [the usual caveats](https://vuejs.org/guide/essentials/component-basics.html#in-dom-template-parsing-caveats) apply: component names must be written in kebab-case and self-closing tags are not supported. So rather than writing `<RouterView />`, you would need to use `<router-view></router-view>` instead.

---

---
url: /installation.md
---
# Installation

## Package managers

If you have an existing project that uses a JavaScript package manager, you can install Vue Router from the npm registry:

::: code-group

```bash [npm]
npm install vue-router@4
```

```bash [yarn]
yarn add vue-router@4
```

```bash [pnpm]
pnpm add vue-router@4
```

```bash [bun]
bun add vue-router@4
```

:::

If you're starting a new project, you might find it easier to use the [create-vue](https://github.com/vuejs/create-vue) scaffolding tool, which creates a Vite-based project with the option to include Vue Router:

::: code-group

```bash [npm]
npm create vue@latest
```

```bash [yarn]
yarn create vue
```

```bash [pnpm]
pnpm create vue
```

```bash [bun]
bun create vue
```

:::

You'll be prompted with some questions about the kind of project you want to create. If you choose to install Vue Router, the example application will also demonstrate some of Vue Router's core features.

Projects using package managers will typically use ES modules to access Vue Router, e.g. `import { createRouter } from 'vue-router'`.

## Direct Download / CDN

<https://unpkg.com/vue-router@4>

[Unpkg.com](https://unpkg.com) provides npm-based CDN links. The above link will always point to the latest release on npm. You can also use a specific version/tag via URLs like `https://unpkg.com/vue-router@4.0.15/dist/vue-router.global.js`.

This will expose Vue Router via a global `VueRouter` object, e.g. `VueRouter.createRouter(...)`.

---

---
url: /introduction.md
---
# Introduction

Watch a Free Vue Router Video Course

Vue Router is the official router for [Vue.js](https://vuejs.org). It deeply integrates with Vue.js core to make building Single Page Applications with Vue.js a breeze. Features include:

* Nested routes mapping
* Dynamic Routing
* Modular, component-based router configuration
* Route params, query, wildcards
* View transition effects powered by Vue.js' transition system
* Fine-grained navigation control
* Links with automatic active CSS classes
* HTML5 history mode or hash mode
* Customizable Scroll Behavior
* Proper encoding for URLs

[Get started](./guide/) or play with the [playground](https://github.com/vuejs/router/tree/main/packages/playground) (see [`README.md`](https://github.com/vuejs/router) to run them).

---

---
url: /guide/advanced/lazy-loading.md
---
# Lazy Loading Routes

When building apps with a bundler, the JavaScript bundle can become quite large, and thus affect the page load time. It would be more efficient if we can split each route's components into separate chunks, and only load them when the route is visited.

Vue Router supports [dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) out of the box, meaning you can replace static imports with dynamic ones:

```js
// replace
// import UserDetails from './views/UserDetails.vue'
// with
const UserDetails = () => import('./views/UserDetails.vue')

const router = createRouter({
  // ...
  routes: [
    { path: '/users/:id', component: UserDetails },
    // or use it directly in the route definition
    { path: '/users/:id', component: () => import('./views/UserDetails.vue') },
  ],
})
```

The `component` (and `components`) option accepts a function that returns a Promise of a component and Vue Router **will only fetch it when entering the page for the first time**, then use the cached version. Which means you can also have more complex functions as long as they return a Promise:

```js
const UserDetails = () =>
  Promise.resolve({
    /* component definition */
  })
```

In general, it's a good idea **to always use dynamic imports** for all your routes.

When using a bundler like Vite or webpack, this will automatically benefit from [code splitting](https://webpack.js.org/guides/code-splitting/).

## Relationship to async components

Vue Router's lazy loading may appear similar to Vue's [async components](https://vuejs.org/guide/components/async.html), but they are distinct features. Do **not** use async components as route components. An async component can still be used inside a route component but the route component itself should just be a function.

## Relationship to functional components

While not common, it is possible to use a [functional component](https://vuejs.org/guide/extras/render-function.html#functional-components) as a route component. However, Vue Router needs some way to differentiate between functional components and lazy loading. To use a functional component we must give the function a `displayName`:

```ts
const AboutPage: FunctionalComponent = () => {
  return h('h1', {}, 'About')
}
AboutPage.displayName = 'AboutPage'
```

## Grouping Components in the Same Chunk

We may want to group all the components nested under the same route into the same chunk, so they can all be loaded with a single request.
