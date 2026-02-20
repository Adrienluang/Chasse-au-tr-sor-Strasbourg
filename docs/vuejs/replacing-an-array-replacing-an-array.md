### Replacing an Array {#replacing-an-array}

Mutation methods, as the name suggests, mutate the original array they are called on. In comparison, there are also non-mutating methods, e.g. `filter()`, `concat()` and `slice()`, which do not mutate the original array but **always return a new array**. When working with non-mutating methods, we should replace the old array with the new one:

<div class="composition-api">

```js
// `items` is a ref with array value
items.value = items.value.filter((item) => item.message.match(/Foo/))
```

</div>
<div class="options-api">

```js
this.items = this.items.filter((item) => item.message.match(/Foo/))
```

</div>

You might think this will cause Vue to throw away the existing DOM and re-render the entire list - luckily, that is not the case. Vue implements some smart heuristics to maximize DOM element reuse, so replacing an array with another array containing overlapping objects is a very efficient operation.

## Displaying Filtered/Sorted Results {#displaying-filtered-sorted-results}

Sometimes we want to display a filtered or sorted version of an array without actually mutating or resetting the original data. In this case, you can create a computed property that returns the filtered or sorted array.

For example:

<div class="composition-api">

```js
const numbers = ref([1, 2, 3, 4, 5])

const evenNumbers = computed(() => {
  return numbers.value.filter((n) => n % 2 === 0)
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    numbers: [1, 2, 3, 4, 5]
  }
},
computed: {
  evenNumbers() {
    return this.numbers.filter(n => n % 2 === 0)
  }
}
```

</div>

```vue-html
<li v-for="n in evenNumbers">{{ n }}</li>
```

In situations where computed properties are not feasible (e.g. inside nested `v-for` loops), you can use a method:

<div class="composition-api">

```js
const sets = ref([
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10]
])

function even(numbers) {
  return numbers.filter((number) => number % 2 === 0)
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
  }
},
methods: {
  even(numbers) {
    return numbers.filter(number => number % 2 === 0)
  }
}
```

</div>

```vue-html
<ul v-for="numbers in sets">
  <li v-for="n in even(numbers)">{{ n }}</li>
</ul>
```

Be careful with `reverse()` and `sort()` in a computed property! These two methods will mutate the original array, which should be avoided in computed getters. Create a copy of the original array before calling these methods:

```diff
- return numbers.reverse()
+ return [...numbers].reverse()
```

---

---
url: /api/options-composition.md
---
# Options: Composition {#options-composition}

## provide {#provide}

Provide values that can be injected by descendant components.

- **Type**

  ```ts
  interface ComponentOptions {
    provide?: object | ((this: ComponentPublicInstance) => object)
  }
  ```

- **Details**

  `provide` and [`inject`](#inject) are used together to allow an ancestor component to serve as a dependency injector for all its descendants, regardless of how deep the component hierarchy is, as long as they are in the same parent chain.

  The `provide` option should be either an object or a function that returns an object. This object contains the properties that are available for injection into its descendants. You can use Symbols as keys in this object.

- **Example**

  Basic usage:

  ```js
  const s = Symbol()

  export default {
    provide: {
      foo: 'foo',
      [s]: 'bar'
    }
  }
  ```

  Using a function to provide per-component state:

  ```js
  export default {
    data() {
      return {
        msg: 'foo'
      }
    }
    provide() {
      return {
        msg: this.msg
      }
    }
  }
  ```

  Note in the above example, the provided `msg` will NOT be reactive. See [Working with Reactivity](/guide/components/provide-inject#working-with-reactivity) for more details.

- **See also** [Provide / Inject](/guide/components/provide-inject)

## inject {#inject}

Declare properties to inject into the current component by locating them from ancestor providers.

- **Type**

  ```ts
  interface ComponentOptions {
    inject?: ArrayInjectOptions | ObjectInjectOptions
  }

  type ArrayInjectOptions = string[]

  type ObjectInjectOptions = {
    [key: string | symbol]:
      | string
      | symbol
      | { from?: string | symbol; default?: any }
  }
  ```

- **Details**

  The `inject` option should be either:

  - An array of strings, or
  - An object where the keys are the local binding name and the value is either:
    - The key (string or Symbol) to search for in available injections, or
    - An object where:
      - The `from` property is the key (string or Symbol) to search for in available injections, and
      - The `default` property is used as fallback value. Similar to props default values, a factory function is needed for object types to avoid value sharing between multiple component instances.

  An injected property will be `undefined` if neither a matching property nor a default value was provided.

  Note that injected bindings are NOT reactive. This is intentional. However, if the injected value is a reactive object, properties on that object do remain reactive. See [Working with Reactivity](/guide/components/provide-inject#working-with-reactivity) for more details.

- **Example**

  Basic usage:

  ```js
  export default {
    inject: ['foo'],
    created() {
      console.log(this.foo)
    }
  }
  ```

  Using an injected value as the default for a prop:

  ```js
  const Child = {
    inject: ['foo'],
    props: {
      bar: {
        default() {
          return this.foo
        }
      }
    }
  }
  ```

  Using an injected value as data entry:

  ```js
  const Child = {
    inject: ['foo'],
    data() {
      return {
        bar: this.foo
      }
    }
  }
  ```

  Injections can be optional with default value:

  ```js
  const Child = {
    inject: {
      foo: { default: 'foo' }
    }
  }
  ```

  If it needs to be injected from a property with a different name, use `from` to denote the source property:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: 'foo'
      }
    }
  }
  ```

  Similar to prop defaults, you need to use a factory function for non-primitive values:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: () => [1, 2, 3]
      }
    }
  }
  ```

