### Rollup {#rollup}

Flags should be defined using [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace):

```js [rollup.config.js]
import replace from '@rollup/plugin-replace'

export default {
  plugins: [
    replace({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}
```

---

---
url: /guide/components/events.md
---
<script setup>
import { onMounted } from 'vue'

if (typeof window !== 'undefined') {
  const hash = window.location.hash

  // The docs for v-model used to be part of this page. Attempt to redirect outdated links.
  if ([
    '#usage-with-v-model',
    '#v-model-arguments',
    '#multiple-v-model-bindings',
    '#handling-v-model-modifiers'
  ].includes(hash)) {
    onMounted(() => {
      window.location = './v-model.html' + hash
    })
  }
}
</script>

# Component Events {#component-events}

> This page assumes you've already read the [Components Basics](/guide/essentials/component-basics). Read that first if you are new to components.

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/defining-custom-events-emits" title="Free Vue.js Lesson on Defining Custom Events"/>
</div>

## Emitting and Listening to Events {#emitting-and-listening-to-events}

A component can emit custom events directly in template expressions (e.g. in a `v-on` handler) using the built-in `$emit` method:

```vue-html
<!-- MyComponent -->
<button @click="$emit('someEvent')">Click Me</button>
```

<div class="options-api">

The `$emit()` method is also available on the component instance as `this.$emit()`:

```js
export default {
  methods: {
    submit() {
      this.$emit('someEvent')
    }
  }
}
```

</div>

The parent can then listen to it using `v-on`:

```vue-html
<MyComponent @some-event="callback" />
```

The `.once` modifier is also supported on component event listeners:

```vue-html
<MyComponent @some-event.once="callback" />
```

Like components and props, event names provide an automatic case transformation. Notice we emitted a camelCase event, but can listen for it using a kebab-cased listener in the parent. As with [props casing](/guide/components/props#prop-name-casing), we recommend using kebab-cased event listeners in templates.

:::tip
Unlike native DOM events, component emitted events do **not** bubble. You can only listen to the events emitted by a direct child component. If there is a need to communicate between sibling or deeply nested components, use an external event bus or a [global state management solution](/guide/scaling-up/state-management).
:::

## Event Arguments {#event-arguments}

It's sometimes useful to emit a specific value with an event. For example, we may want the `<BlogPost>` component to be in charge of how much to enlarge the text by. In those cases, we can pass extra arguments to `$emit` to provide this value:

```vue-html
<button @click="$emit('increaseBy', 1)">
  Increase by 1
</button>
```

Then, when we listen to the event in the parent, we can use an inline arrow function as the listener, which allows us to access the event argument:

```vue-html
<MyButton @increase-by="(n) => count += n" />
```

Or, if the event handler is a method:

```vue-html
<MyButton @increase-by="increaseCount" />
```

Then the value will be passed as the first parameter of that method:

<div class="options-api">

```js
methods: {
  increaseCount(n) {
    this.count += n
  }
}
```

</div>
<div class="composition-api">

```js
function increaseCount(n) {
  count.value += n
}
```

</div>

:::tip
All extra arguments passed to `$emit()` after the event name will be forwarded to the listener. For example, with `$emit('foo', 1, 2, 3)` the listener function will receive three arguments.
:::

## Declaring Emitted Events {#declaring-emitted-events}

A component can explicitly declare the events it will emit using the <span class="composition-api">[`defineEmits()`](/api/sfc-script-setup#defineprops-defineemits) macro</span><span class="options-api">[`emits`](/api/options-state#emits) option</span>:

<div class="composition-api">

```vue
<script setup>
defineEmits(['inFocus', 'submit'])
</script>
```

The `$emit` method that we used in the `<template>` isn't accessible within the `<script setup>` section of a component, but `defineEmits()` returns an equivalent function that we can use instead:

```vue
<script setup>
const emit = defineEmits(['inFocus', 'submit'])

function buttonClick() {
  emit('submit')
}
</script>
```

The `defineEmits()` macro **cannot** be used inside a function, it must be placed directly within `<script setup>`, as in the example above.

If you're using an explicit `setup` function instead of `<script setup>`, events should be declared using the [`emits`](/api/options-state#emits) option, and the `emit` function is exposed on the `setup()` context:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, ctx) {
    ctx.emit('submit')
  }
}
```

As with other properties of the `setup()` context, `emit` can safely be destructured:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, { emit }) {
    emit('submit')
  }
}
```

