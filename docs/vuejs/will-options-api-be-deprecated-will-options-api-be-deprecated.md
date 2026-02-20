### Will Options API be deprecated? {#will-options-api-be-deprecated}

No, we do not have any plan to do so. Options API is an integral part of Vue and the reason many developers love it. We also realize that many of the benefits of Composition API only manifest in larger-scale projects, and Options API remains a solid choice for many low-to-medium-complexity scenarios.

## Relationship with Class API {#relationship-with-class-api}

We no longer recommend using Class API with Vue 3, given that Composition API provides great TypeScript integration with additional logic reuse and code organization benefits.

## Comparison with React Hooks {#comparison-with-react-hooks}

Composition API provides the same level of logic composition capabilities as React Hooks, but with some important differences.

React Hooks are invoked repeatedly every time a component updates. This creates a number of caveats that can confuse even seasoned React developers. It also leads to performance optimization issues that can severely affect development experience. Here are some examples:

- Hooks are call-order sensitive and cannot be conditional.

- Variables declared in a React component can be captured by a hook closure and become "stale" if the developer fails to pass in the correct dependencies array. This leads to React developers relying on ESLint rules to ensure correct dependencies are passed. However, the rule is often not smart enough and over-compensates for correctness, which leads to unnecessary invalidation and headaches when edge cases are encountered.

- Expensive computations require the use of `useMemo`, which again requires manually passing in the correct dependencies array.

- Event handlers passed to child components cause unnecessary child updates by default, and require explicit `useCallback` as an optimization. This is almost always needed, and again requires a correct dependencies array. Neglecting this leads to over-rendering apps by default and can cause performance issues without realizing it.

- The stale closure problem, combined with Concurrent features, makes it difficult to reason about when a piece of hooks code is run, and makes working with mutable state that should persist across renders (via `useRef`) cumbersome.