- **See also** [Provide / Inject](/guide/components/provide-inject)

## mixins {#mixins}

An array of option objects to be mixed into the current component.

- **Type**

  ```ts
  interface ComponentOptions {
    mixins?: ComponentOptions[]
  }
  ```

- **Details**

  The `mixins` option accepts an array of mixin objects. These mixin objects can contain instance options like normal instance objects, and they will be merged against the eventual options using the certain option merging logic. For example, if your mixin contains a `created` hook and the component itself also has one, both functions will be called.

  Mixin hooks are called in the order they are provided, and called before the component's own hooks.

  :::warning No Longer Recommended
  In Vue 2, mixins were the primary mechanism for creating reusable chunks of component logic. While mixins continue to be supported in Vue 3, [Composable functions using Composition API](/guide/reusability/composables) is now the preferred approach for code reuse between components.
  :::

- **Example**

  ```js
  const mixin = {
    created() {
      console.log(1)
    }
  }

  createApp({
    created() {
      console.log(2)
    },
    mixins: [mixin]
  })

  // => 1
  // => 2
  ```

## extends {#extends}

A "base class" component to extend from.

- **Type**

  ```ts
  interface ComponentOptions {
    extends?: ComponentOptions
  }
  ```

- **Details**

  Allows one component to extend another, inheriting its component options.

  From an implementation perspective, `extends` is almost identical to `mixins`. The component specified by `extends` will be treated as though it were the first mixin.

  However, `extends` and `mixins` express different intents. The `mixins` option is primarily used to compose chunks of functionality, whereas `extends` is primarily concerned with inheritance.

  As with `mixins`, any options (except for `setup()`) will be merged using the relevant merge strategy.