</div>
<div class="options-api">

```js
export default {
  emits: ['inFocus', 'submit']
}
```

</div>

The `emits` option and `defineEmits()` macro also support an object syntax. If using TypeScript you can type arguments, which allows us to perform runtime validation of the payload of the emitted events:

<div class="composition-api">

```vue
<script setup lang="ts">
const emit = defineEmits({
  submit(payload: { email: string, password: string }) {
    // return `true` or `false` to indicate
    // validation pass / fail
  }
})
</script>
```

If you are using TypeScript with `<script setup>`, it's also possible to declare emitted events using pure type annotations:

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

More details: [Typing Component Emits](/guide/typescript/composition-api#typing-component-emits) <sup class="vt-badge ts" />

</div>
<div class="options-api">

```js
export default {
  emits: {
    submit(payload: { email: string, password: string }) {
      // return `true` or `false` to indicate
      // validation pass / fail
    }
  }
}
```

See also: [Typing Component Emits](/guide/typescript/options-api#typing-component-emits) <sup class="vt-badge ts" />

</div>

Although optional, it is recommended to define all emitted events in order to better document how a component should work. It also allows Vue to exclude known listeners from [fallthrough attributes](/guide/components/attrs#v-on-listener-inheritance), avoiding edge cases caused by DOM events manually dispatched by 3rd party code.

:::tip
If a native event (e.g., `click`) is defined in the `emits` option, the listener will now only listen to component-emitted `click` events and no longer respond to native `click` events.
:::

## Events Validation {#events-validation}

Similar to prop type validation, an emitted event can be validated if it is defined with the object syntax instead of the array syntax.

To add validation, the event is assigned a function that receives the arguments passed to the <span class="options-api">`this.$emit`</span><span class="composition-api">`emit`</span> call and returns a boolean to indicate whether the event is valid or not.

<div class="composition-api">

```vue
<script setup>
const emit = defineEmits({
  // No validation
  click: null,

  // Validate submit event
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Invalid submit event payload!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```

</div>
<div class="options-api">

```js
export default {
  emits: {
    // No validation
    click: null,

    // Validate submit event
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Invalid submit event payload!')
        return false
      }
    }
  },
  methods: {
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    }
  }
}
```

</div>

---

---
url: /api/component-instance.md
---
# Component Instance {#component-instance}

:::info
This page documents the built-in properties and methods exposed on the component public instance, i.e. `this`.

All properties listed on this page are readonly (except nested properties in `$data`).
:::

## $data {#data}

The object returned from the [`data`](./options-state#data) option, made reactive by the component. The component instance proxies access to the properties on its data object.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $data: object
  }
  ```

## $props {#props}

An object representing the component's current, resolved props.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $props: object
  }
  ```

- **Details**

  Only props declared via the [`props`](./options-state#props) option will be included. The component instance proxies access to the properties on its props object.

## $el {#el}

The root DOM node that the component instance is managing.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $el: any
  }
  ```

- **Details**

  `$el` will be `undefined` until the component is [mounted](./options-lifecycle#mounted).

  - For components with a single root element, `$el` will point to that element.
  - For components with text root, `$el` will point to the text node.
  - For components with multiple root nodes, `$el` will be the placeholder DOM node that Vue uses to keep track of the component's position in the DOM (a text node, or a comment node in SSR hydration mode).

  :::tip
  For consistency, it is recommended to use [template refs](/guide/essentials/template-refs) for direct access to elements instead of relying on `$el`.
  :::

## $options {#options}

The resolved component options used for instantiating the current component instance.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $options: ComponentOptions
  }
  ```

- **Details**

  The `$options` object exposes the resolved options for the current component and is the merge result of these possible sources:

  - Global mixins
  - Component `extends` base
  - Component mixins

  It is typically used to support custom component options:

  ```js
  const app = createApp({
    customOption: 'foo',
    created() {
      console.log(this.$options.customOption) // => 'foo'
    }
  })
  ```

- **See also** [`app.config.optionMergeStrategies`](/api/application#app-config-optionmergestrategies)

## $parent {#parent}

The parent instance, if the current instance has one. It will be `null` for the root instance itself.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $parent: ComponentPublicInstance | null
  }
  ```

## $root {#root}

The root component instance of the current component tree. If the current instance has no parents this value will be itself.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $root: ComponentPublicInstance
  }
  ```

## $slots {#slots}

An object representing the [slots](/guide/components/slots) passed by the parent component.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $slots: { [name: string]: Slot }
  }

  type Slot = (...args: any[]) => VNode[]
  ```

- **Details**

  Typically used when manually authoring [render functions](/guide/extras/render-function), but can also be used to detect whether a slot is present.

  Each slot is exposed on `this.$slots` as a function that returns an array of vnodes under the key corresponding to that slot's name. The default slot is exposed as `this.$slots.default`.

  If a slot is a [scoped slot](/guide/components/slots#scoped-slots), arguments passed to the slot functions are available to the slot as its slot props.

- **See also** [Render Functions - Rendering Slots](/guide/extras/render-function#rendering-slots)

## $refs {#refs}

An object of DOM elements and component instances, registered via [template refs](/guide/essentials/template-refs).

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $refs: { [name: string]: Element | ComponentPublicInstance | null }
  }
  ```

- **See also**

  - [Template refs](/guide/essentials/template-refs)
  - [Special Attributes - ref](./built-in-special-attributes.md#ref)

## $attrs {#attrs}

An object that contains the component's fallthrough attributes.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $attrs: object
  }
  ```

- **Details**

  [Fallthrough Attributes](/guide/components/attrs) are attributes and event handlers passed by the parent component, but not declared as a prop or an emitted event by the child.

  By default, everything in `$attrs` will be automatically inherited on the component's root element if there is only a single root element. This behavior is disabled if the component has multiple root nodes, and can be explicitly disabled with the [`inheritAttrs`](./options-misc#inheritattrs) option.

- **See also**

  - [Fallthrough Attributes](/guide/components/attrs)

## $watch() {#watch}

Imperative API for creating watchers.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $watch(
      source: string | (() => any),
      callback: WatchCallback,
      options?: WatchOptions
    ): StopHandle
  }

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  interface WatchOptions {
    immediate?: boolean // default: false
    deep?: boolean // default: false
    flush?: 'pre' | 'post' | 'sync' // default: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  type StopHandle = () => void
  ```

- **Details**

  The first argument is the watch source. It can be a component property name string, a simple dot-delimited path string, or a [getter function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description).

  The second argument is the callback function. The callback receives the new value and the old value of the watched source.

  - **`immediate`**: trigger the callback immediately on watcher creation. Old value will be `undefined` on the first call.
  - **`deep`**: force deep traversal of the source if it is an object, so that the callback fires on deep mutations. See [Deep Watchers](/guide/essentials/watchers#deep-watchers).
  - **`flush`**: adjust the callback's flush timing. See [Callback Flush Timing](/guide/essentials/watchers#callback-flush-timing) and [`watchEffect()`](/api/reactivity-core#watcheffect).
  - **`onTrack / onTrigger`**: debug the watcher's dependencies. See [Watcher Debugging](/guide/extras/reactivity-in-depth#watcher-debugging).

- **Example**

  Watch a property name:

  ```js
  this.$watch('a', (newVal, oldVal) => {})
  ```

  Watch a dot-delimited path:

  ```js
  this.$watch('a.b', (newVal, oldVal) => {})
  ```

  Using getter for more complex expressions:

  ```js
  this.$watch(
    // every time the expression `this.a + this.b` yields
    // a different result, the handler will be called.
    // It's as if we were watching a computed property
    // without defining the computed property itself.
    () => this.a + this.b,
    (newVal, oldVal) => {}
  )
  ```

  Stopping the watcher:

  ```js
  const unwatch = this.$watch('a', cb)

  // later...
  unwatch()
  ```

- **See also**
  - [Options - `watch`](/api/options-state#watch)
  - [Guide - Watchers](/guide/essentials/watchers)

## $emit() {#emit}

Trigger a custom event on the current instance. Any additional arguments will be passed into the listener's callback function.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $emit(event: string, ...args: any[]): void
  }
  ```

- **Example**

  ```js
  export default {
    created() {
      // only event
      this.$emit('foo')
      // with additional arguments
      this.$emit('bar', 1, 2, 3)
    }
  }
  ```

- **See also**

  - [Component - Events](/guide/components/events)
  - [`emits` option](./options-state#emits)

## $forceUpdate() {#forceupdate}

Force the component instance to re-render.

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $forceUpdate(): void
  }
  ```

- **Details**

  This should be rarely needed given Vue's fully automatic reactivity system. The only cases where you may need it is when you have explicitly created non-reactive component state using advanced reactivity APIs.

## $nextTick() {#nexttick}

Instance-bound version of the global [`nextTick()`](./general#nexttick).

- **Type**

  ```ts
  interface ComponentPublicInstance {
    $nextTick(callback?: (this: ComponentPublicInstance) => void): Promise<void>
  }
  ```

- **Details**

  The only difference from the global version of `nextTick()` is that the callback passed to `this.$nextTick()` will have its `this` context bound to the current component instance.

- **See also** [`nextTick()`](./general#nexttick)

---

---
url: /guide/components/registration.md
---
# Component Registration {#component-registration}

> This page assumes you've already read the [Components Basics](/guide/essentials/component-basics). Read that first if you are new to components.

<VueSchoolLink href="https://vueschool.io/lessons/vue-3-global-vs-local-vue-components" title="Free Vue.js Component Registration Lesson"/>

A Vue component needs to be "registered" so that Vue knows where to locate its implementation when it is encountered in a template. There are two ways to register components: global and local.

## Global Registration {#global-registration}

We can make components available globally in the current [Vue application](/guide/essentials/application) using the `.component()` method:

```js
import { createApp } from 'vue'

const app = createApp({})

app.component(
  // the registered name
  'MyComponent',
  // the implementation
  {
    /* ... */
  }
)
```

If using SFCs, you will be registering the imported `.vue` files:

```js
import MyComponent from './App.vue'

app.component('MyComponent', MyComponent)
```

The `.component()` method can be chained:

```js
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```

Globally registered components can be used in the template of any component within this application:

```vue-html
<!-- this will work in any component inside the app -->
<ComponentA/>
<ComponentB/>
<ComponentC/>
```

This even applies to all subcomponents, meaning all three of these components will also be available _inside each other_.

## Local Registration {#local-registration}

While convenient, global registration has a few drawbacks:

1. Global registration prevents build systems from removing unused components (a.k.a "tree-shaking"). If you globally register a component but end up not using it anywhere in your app, it will still be included in the final bundle.

2. Global registration makes dependency relationships less explicit in large applications. It makes it difficult to locate a child component's implementation from a parent component using it. This can affect long-term maintainability similar to using too many global variables.

Local registration scopes the availability of the registered components to the current component only. It makes the dependency relationship more explicit, and is more tree-shaking friendly.

<div class="composition-api">

When using SFC with `<script setup>`, imported components can be locally used without registration:

```vue
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>
```

In non-`<script setup>`, you will need to use the `components` option:

```js
import ComponentA from './ComponentA.js'

export default {
  components: {
    ComponentA
  },
  setup() {
    // ...
  }
}
```

</div>
<div class="options-api">

Local registration is done using the `components` option:

```vue
<script>
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  }
}
</script>

<template>
  <ComponentA />
</template>
```

</div>

For each property in the `components` object, the key will be the registered name of the component, while the value will contain the implementation of the component. The above example is using the ES2015 property shorthand and is equivalent to:

```js
export default {
  components: {
    ComponentA: ComponentA
  }
  // ...
}
```

Note that **locally registered components are _not_ also available in descendant components**. In this case, `ComponentA` will be made available to the current component only, not any of its child or descendant components.

## Component Name Casing {#component-name-casing}

Throughout the guide, we are using PascalCase names when registering components. This is because:

1. PascalCase names are valid JavaScript identifiers. This makes it easier to import and register components in JavaScript. It also helps IDEs with auto-completion.

2. `<PascalCase />` makes it more obvious that this is a Vue component instead of a native HTML element in templates. It also differentiates Vue components from custom elements (web components).

This is the recommended style when working with SFC or string templates. However, as discussed in [in-DOM Template Parsing Caveats](/guide/essentials/component-basics#in-dom-template-parsing-caveats), PascalCase tags are not usable in in-DOM templates.

Luckily, Vue supports resolving kebab-case tags to components registered using PascalCase. This means a component registered as `MyComponent` can be referenced inside a Vue template (or inside an HTML element rendered by Vue) via both `<MyComponent>` and `<my-component>`. This allows us to use the same JavaScript component registration code regardless of template source.

---

---
url: /guide/components/v-model.md
---
# Component v-model {#component-v-model}

<ScrimbaLink href="https://scrimba.com/links/vue-component-v-model" title="Free Vue.js Component v-model Lesson" type="scrimba">
  Watch an interactive video lesson on Scrimba
</ScrimbaLink>

## Basic Usage {#basic-usage}

`v-model` can be used on a component to implement a two-way binding.

<div class="composition-api">

Starting in Vue 3.4, the recommended approach to achieve this is using the [`defineModel()`](/api/sfc-script-setup#definemodel) macro:

```vue [Child.vue]
<script setup>
const model = defineModel()

function update() {
  model.value++
}
</script>

<template>
  <div>Parent bound v-model is: {{ model }}</div>
  <button @click="update">Increment</button>
</template>
```

The parent can then bind a value with `v-model`:

```vue-html [Parent.vue]
<Child v-model="countModel" />
```

The value returned by `defineModel()` is a ref. It can be accessed and mutated like any other ref, except that it acts as a two-way binding between a parent value and a local one:

- Its `.value` is synced with the value bound by the parent `v-model`;
- When it is mutated by the child, it causes the parent bound value to be updated as well.

This means you can also bind this ref to a native input element with `v-model`, making it straightforward to wrap native input elements while providing the same `v-model` usage:

```vue
<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model" />
</template>
```

[Try it in the playground](https://play.vuejs.org/#eNqFUtFKwzAU/ZWYl06YLbK30Q10DFSYigq+5KW0t11mmoQknZPSf/cm3eqEsT0l555zuefmpKV3WsfbBuiUpjY3XDtiwTV6ziSvtTKOLNZcFKQ0qiZRnATkG6JB0BIDJen2kp5iMlfSOlLbisw8P4oeQAhFPpURxVV0zWSa9PNwEgIHtRaZA0SEpOvbeduG5q5LE0Sh2jvZ3tSqADFjFHlGSYJkmhz10zF1FseXvIo3VklcrfX9jOaq1lyAedGOoz1GpyQwnsvQ3fdTqDnTwPhQz9eQf52ob+zO1xh9NWDBbIHRgXOZqcD19PL9GXZ4H0h03whUnyHfwCrReI+97L6RBdo+0gW3j+H9uaw+7HLnQNrDUt6oV3ZBzyhmsjiz+p/dSTwJfUx2+IpD1ic+xz5enwQGXEDJJaw8Gl2I1upMzlc/hEvdOBR6SNKAjqP1J6P/o6XdL11L5h4=)