> Note: some of the above issues that are related to memoization can be resolved by the upcoming [React Compiler](https://react.dev/learn/react-compiler).

In comparison, Vue Composition API:

- Invokes `setup()` or `<script setup>` code only once. This makes the code align better with the intuitions of idiomatic JavaScript usage as there are no stale closures to worry about. Composition API calls are also not sensitive to call order and can be conditional.

- Vue's runtime reactivity system automatically collects reactive dependencies used in computed properties and watchers, so there's no need to manually declare dependencies.

- No need to manually cache callback functions to avoid unnecessary child updates. In general, Vue's fine-grained reactivity system ensures child components only update when they need to. Manual child-update optimizations are rarely a concern for Vue developers.

We acknowledge the creativity of React Hooks, and it is a major source of inspiration for Composition API. However, the issues mentioned above do exist in its design and we noticed Vue's reactivity model happens to provide a way around them.

---

---
url: /api/composition-api-dependency-injection.md
---
# Composition API: <br>Dependency Injection {#composition-api-dependency-injection}

## provide() {#provide}

Provides a value that can be injected by descendant components.

- **Type**

  ```ts
  function provide<T>(key: InjectionKey<T> | string, value: T): void
  ```

- **Details**

  `provide()` takes two arguments: the key, which can be a string or a symbol, and the value to be injected.

  When using TypeScript, the key can be a symbol casted as `InjectionKey` - a Vue provided utility type that extends `Symbol`, which can be used to sync the value type between `provide()` and `inject()`.

  Similar to lifecycle hook registration APIs, `provide()` must be called synchronously during a component's `setup()` phase.

- **Example**

  ```vue
  <script setup>
  import { ref, provide } from 'vue'
  import { countSymbol } from './injectionSymbols'

  // provide static value
  provide('path', '/project/')

  // provide reactive value
  const count = ref(0)
  provide('count', count)

  // provide with Symbol keys
  provide(countSymbol, count)
  </script>
  ```

- **See also**
  - [Guide - Provide / Inject](/guide/components/provide-inject)
  - [Guide - Typing Provide / Inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

## inject() {#inject}

Injects a value provided by an ancestor component or the application (via `app.provide()`).

- **Type**

  ```ts
  // without default value
  function inject<T>(key: InjectionKey<T> | string): T | undefined

  // with default value
  function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T

  // with factory
  function inject<T>(
    key: InjectionKey<T> | string,
    defaultValue: () => T,
    treatDefaultAsFactory: true
  ): T
  ```

- **Details**

  The first argument is the injection key. Vue will walk up the parent chain to locate a provided value with a matching key. If multiple components in the parent chain provide the same key, the one closest to the injecting component will "shadow" those higher up the chain and its value will be used. If no value with matching key was found, `inject()` returns `undefined` unless a default value is provided.

  The second argument is optional and is the default value to be used when no matching value was found.

  The second argument can also be a factory function that returns values that are expensive to create. In this case, `true` must be passed as the third argument to indicate that the function should be used as a factory instead of the value itself.

  Similar to lifecycle hook registration APIs, `inject()` must be called synchronously during a component's `setup()` phase.

  When using TypeScript, the key can be of type of `InjectionKey` - a Vue-provided utility type that extends `Symbol`, which can be used to sync the value type between `provide()` and `inject()`.

- **Example**

  Assuming a parent component has provided values as shown in the previous `provide()` example:

  ```vue
  <script setup>
  import { inject } from 'vue'
  import { countSymbol } from './injectionSymbols'

  // inject static value without default
  const path = inject('path')

  // inject reactive value
  const count = inject('count')

  // inject with Symbol keys
  const count2 = inject(countSymbol)

  // inject with default value
  const bar = inject('path', '/default-path')

  // inject with function default value
  const fn = inject('function', () => {})

  // inject with default value factory
  const baz = inject('factory', () => new ExpensiveObject(), true)
  </script>
  ```
  
- **See also**
  - [Guide - Provide / Inject](/guide/components/provide-inject)
  - [Guide - Typing Provide / Inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

## hasInjectionContext() {#has-injection-context}

- Only supported in 3.3+

Returns true if [inject()](#inject) can be used without warning about being called in the wrong place (e.g. outside of `setup()`). This method is designed to be used by libraries that want to use `inject()` internally without triggering a warning to the end user.

- **Type**

  ```ts
  function hasInjectionContext(): boolean
  ```

---

---
url: /api/composition-api-helpers.md
---
# Composition API: Helpers {#composition-api-helpers}

## useAttrs() {#useattrs}

Returns the `attrs` object from the [Setup Context](/api/composition-api-setup#setup-context), which includes the [fallthrough attributes](/guide/components/attrs#fallthrough-attributes) of the current component. This is intended to be used in `<script setup>` where the setup context object is not available.

- **Type**

  ```ts
  function useAttrs(): Record<string, unknown>
  ```

## useSlots() {#useslots}

Returns the `slots` object from the [Setup Context](/api/composition-api-setup#setup-context), which includes parent passed slots as callable functions that return Virtual DOM nodes. This is intended to be used in `<script setup>` where the setup context object is not available.

If using TypeScript, [`defineSlots()`](/api/sfc-script-setup#defineslots) should be preferred instead.

- **Type**

  ```ts
  function useSlots(): Record<string, (...args: any[]) => VNode[]>
  ```

## useModel() {#usemodel}

This is the underlying helper that powers [`defineModel()`](/api/sfc-script-setup#definemodel). If using `<script setup>`, `defineModel()` should be preferred instead.

- Only available in 3.4+

- **Type**

  ```ts
  function useModel(
    props: Record<string, any>,
    key: string,
    options?: DefineModelOptions
  ): ModelRef

  type DefineModelOptions<T = any> = {
    get?: (v: T) => any
    set?: (v: T) => any
  }

  type ModelRef<T, M extends PropertyKey = string, G = T, S = T> = Ref<G, S> & [
    ModelRef<T, M, G, S>,
    Record<M, true | undefined>
  ]
  ```

- **Example**

  ```js
  export default {
    props: ['count'],
    emits: ['update:count'],
    setup(props) {
      const msg = useModel(props, 'count')
      msg.value = 1
    }
  }
  ```

- **Details**

  `useModel()` can be used in non-SFC components, e.g. when using raw `setup()` function. It expects the `props` object as the first argument, and the model name as the second argument. The optional third argument can be used to declare custom getter and setter for the resulting model ref. Note that unlike `defineModel()`, you are responsible for declaring the props and emits yourself.

## useTemplateRef() <sup class="vt-badge" data-text="3.5+" /> {#usetemplateref}

Returns a shallow ref whose value will be synced with the template element or component with a matching ref attribute.

- **Type**

  ```ts
  function useTemplateRef<T>(key: string): Readonly<ShallowRef<T | null>>
  ```

- **Example**

  ```vue
  <script setup>
  import { useTemplateRef, onMounted } from 'vue'

  const inputRef = useTemplateRef('input')

  onMounted(() => {
    inputRef.value.focus()
  })
  </script>

  <template>
    <input ref="input" />
  </template>
  ```

- **See also**
  - [Guide - Template Refs](/guide/essentials/template-refs)
  - [Guide - Typing Template Refs](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />
  - [Guide - Typing Component Template Refs](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

## useId() <sup class="vt-badge" data-text="3.5+" /> {#useid}

Used to generate unique-per-application IDs for accessibility attributes or form elements.

- **Type**

  ```ts
  function useId(): string
  ```

- **Example**

  ```vue
  <script setup>
  import { useId } from 'vue'

  const id = useId()
  </script>

  <template>
    <form>
      <label :for="id">Name:</label>
      <input :id="id" type="text" />
    </form>
  </template>
  ```

- **Details**

  IDs generated by `useId()` are unique-per-application. It can be used to generate IDs for form elements and accessibility attributes. Multiple calls in the same component will generate different IDs; multiple instances of the same component calling `useId()` will also have different IDs.

  IDs generated by `useId()` are also guaranteed to be stable across the server and client renders, so they can be used in SSR applications without leading to hydration mismatches.

  If you have more than one Vue application instance of the same page, you can avoid ID conflicts by giving each app an ID prefix via [`app.config.idPrefix`](/api/application#app-config-idprefix).

  :::warning Caution
  `useId()` should not be called inside a `computed()` property as it may cause instance conflicts. Instead, declare the ID outside of `computed()` and reference it within the computed function.
  :::

---

---
url: /api/composition-api-lifecycle.md
---
# Composition API: Lifecycle Hooks {#composition-api-lifecycle-hooks}

:::info Usage Note
All APIs listed on this page must be called synchronously during the `setup()` phase of a component. See [Guide - Lifecycle Hooks](/guide/essentials/lifecycle) for more details.
:::

## onMounted() {#onmounted}

Registers a callback to be called after the component has been mounted.

- **Type**

  ```ts
  function onMounted(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **Details**

  A component is considered mounted after:

  - All of its synchronous child components have been mounted (does not include async components or components inside `<Suspense>` trees).

  - Its own DOM tree has been created and inserted into the parent container. Note it only guarantees that the component's DOM tree is in-document if the application's root container is also in-document.

  This hook is typically used for performing side effects that need access to the component's rendered DOM, or for limiting DOM-related code to the client in a [server-rendered application](/guide/scaling-up/ssr).

  **This hook is not called during server-side rendering.**

- **Example**

  Accessing an element via template ref:

  ```vue
  <script setup>
  import { ref, onMounted } from 'vue'

  const el = ref()

  onMounted(() => {
    el.value // <div>
  })
  </script>

  <template>
    <div ref="el"></div>
  </template>
  ```

## onUpdated() {#onupdated}

Registers a callback to be called after the component has updated its DOM tree due to a reactive state change.

- **Type**

  ```ts
  function onUpdated(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **Details**

  A parent component's updated hook is called after that of its child components.

  This hook is called after any DOM update of the component, which can be caused by different state changes, because multiple state changes can be batched into a single render cycle for performance reasons. If you need to access the updated DOM after a specific state change, use [nextTick()](/api/general#nexttick) instead.

  **This hook is not called during server-side rendering.**

  :::warning
  Do not mutate component state in the updated hook - this will likely lead to an infinite update loop!
  :::

- **Example**

  Accessing updated DOM:

  ```vue
  <script setup>
  import { ref, onUpdated } from 'vue'

  const count = ref(0)

  onUpdated(() => {
    // text content should be the same as current `count.value`
    console.log(document.getElementById('count').textContent)
  })
  </script>

  <template>
    <button id="count" @click="count++">{{ count }}</button>
  </template>
  ```

## onUnmounted() {#onunmounted}

Registers a callback to be called after the component has been unmounted.

- **Type**

  ```ts
  function onUnmounted(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **Details**

  A component is considered unmounted after:

  - All of its child components have been unmounted.

  - All of its associated reactive effects (render effect and computed / watchers created during `setup()`) have been stopped.

  Use this hook to clean up manually created side effects such as timers, DOM event listeners or server connections.

  **This hook is not called during server-side rendering.**

- **Example**

  ```vue
  <script setup>
  import { onMounted, onUnmounted } from 'vue'

  let intervalId
  onMounted(() => {
    intervalId = setInterval(() => {
      // ...
    })
  })

  onUnmounted(() => clearInterval(intervalId))
  </script>
  ```

## onBeforeMount() {#onbeforemount}

Registers a hook to be called right before the component is to be mounted.

- **Type**

  ```ts
  function onBeforeMount(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **Details**

  When this hook is called, the component has finished setting up its reactive state, but no DOM nodes have been created yet. It is about to execute its DOM render effect for the first time.

  **This hook is not called during server-side rendering.**

## onBeforeUpdate() {#onbeforeupdate}

Registers a hook to be called right before the component is about to update its DOM tree due to a reactive state change.

- **Type**

  ```ts
  function onBeforeUpdate(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **Details**

  This hook can be used to access the DOM state before Vue updates the DOM. It is also safe to modify component state inside this hook.

  **This hook is not called during server-side rendering.**

## onBeforeUnmount() {#onbeforeunmount}

Registers a hook to be called right before a component instance is to be unmounted.

- **Type**

  ```ts
  function onBeforeUnmount(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **Details**

  When this hook is called, the component instance is still fully functional.

  **This hook is not called during server-side rendering.**

## onErrorCaptured() {#onerrorcaptured}

Registers a hook to be called when an error propagating from a descendant component has been captured.

- **Type**

  ```ts
  function onErrorCaptured(callback: ErrorCapturedHook): void

  type ErrorCapturedHook = (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string
  ) => boolean | void
  ```

- **Details**

  Errors can be captured from the following sources:

  - Component renders
  - Event handlers
  - Lifecycle hooks
  - `setup()` function
  - Watchers
  - Custom directive hooks
  - Transition hooks

  The hook receives three arguments: the error, the component instance that triggered the error, and an information string specifying the error source type.

  :::tip
  In production, the 3rd argument (`info`) will be a shortened code instead of the full information string. You can find the code to string mapping in the [Production Error Code Reference](/error-reference/#runtime-errors).
  :::

  You can modify component state in `onErrorCaptured()` to display an error state to the user. However, it is important that the error state should not render the original content that caused the error; otherwise the component will be thrown into an infinite render loop.

  The hook can return `false` to stop the error from propagating further. See error propagation details below.

  **Error Propagation Rules**

  - By default, all errors are still sent to the application-level [`app.config.errorHandler`](/api/application#app-config-errorhandler) if it is defined, so that these errors can still be reported to an analytics service in a single place.

  - If multiple `errorCaptured` hooks exist on a component's inheritance chain or parent chain, all of them will be invoked on the same error, in the order of bottom to top. This is similar to the bubbling mechanism of native DOM events.

  - If the `errorCaptured` hook itself throws an error, both this error and the original captured error are sent to `app.config.errorHandler`.

  - An `errorCaptured` hook can return `false` to prevent the error from propagating further. This is essentially saying "this error has been handled and should be ignored." It will prevent any additional `errorCaptured` hooks or `app.config.errorHandler` from being invoked for this error.

## onRenderTracked() <sup class="vt-badge dev-only" /> {#onrendertracked}

Registers a debug hook to be called when a reactive dependency has been tracked by the component's render effect.

**This hook is development-mode-only and not called during server-side rendering.**

- **Type**

  ```ts
  function onRenderTracked(callback: DebuggerHook): void

  type DebuggerHook = (e: DebuggerEvent) => void

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes /* 'get' | 'has' | 'iterate' */
    key: any
  }
  ```

- **See also** [Reactivity in Depth](/guide/extras/reactivity-in-depth)

## onRenderTriggered() <sup class="vt-badge dev-only" /> {#onrendertriggered}

Registers a debug hook to be called when a reactive dependency triggers the component's render effect to be re-run.

**This hook is development-mode-only and not called during server-side rendering.**

- **Type**

  ```ts
  function onRenderTriggered(callback: DebuggerHook): void

  type DebuggerHook = (e: DebuggerEvent) => void

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
    key: any
    newValue?: any
    oldValue?: any
    oldTarget?: Map<any, any> | Set<any>
  }
  ```

- **See also** [Reactivity in Depth](/guide/extras/reactivity-in-depth)

## onActivated() {#onactivated}

Registers a callback to be called after the component instance is inserted into the DOM as part of a tree cached by [`<KeepAlive>`](/api/built-in-components#keepalive).

**This hook is not called during server-side rendering.**

- **Type**

  ```ts
  function onActivated(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **See also** [Guide - Lifecycle of Cached Instance](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## onDeactivated() {#ondeactivated}

Registers a callback to be called after the component instance is removed from the DOM as part of a tree cached by [`<KeepAlive>`](/api/built-in-components#keepalive).

**This hook is not called during server-side rendering.**

- **Type**

  ```ts
  function onDeactivated(callback: () => void, target?: ComponentInternalInstance | null): void
  ```

- **See also** [Guide - Lifecycle of Cached Instance](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## onServerPrefetch() <sup class="vt-badge" data-text="SSR only" /> {#onserverprefetch}

Registers an async function to be resolved before the component instance is to be rendered on the server.

- **Type**

  ```ts
  function onServerPrefetch(callback: () => Promise<any>): void
  ```

- **Details**

  If the callback returns a Promise, the server renderer will wait until the Promise is resolved before rendering the component.

  This hook is only called during server-side rendering can be used to perform server-only data fetching.

- **Example**

  ```vue
  <script setup>
  import { ref, onServerPrefetch, onMounted } from 'vue'

  const data = ref(null)

  onServerPrefetch(async () => {
    // component is rendered as part of the initial request
    // pre-fetch data on server as it is faster than on the client
    data.value = await fetchOnServer(/* ... */)
  })

  onMounted(async () => {
    if (!data.value) {
      // if data is null on mount, it means the component
      // is dynamically rendered on the client. Perform a
      // client-side fetch instead.
      data.value = await fetchOnClient(/* ... */)
    }
  })
  </script>
  ```

- **See also** [Server-Side Rendering](/guide/scaling-up/ssr)

---

---
url: /api/composition-api-setup.md
---
# Composition API: setup() {#composition-api-setup}

## Basic Usage {#basic-usage}

The `setup()` hook serves as the entry point for Composition API usage in components in the following cases:

1. Using Composition API without a build step;
2. Integrating with Composition-API-based code in an Options API component.

:::info Note
If you are using Composition API with Single-File Components, [`<script setup>`](/api/sfc-script-setup) is strongly recommended for a more succinct and ergonomic syntax.
:::

We can declare reactive state using [Reactivity APIs](./reactivity-core) and expose them to the template by returning an object from `setup()`. The properties on the returned object will also be made available on the component instance (if other options are used):

```vue
<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    // expose to template and other options API hooks
    return {
      count
    }
  },

  mounted() {
    console.log(this.count) // 0
  }
}
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

[refs](/api/reactivity-core#ref) returned from `setup` are [automatically shallow unwrapped](/guide/essentials/reactivity-fundamentals#deep-reactivity) when accessed in the template so you do not need to use `.value` when accessing them. They are also unwrapped in the same way when accessed on `this`.

`setup()` itself does not have access to the component instance - `this` will have a value of `undefined` inside `setup()`. You can access Composition-API-exposed values from Options API, but not the other way around.

`setup()` should return an object _synchronously_. The only case when `async setup()` can be used is when the component is a descendant of a [Suspense](../guide/built-ins/suspense) component.

## Accessing Props {#accessing-props}

The first argument in the `setup` function is the `props` argument. Just as you would expect in a standard component, `props` inside of a `setup` function are reactive and will be updated when new props are passed in.

```js
export default {
  props: {
    title: String
  },
  setup(props) {
    console.log(props.title)
  }
}
```

Note that if you destructure the `props` object, the destructured variables will lose reactivity. It is therefore recommended to always access props in the form of `props.xxx`.

If you really need to destructure the props, or need to pass a prop into an external function while retaining reactivity, you can do so with the [toRefs()](./reactivity-utilities#torefs) and [toRef()](/api/reactivity-utilities#toref) utility APIs:

```js
import { toRefs, toRef } from 'vue'

export default {
  setup(props) {
    // turn `props` into an object of refs, then destructure
    const { title } = toRefs(props)
    // `title` is a ref that tracks `props.title`
    console.log(title.value)

    // OR, turn a single property on `props` into a ref
    const title = toRef(props, 'title')
  }
}
```

## Setup Context {#setup-context}

The second argument passed to the `setup` function is a **Setup Context** object. The context object exposes other values that may be useful inside `setup`:

```js
export default {
  setup(props, context) {
    // Attributes (Non-reactive object, equivalent to $attrs)
    console.log(context.attrs)

    // Slots (Non-reactive object, equivalent to $slots)
    console.log(context.slots)

    // Emit events (Function, equivalent to $emit)
    console.log(context.emit)

    // Expose public properties (Function)
    console.log(context.expose)
  }
}
```

The context object is not reactive and can be safely destructured:

```js
export default {
  setup(props, { attrs, slots, emit, expose }) {
    ...
  }
}
```

`attrs` and `slots` are stateful objects that are always updated when the component itself is updated. This means you should avoid destructuring them and always reference properties as `attrs.x` or `slots.x`. Also note that, unlike `props`, the properties of `attrs` and `slots` are **not** reactive. If you intend to apply side effects based on changes to `attrs` or `slots`, you should do so inside an `onBeforeUpdate` lifecycle hook.