- **Example**

  ```js
  const CompA = { ... }

  const CompB = {
    extends: CompA,
    ...
  }
  ```

  :::warning Not Recommended for Composition API
  `extends` is designed for Options API and does not handle the merging of the `setup()` hook.

  In Composition API, the preferred mental model for logic reuse is "compose" over "inheritance". If you have logic from a component that needs to be reused in another one, consider extracting the relevant logic into a [Composable](/guide/reusability/composables#composables).

  If you still intend to "extend" a component using Composition API, you can call the base component's `setup()` in the extending component's `setup()`:

  ```js
  import Base from './Base.js'
  export default {
    extends: Base,
    setup(props, ctx) {
      return {
        ...Base.setup(props, ctx),
        // local bindings
      }
    }
  }
  ```
  :::

---

---
url: /api/options-lifecycle.md
---
# Options: Lifecycle {#options-lifecycle}

:::info See also
For shared usage of lifecycle hooks, see [Guide - Lifecycle Hooks](/guide/essentials/lifecycle)
:::

## beforeCreate {#beforecreate}

Called when the instance is initialized.

- **Type**

  ```ts
  interface ComponentOptions {
    beforeCreate?(this: ComponentPublicInstance): void
  }
  ```

- **Details**

  Called immediately when the instance is initialized and props are resolved.

  Then the props will be defined as reactive properties and the state such as `data()` or `computed` will be set up.

  Note that the `setup()` hook of Composition API is called before any Options API hooks, even `beforeCreate()`.

## created {#created}

Called after the instance has finished processing all state-related options.

- **Type**

  ```ts
  interface ComponentOptions {
    created?(this: ComponentPublicInstance): void
  }
  ```

- **Details**

  When this hook is called, the following have been set up: reactive data, computed properties, methods, and watchers. However, the mounting phase has not been started, and the `$el` property will not be available yet.

## beforeMount {#beforemount}

Called right before the component is to be mounted.

- **Type**

  ```ts
  interface ComponentOptions {
    beforeMount?(this: ComponentPublicInstance): void
  }
  ```

- **Details**

  When this hook is called, the component has finished setting up its reactive state, but no DOM nodes have been created yet. It is about to execute its DOM render effect for the first time.

  **This hook is not called during server-side rendering.**

## mounted {#mounted}

Called after the component has been mounted.

- **Type**

  ```ts
  interface ComponentOptions {
    mounted?(this: ComponentPublicInstance): void
  }
  ```

- **Details**

  A component is considered mounted after:

  - All of its synchronous child components have been mounted (does not include async components or components inside `<Suspense>` trees).

  - Its own DOM tree has been created and inserted into the parent container. Note it only guarantees that the component's DOM tree is in-document if the application's root container is also in-document.

  This hook is typically used for performing side effects that need access to the component's rendered DOM, or for limiting DOM-related code to the client in a [server-rendered application](/guide/scaling-up/ssr).

  **This hook is not called during server-side rendering.**

## beforeUpdate {#beforeupdate}

Called right before the component is about to update its DOM tree due to a reactive state change.

- **Type**

  ```ts
  interface ComponentOptions {
    beforeUpdate?(this: ComponentPublicInstance): void
  }
  ```

- **Details**

  This hook can be used to access the DOM state before Vue updates the DOM. It is also safe to modify component state inside this hook.

  **This hook is not called during server-side rendering.**

## updated {#updated}

Called after the component has updated its DOM tree due to a reactive state change.

- **Type**

  ```ts
  interface ComponentOptions {
    updated?(this: ComponentPublicInstance): void
  }
  ```

- **Details**

  A parent component's updated hook is called after that of its child components.

  This hook is called after any DOM update of the component, which can be caused by different state changes. If you need to access the updated DOM after a specific state change, use [nextTick()](/api/general#nexttick) instead.

  **This hook is not called during server-side rendering.**

  :::warning
  Do not mutate component state in the updated hook - this will likely lead to an infinite update loop!
  :::

## beforeUnmount {#beforeunmount}

Called right before a component instance is to be unmounted.

- **Type**

  ```ts
  interface ComponentOptions {
    beforeUnmount?(this: ComponentPublicInstance): void
  }
  ```

- **Details**

  When this hook is called, the component instance is still fully functional.

  **This hook is not called during server-side rendering.**

## unmounted {#unmounted}

Called after the component has been unmounted.

- **Type**

  ```ts
  interface ComponentOptions {
    unmounted?(this: ComponentPublicInstance): void
  }
  ```

- **Details**

  A component is considered unmounted after:

  - All of its child components have been unmounted.

  - All of its associated reactive effects (render effect and computed / watchers created during `setup()`) have been stopped.

  Use this hook to clean up manually created side effects such as timers, DOM event listeners or server connections.

  **This hook is not called during server-side rendering.**

## errorCaptured {#errorcaptured}

Called when an error propagating from a descendant component has been captured.

- **Type**

  ```ts
  interface ComponentOptions {
    errorCaptured?(
      this: ComponentPublicInstance,
      err: unknown,
      instance: ComponentPublicInstance | null,
      info: string
    ): boolean | void
  }
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

  You can modify component state in `errorCaptured()` to display an error state to the user. However, it is important that the error state should not render the original content that caused the error; otherwise the component will be thrown into an infinite render loop.

  The hook can return `false` to stop the error from propagating further. See error propagation details below.

  **Error Propagation Rules**

  - By default, all errors are still sent to the application-level [`app.config.errorHandler`](/api/application#app-config-errorhandler) if it is defined, so that these errors can still be reported to an analytics service in a single place.

  - If multiple `errorCaptured` hooks exist on a component's inheritance chain or parent chain, all of them will be invoked on the same error, in the order of bottom to top. This is similar to the bubbling mechanism of native DOM events.

  - If the `errorCaptured` hook itself throws an error, both this error and the original captured error are sent to `app.config.errorHandler`.

  - An `errorCaptured` hook can return `false` to prevent the error from propagating further. This is essentially saying "this error has been handled and should be ignored." It will prevent any additional `errorCaptured` hooks or `app.config.errorHandler` from being invoked for this error.

  **Error Capturing Caveats**
  
  - In components with async `setup()` function (with top-level `await`) Vue **will always** try to render component template, even if `setup()` throwed error. This will likely cause more errors because during render component's template might try to access non-existing properties of failed `setup()` context. When capturing errors in such components, be ready to handle errors from both failed async `setup()` (they will always come first) and failed render process.

  - <sup class="vt-badge" data-text="SSR only"></sup> Replacing errored child component in parent component deep inside `<Suspense>` will cause hydration mismatches in SSR. Instead, try to separate logic that can possibly throw from child `setup()` into separate function and execute it in the parent component's `setup()`, where you can safely `try/catch` the execution process and make replacement if needed before rendering the actual child component.

## renderTracked <sup class="vt-badge dev-only" /> {#rendertracked}

Called when a reactive dependency has been tracked by the component's render effect.

**This hook is development-mode-only and not called during server-side rendering.**

- **Type**

  ```ts
  interface ComponentOptions {
    renderTracked?(this: ComponentPublicInstance, e: DebuggerEvent): void
  }

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes /* 'get' | 'has' | 'iterate' */
    key: any
  }
  ```

- **See also** [Reactivity in Depth](/guide/extras/reactivity-in-depth)

## renderTriggered <sup class="vt-badge dev-only" /> {#rendertriggered}

Called when a reactive dependency triggers the component's render effect to be re-run.

**This hook is development-mode-only and not called during server-side rendering.**

- **Type**

  ```ts
  interface ComponentOptions {
    renderTriggered?(this: ComponentPublicInstance, e: DebuggerEvent): void
  }

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

## activated {#activated}

Called after the component instance is inserted into the DOM as part of a tree cached by [`<KeepAlive>`](/api/built-in-components#keepalive).

**This hook is not called during server-side rendering.**

- **Type**

  ```ts
  interface ComponentOptions {
    activated?(this: ComponentPublicInstance): void
  }
  ```

- **See also** [Guide - Lifecycle of Cached Instance](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## deactivated {#deactivated}

Called after the component instance is removed from the DOM as part of a tree cached by [`<KeepAlive>`](/api/built-in-components#keepalive).

**This hook is not called during server-side rendering.**

- **Type**

  ```ts
  interface ComponentOptions {
    deactivated?(this: ComponentPublicInstance): void
  }
  ```

- **See also** [Guide - Lifecycle of Cached Instance](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## serverPrefetch <sup class="vt-badge" data-text="SSR only" /> {#serverprefetch}

Async function to be resolved before the component instance is to be rendered on the server.

- **Type**

  ```ts
  interface ComponentOptions {
    serverPrefetch?(this: ComponentPublicInstance): Promise<any>
  }
  ```

- **Details**

  If the hook returns a Promise, the server renderer will wait until the Promise is resolved before rendering the component.

  This hook is only called during server-side rendering can be used to perform server-only data fetching.

- **Example**

  ```js
  export default {
    data() {
      return {
        data: null
      }
    },
    async serverPrefetch() {
      // component is rendered as part of the initial request
      // pre-fetch data on server as it is faster than on the client
      this.data = await fetchOnServer(/* ... */)
    },
    async mounted() {
      if (!this.data) {
        // if data is null on mount, it means the component
        // is dynamically rendered on the client. Perform a
        // client-side fetch instead.
        this.data = await fetchOnClient(/* ... */)
      }
    }
  }
  ```

- **See also** [Server-Side Rendering](/guide/scaling-up/ssr)

---

---
url: /api/options-misc.md
---
# Options: Misc {#options-misc}

## name {#name}

Explicitly declare a display name for the component.

- **Type**

  ```ts
  interface ComponentOptions {
    name?: string
  }
  ```

- **Details**

  The name of a component is used for the following:

  - Recursive self-reference in the component's own template
  - Display in Vue DevTools' component inspection tree
  - Display in warning component traces

  When you use Single-File Components, the component already infers its own name from the filename. For example, a file named `MyComponent.vue` will have the inferred display name "MyComponent".

  Another case is that when a component is registered globally with [`app.component`](/api/application#app-component), the global ID is automatically set as its name.

  The `name` option allows you to override the inferred name, or to explicitly provide a name when no name can be inferred (e.g. when not using build tools, or an inlined non-SFC component).

  There is one case where `name` is explicitly necessary: when matching against cacheable components in [`<KeepAlive>`](/guide/built-ins/keep-alive) via its `include / exclude` props.

  :::tip
  Since version 3.2.34, a single-file component using `<script setup>` will automatically infer its `name` option based on the filename, removing the need to manually declare the name even when used with `<KeepAlive>`.
  :::

## inheritAttrs {#inheritattrs}

Controls whether the default component attribute fallthrough behavior should be enabled.

- **Type**

  ```ts
  interface ComponentOptions {
    inheritAttrs?: boolean // default: true
  }
  ```

- **Details**

  By default, parent scope attribute bindings that are not recognized as props will "fallthrough". This means that when we have a single-root component, these bindings will be applied to the root element of the child component as normal HTML attributes. When authoring a component that wraps a target element or another component, this may not always be the desired behavior. By setting `inheritAttrs` to `false`, this default behavior can be disabled. The attributes are available via the `$attrs` instance property and can be explicitly bound to a non-root element using `v-bind`.

- **Example**

  <div class="options-api">

  ```vue
  <script>
  export default {
    inheritAttrs: false,
    props: ['label', 'value'],
    emits: ['input']
  }
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>
  <div class="composition-api">

  When declaring this option in a component that uses `<script setup>`, you can use the [`defineOptions`](/api/sfc-script-setup#defineoptions) macro:

  ```vue
  <script setup>
  defineProps(['label', 'value'])
  defineEmits(['input'])
  defineOptions({
    inheritAttrs: false
  })
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>

- **See also**

  - [Fallthrough Attributes](/guide/components/attrs)
  <div class="composition-api">

  - [Using `inheritAttrs` in normal `<script>`](/api/sfc-script-setup.html#usage-alongside-normal-script)
  </div>

## components {#components}

An object that registers components to be made available to the component instance.

- **Type**

  ```ts
  interface ComponentOptions {
    components?: { [key: string]: Component }
  }
  ```

- **Example**

  ```js
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: {
      // shorthand
      Foo,
      // register under a different name
      RenamedBar: Bar
    }
  }
  ```

- **See also** [Component Registration](/guide/components/registration)

## directives {#directives}

An object that registers directives to be made available to the component instance.

- **Type**

  ```ts
  interface ComponentOptions {
    directives?: { [key: string]: Directive }
  }
  ```

- **Example**

  ```js
  export default {
    directives: {
      // enables v-focus in template
      focus: {
        mounted(el) {
          el.focus()
        }
      }
    }
  }
  ```

  ```vue-html
  <input v-focus>
  ```

- **See also** [Custom Directives](/guide/reusability/custom-directives)

---

---
url: /api/options-rendering.md
---
# Options: Rendering {#options-rendering}

## template {#template}

A string template for the component.

- **Type**

  ```ts
  interface ComponentOptions {
    template?: string
  }
  ```

- **Details**

  A template provided via the `template` option will be compiled on-the-fly at runtime. It is only supported when using a build of Vue that includes the template compiler. The template compiler is **NOT** included in Vue builds that have the word `runtime` in their names, e.g. `vue.runtime.esm-bundler.js`. Consult the [dist file guide](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use) for more details about the different builds.

  If the string starts with `#` it will be used as a `querySelector` and use the selected element's `innerHTML` as the template string. This allows the source template to be authored using native `<template>` elements.

  If the `render` option is also present in the same component, `template` will be ignored.

  If the root component of your application doesn't have a `template` or `render` option specified, Vue will try to use the `innerHTML` of the mounted element as the template instead.

  :::warning Security Note
  Only use template sources that you can trust. Do not use user-provided content as your template. See [Security Guide](/guide/best-practices/security#rule-no-1-never-use-non-trusted-templates) for more details.
  :::

## render {#render}

A function that programmatically returns the virtual DOM tree of the component.

- **Type**

  ```ts
  interface ComponentOptions {
    render?(this: ComponentPublicInstance) => VNodeChild
  }

  type VNodeChild = VNodeChildAtom | VNodeArrayChildren

  type VNodeChildAtom =
    | VNode
    | string
    | number
    | boolean
    | null
    | undefined
    | void

  type VNodeArrayChildren = (VNodeArrayChildren | VNodeChildAtom)[]
  ```

- **Details**

  `render` is an alternative to string templates that allows you to leverage the full programmatic power of JavaScript to declare the render output of the component.

  Pre-compiled templates, for example those in Single-File Components, are compiled into the `render` option at build time. If both `render` and `template` are present in a component, `render` will take higher priority.

- **See also**
  - [Rendering Mechanism](/guide/extras/rendering-mechanism)
  - [Render Functions](/guide/extras/render-function)

## compilerOptions {#compileroptions}

Configure runtime compiler options for the component's template.

- **Type**

  ```ts
  interface ComponentOptions {
    compilerOptions?: {
      isCustomElement?: (tag: string) => boolean
      whitespace?: 'condense' | 'preserve' // default: 'condense'
      delimiters?: [string, string] // default: ['{{', '}}']
      comments?: boolean // default: false
    }
  }
  ```

- **Details**

  This config option is only respected when using the full build (i.e. the standalone `vue.js` that can compile templates in the browser). It supports the same options as the app-level [app.config.compilerOptions](/api/application#app-config-compileroptions), and has higher priority for the current component.

- **See also** [app.config.compilerOptions](/api/application#app-config-compileroptions)

## slots<sup class="vt-badge ts"/> {#slots}

- Only supported in 3.3+

An option to assist with type inference when using slots programmatically in render functions.

- **Details**

  This option's runtime value is not used. The actual types should be declared via type casting using the `SlotsType` type helper:

  ```ts
  import { SlotsType } from 'vue'

  defineComponent({
    slots: Object as SlotsType<{
      default: { foo: string; bar: number }
      item: { data: number }
    }>,
    setup(props, { slots }) {
      expectType<
        undefined | ((scope: { foo: string; bar: number }) => any)
      >(slots.default)
      expectType<undefined | ((scope: { data: number }) => any)>(
        slots.item
      )
    }
  })
  ```

---

---
url: /api/options-state.md
---
# Options: State {#options-state}

## data {#data}

A function that returns the initial reactive state for the component instance.

- **Type**

  ```ts
  interface ComponentOptions {
    data?(
      this: ComponentPublicInstance,
      vm: ComponentPublicInstance
    ): object
  }
  ```

- **Details**

  The function is expected to return a plain JavaScript object, which will be made reactive by Vue. After the instance is created, the reactive data object can be accessed as `this.$data`. The component instance also proxies all the properties found on the data object, so `this.a` will be equivalent to `this.$data.a`.

  All top-level data properties must be included in the returned data object. Adding new properties to `this.$data` is possible, but it is **not** recommended. If the desired value of a property is not yet available then an empty value such as `undefined` or `null` should be included as a placeholder to ensure that Vue knows that the property exists.

  Properties that start with `_` or `$` will **not** be proxied on the component instance because they may conflict with Vue's internal properties and API methods. You will have to access them as `this.$data._property`.

  It is **not** recommended to return objects with their own stateful behavior like browser API objects and prototype properties. The returned object should ideally be a plain object that only represents the state of the component.

- **Example**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    created() {
      console.log(this.a) // 1
      console.log(this.$data) // { a: 1 }
    }
  }
  ```

  Note that if you use an arrow function with the `data` property, `this` won't be the component's instance, but you can still access the instance as the function's first argument:

  ```js
  data: (vm) => ({ a: vm.myProp })
  ```

- **See also** [Reactivity in Depth](/guide/extras/reactivity-in-depth)

## props {#props}

Declare the props of a component.

- **Type**

  ```ts
  interface ComponentOptions {
    props?: ArrayPropsOptions | ObjectPropsOptions
  }

  type ArrayPropsOptions = string[]

  type ObjectPropsOptions = { [key: string]: Prop }

  type Prop<T = any> = PropOptions<T> | PropType<T> | null

  interface PropOptions<T> {
    type?: PropType<T>
    required?: boolean
    default?: T | ((rawProps: object) => T)
    validator?: (value: unknown, rawProps: object) => boolean
  }

  type PropType<T> = { new (): T } | { new (): T }[]
  ```

  > Types are simplified for readability.

- **Details**

  In Vue, all component props need to be explicitly declared. Component props can be declared in two forms:

  - Simple form using an array of strings
  - Full form using an object where each property key is the name of the prop, and the value is the prop's type (a constructor function) or advanced options.

  With object-based syntax, each prop can further define the following options:

  - **`type`**: Can be one of the following native constructors: `String`, `Number`, `Boolean`, `Array`, `Object`, `Date`, `Function`, `Symbol`, any custom constructor function or an array of those. In development mode, Vue will check if a prop's value matches the declared type, and will throw a warning if it doesn't. See [Prop Validation](/guide/components/props#prop-validation) for more details.

    Also note that a prop with `Boolean` type affects its value casting behavior in both development and production. See [Boolean Casting](/guide/components/props#boolean-casting) for more details.

  - **`default`**: Specifies a default value for the prop when it is not passed by the parent or has `undefined` value. Object or array defaults must be returned using a factory function. The factory function also receives the raw props object as the argument.

  - **`required`**: Defines if the prop is required. In a non-production environment, a console warning will be thrown if this value is truthy and the prop is not passed.

  - **`validator`**: Custom validator function that takes the prop value and props object as arguments. In development mode, a console warning will be thrown if this function returns a falsy value (i.e. the validation fails).

- **Example**

  Simple declaration:

  ```js
  export default {
    props: ['size', 'myMessage']
  }
  ```

  Object declaration with validations:

  ```js
  export default {
    props: {
      // type check
      height: Number,
      // type check plus other validations
      age: {
        type: Number,
        default: 0,
        required: true,
        validator: (value) => {
          return value >= 0
        }
      }
    }
  }
  ```

- **See also**
  - [Guide - Props](/guide/components/props)
  - [Guide - Typing Component Props](/guide/typescript/options-api#typing-component-props) <sup class="vt-badge ts" />

## computed {#computed}

Declare computed properties to be exposed on the component instance.

- **Type**

  ```ts
  interface ComponentOptions {
    computed?: {
      [key: string]: ComputedGetter<any> | WritableComputedOptions<any>
    }
  }

  type ComputedGetter<T> = (
    this: ComponentPublicInstance,
    vm: ComponentPublicInstance
  ) => T

  type ComputedSetter<T> = (
    this: ComponentPublicInstance,
    value: T
  ) => void

  type WritableComputedOptions<T> = {
    get: ComputedGetter<T>
    set: ComputedSetter<T>
  }
  ```

- **Details**

  The option accepts an object where the key is the name of the computed property, and the value is either a computed getter, or an object with `get` and `set` methods (for writable computed properties).

  All getters and setters have their `this` context automatically bound to the component instance.

  Note that if you use an arrow function with a computed property, `this` won't point to the component's instance, but you can still access the instance as the function's first argument:

  ```js
  export default {
    computed: {
      aDouble: (vm) => vm.a * 2
    }
  }
  ```

- **Example**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    computed: {
      // readonly
      aDouble() {
        return this.a * 2
      },
      // writable
      aPlus: {
        get() {
          return this.a + 1
        },
        set(v) {
          this.a = v - 1
        }
      }
    },
    created() {
      console.log(this.aDouble) // => 2
      console.log(this.aPlus) // => 2

      this.aPlus = 3
      console.log(this.a) // => 2
      console.log(this.aDouble) // => 4
    }
  }
  ```

- **See also**
  - [Guide - Computed Properties](/guide/essentials/computed)
  - [Guide - Typing Computed Properties](/guide/typescript/options-api#typing-computed-properties) <sup class="vt-badge ts" />

## methods {#methods}

Declare methods to be mixed into the component instance.

- **Type**

  ```ts
  interface ComponentOptions {
    methods?: {
      [key: string]: (this: ComponentPublicInstance, ...args: any[]) => any
    }
  }
  ```

- **Details**

  Declared methods can be directly accessed on the component instance, or used in template expressions. All methods have their `this` context automatically bound to the component instance, even when passed around.

  Avoid using arrow functions when declaring methods, as they will not have access to the component instance via `this`.

- **Example**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    methods: {
      plus() {
        this.a++
      }
    },
    created() {
      this.plus()
      console.log(this.a) // => 2
    }
  }
  ```

- **See also** [Event Handling](/guide/essentials/event-handling)

## watch {#watch}

Declare watch callbacks to be invoked on data change.

- **Type**

  ```ts
  interface ComponentOptions {
    watch?: {
      [key: string]: WatchOptionItem | WatchOptionItem[]
    }
  }

  type WatchOptionItem = string | WatchCallback | ObjectWatchOptionItem

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type ObjectWatchOptionItem = {
    handler: WatchCallback | string
    immediate?: boolean // default: false
    deep?: boolean // default: false
    flush?: 'pre' | 'post' | 'sync' // default: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }
  ```

  > Types are simplified for readability.

- **Details**

  The `watch` option expects an object where keys are the reactive component instance properties to watch (e.g. properties declared via `data` or `computed`) — and values are the corresponding callbacks. The callback receives the new value and the old value of the watched source.

  In addition to a root-level property, the key can also be a simple dot-delimited path, e.g. `a.b.c`. Note that this usage does **not** support complex expressions - only dot-delimited paths are supported. If you need to watch complex data sources, use the imperative [`$watch()`](/api/component-instance#watch) API instead.

  The value can also be a string of a method name (declared via `methods`), or an object that contains additional options. When using the object syntax, the callback should be declared under the `handler` field. Additional options include:

  - **`immediate`**: trigger the callback immediately on watcher creation. Old value will be `undefined` on the first call.
  - **`deep`**: force deep traversal of the source if it is an object or an array, so that the callback fires on deep mutations. See [Deep Watchers](/guide/essentials/watchers#deep-watchers).
  - **`flush`**: adjust the callback's flush timing. See [Callback Flush Timing](/guide/essentials/watchers#callback-flush-timing) and [`watchEffect()`](/api/reactivity-core#watcheffect).
  - **`onTrack / onTrigger`**: debug the watcher's dependencies. See [Watcher Debugging](/guide/extras/reactivity-in-depth#watcher-debugging).

  Avoid using arrow functions when declaring watch callbacks as they will not have access to the component instance via `this`.

- **Example**

  ```js
  export default {
    data() {
      return {
        a: 1,
        b: 2,
        c: {
          d: 4
        },
        e: 5,
        f: 6
      }
    },
    watch: {
      // watching top-level property
      a(val, oldVal) {
        console.log(`new: ${val}, old: ${oldVal}`)
      },
      // string method name
      b: 'someMethod',
      // the callback will be called whenever any of the watched object properties change regardless of their nested depth
      c: {
        handler(val, oldVal) {
          console.log('c changed')
        },
        deep: true
      },
      // watching a single nested property:
      'c.d': function (val, oldVal) {
        // do something
      },
      // the callback will be called immediately after the start of the observation
      e: {
        handler(val, oldVal) {
          console.log('e changed')
        },
        immediate: true
      },
      // you can pass array of callbacks, they will be called one-by-one
      f: [
        'handle1',
        function handle2(val, oldVal) {
          console.log('handle2 triggered')
        },
        {
          handler: function handle3(val, oldVal) {
            console.log('handle3 triggered')
          }
          /* ... */
        }
      ]
    },
    methods: {
      someMethod() {
        console.log('b changed')
      },
      handle1() {
        console.log('handle 1 triggered')
      }
    },
    created() {
      this.a = 3 // => new: 3, old: 1
    }
  }
  ```

- **See also** [Watchers](/guide/essentials/watchers)

## emits {#emits}

Declare the custom events emitted by the component.

- **Type**

  ```ts
  interface ComponentOptions {
    emits?: ArrayEmitsOptions | ObjectEmitsOptions
  }

  type ArrayEmitsOptions = string[]

  type ObjectEmitsOptions = { [key: string]: EmitValidator | null }

  type EmitValidator = (...args: unknown[]) => boolean
  ```

- **Details**

  Emitted events can be declared in two forms:

  - Simple form using an array of strings
  - Full form using an object where each property key is the name of the event, and the value is either `null` or a validator function.

  The validation function will receive the additional arguments passed to the component's `$emit` call. For example, if `this.$emit('foo', 1)` is called, the corresponding validator for `foo` will receive the argument `1`. The validator function should return a boolean to indicate whether the event arguments are valid.

  Note that the `emits` option affects which event listeners are considered component event listeners, rather than native DOM event listeners. The listeners for declared events will be removed from the component's `$attrs` object, so they will not be passed through to the component's root element. See [Fallthrough Attributes](/guide/components/attrs) for more details.

- **Example**

  Array syntax:

  ```js
  export default {
    emits: ['check'],
    created() {
      this.$emit('check')
    }
  }
  ```

  Object syntax:

  ```js
  export default {
    emits: {
      // no validation
      click: null,

      // with validation
      submit: (payload) => {
        if (payload.email && payload.password) {
          return true
        } else {
          console.warn(`Invalid submit event payload!`)
          return false
        }
      }
    }
  }
  ```

- **See also**
  - [Guide - Fallthrough Attributes](/guide/components/attrs)
  - [Guide - Typing Component Emits](/guide/typescript/options-api#typing-component-emits) <sup class="vt-badge ts" />

## expose {#expose}

Declare exposed public properties when the component instance is accessed by a parent via template refs.

- **Type**

  ```ts
  interface ComponentOptions {
    expose?: string[]
  }
  ```

- **Details**

  By default, a component instance exposes all instance properties to the parent when accessed via `$parent`, `$root`, or template refs. This can be undesirable, since a component most likely has internal state or methods that should be kept private to avoid tight coupling.

  The `expose` option expects a list of property name strings. When `expose` is used, only the properties explicitly listed will be exposed on the component's public instance.

  `expose` only affects user-defined properties - it does not filter out built-in component instance properties.

- **Example**

  ```js
  export default {
    // only `publicMethod` will be available on the public instance
    expose: ['publicMethod'],
    methods: {
      publicMethod() {
        // ...
      },
      privateMethod() {
        // ...
      }
    }
  }
  ```

---

---
url: /guide/best-practices/performance.md
---

# Performance {#performance}

## Overview {#overview}

Vue is designed to be performant for most common use cases without much need for manual optimizations. However, there are always challenging scenarios where extra fine-tuning is needed. In this section, we will discuss what you should pay attention to when it comes to performance in a Vue application.

First, let's discuss the two major aspects of web performance:

- **Page Load Performance**: how fast the application shows content and becomes interactive on the initial visit. This is usually measured using web vital metrics like [Largest Contentful Paint (LCP)](https://web.dev/lcp/) and [Interaction to Next Paint](https://web.dev/articles/inp).

- **Update Performance**: how fast the application updates in response to user input. For example, how fast a list updates when the user types in a search box, or how fast the page switches when the user clicks a navigation link in a Single-Page Application (SPA).

While it would be ideal to maximize both, different frontend architectures tend to affect how easy it is to attain desired performance in these aspects. In addition, the type of application you are building greatly influences what you should prioritize in terms of performance. Therefore, the first step of ensuring optimal performance is picking the right architecture for the type of application you are building:

- Consult [Ways of Using Vue](/guide/extras/ways-of-using-vue) to see how you can leverage Vue in different ways.

- Jason Miller discusses the types of web applications and their respective ideal implementation / delivery in [Application Holotypes](https://jasonformat.com/application-holotypes/).

## Profiling Options {#profiling-options}

To improve performance, we need to first know how to measure it. There are a number of great tools that can help in this regard:

For profiling load performance of production deployments:

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

For profiling performance during local development:

- [Chrome DevTools Performance Panel](https://developer.chrome.com/docs/devtools/evaluate-performance/)
  - [`app.config.performance`](/api/application#app-config-performance) enables Vue-specific performance markers in Chrome DevTools' performance timeline.
- [Vue DevTools Extension](/guide/scaling-up/tooling#browser-devtools) also provides a performance profiling feature.

## Page Load Optimizations {#page-load-optimizations}

There are many framework-agnostic aspects for optimizing page load performance - check out [this web.dev guide](https://web.dev/fast/) for a comprehensive round up. Here, we will primarily focus on techniques that are specific to Vue.
