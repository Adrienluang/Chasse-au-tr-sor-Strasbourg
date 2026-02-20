### Teleports {#teleports}

Teleports require special handling during SSR. If the rendered app contains Teleports, the teleported content will not be part of the rendered string. An easier solution is to conditionally render the Teleport on mount.

If you do need to hydrate teleported content, they are exposed under the `teleports` property of the ssr context object:

```js
const ctx = {}
const html = await renderToString(app, ctx)

console.log(ctx.teleports) // { '#teleported': 'teleported content' }
```

You need to inject the teleport markup into the correct location in your final page HTML similar to how you need to inject the main app markup.

:::tip
Avoid targeting `body` when using Teleports and SSR together - usually, `<body>` will contain other server-rendered content which makes it impossible for Teleports to determine the correct starting location for hydration.

Instead, prefer a dedicated container, e.g. `<div id="teleported"></div>` which contains only teleported content.
:::

---

---
url: /api/ssr.md
---
# Server-Side Rendering API {#server-side-rendering-api}

## renderToString() {#rendertostring}

- **Exported from `vue/server-renderer`**

- **Type**

  ```ts
  function renderToString(
    input: App | VNode,
    context?: SSRContext
  ): Promise<string>
  ```

- **Example**

  ```js
  import { createSSRApp } from 'vue'
  import { renderToString } from 'vue/server-renderer'

  const app = createSSRApp({
    data: () => ({ msg: 'hello' }),
    template: `<div>{{ msg }}</div>`
  })

  ;(async () => {
    const html = await renderToString(app)
    console.log(html)
  })()
  ```

  ### SSR Context {#ssr-context}

  You can pass an optional context object, which can be used to record additional data during the render, for example [accessing content of Teleports](/guide/scaling-up/ssr#teleports):

  ```js
  const ctx = {}
  const html = await renderToString(app, ctx)

  console.log(ctx.teleports) // { '#teleported': 'teleported content' }
  ```

  Most other SSR APIs on this page also optionally accept a context object. The context object can be accessed in component code via the [useSSRContext](#usessrcontext) helper.

- **See also** [Guide - Server-Side Rendering](/guide/scaling-up/ssr)

## renderToNodeStream() {#rendertonodestream}

Renders input as a [Node.js Readable stream](https://nodejs.org/api/stream.html#stream_class_stream_readable).

- **Exported from `vue/server-renderer`**

- **Type**

  ```ts
  function renderToNodeStream(
    input: App | VNode,
    context?: SSRContext
  ): Readable
  ```

- **Example**

  ```js
  // inside a Node.js http handler
  renderToNodeStream(app).pipe(res)
  ```

  :::tip Note
  This method is not supported in the ESM build of `vue/server-renderer`, which is decoupled from Node.js environments. Use [`pipeToNodeWritable`](#pipetonodewritable) instead.
  :::

## pipeToNodeWritable() {#pipetonodewritable}

Render and pipe to an existing [Node.js Writable stream](https://nodejs.org/api/stream.html#stream_writable_streams) instance.

- **Exported from `vue/server-renderer`**

- **Type**

  ```ts
  function pipeToNodeWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: Writable
  ): void
  ```

- **Example**

  ```js
  // inside a Node.js http handler
  pipeToNodeWritable(app, {}, res)
  ```

## renderToWebStream() {#rendertowebstream}

Renders input as a [Web ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API).

- **Exported from `vue/server-renderer`**

- **Type**

  ```ts
  function renderToWebStream(
    input: App | VNode,
    context?: SSRContext
  ): ReadableStream
  ```

- **Example**

  ```js
  // inside an environment with ReadableStream support
  return new Response(renderToWebStream(app))
  ```

  :::tip Note
  In environments that do not expose `ReadableStream` constructor in the global scope, [`pipeToWebWritable()`](#pipetowebwritable) should be used instead.
  :::

## pipeToWebWritable() {#pipetowebwritable}

Render and pipe to an existing [Web WritableStream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream) instance.

- **Exported from `vue/server-renderer`**

- **Type**

  ```ts
  function pipeToWebWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: WritableStream
  ): void
  ```

- **Example**

  This is typically used in combination with [`TransformStream`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream):

  ```js
  // TransformStream is available in environments such as CloudFlare workers.
  // in Node.js, TransformStream needs to be explicitly imported from 'stream/web'
  const { readable, writable } = new TransformStream()
  pipeToWebWritable(app, {}, writable)

  return new Response(readable)
  ```

## renderToSimpleStream() {#rendertosimplestream}

Renders input in streaming mode using a simple readable interface.

- **Exported from `vue/server-renderer`**

- **Type**

  ```ts
  function renderToSimpleStream(
    input: App | VNode,
    context: SSRContext,
    options: SimpleReadable
  ): SimpleReadable

  interface SimpleReadable {
    push(content: string | null): void
    destroy(err: any): void
  }
  ```

- **Example**

  ```js
  let res = ''

  renderToSimpleStream(
    app,
    {},
    {
      push(chunk) {
        if (chunk === null) {
          // done
          console(`render complete: ${res}`)
        } else {
          res += chunk
        }
      },
      destroy(err) {
        // error encountered
      }
    }
  )
  ```

## useSSRContext() {#usessrcontext}

A runtime API used to retrieve the context object passed to `renderToString()` or other server render APIs.

- **Type**

  ```ts
  function useSSRContext<T = Record<string, any>>(): T | undefined
  ```

- **Example**

  The retrieved context can be used to attach information that is needed for rendering the final HTML (e.g. head metadata).

  ```vue
  <script setup>
  import { useSSRContext } from 'vue'

  // make sure to only call it during SSR
  // https://vite.dev/guide/ssr.html#conditional-logic
  if (import.meta.env.SSR) {
    const ctx = useSSRContext()
    // ...attach properties to the context
  }
  </script>
  ```

## data-allow-mismatch <sup class="vt-badge" data-text="3.5+" /> {#data-allow-mismatch}

A special attribute that can be used to suppress [hydration mismatch](/guide/scaling-up/ssr#hydration-mismatch) warnings.

- **Example**

  ```html
  <div data-allow-mismatch="text">{{ data.toLocaleString() }}</div>
  ```

  The value can limit the allowed mismatch to a specific type. Allowed values are:

  - `text`
  - `children` (only allows mismatch for direct children)
  - `class`
  - `style`
  - `attribute`

  If no value is provided, all types of mismatches will be allowed.

---

---
url: /api/sfc-css-features.md
---
# SFC CSS Features {#sfc-css-features}

## Scoped CSS {#scoped-css}

When a `<style>` tag has the `scoped` attribute, its CSS will apply to elements of the current component only. This is similar to the style encapsulation found in Shadow DOM. It comes with some caveats, but doesn't require any polyfills. It is achieved by using PostCSS to transform the following:

```vue
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">hi</div>
</template>
```

Into the following:

```vue
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>
```
