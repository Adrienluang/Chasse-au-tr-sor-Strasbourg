### Custom Strategy {#custom-strategy}

```ts
import { defineAsyncComponent, type HydrationStrategy } from 'vue'

const myStrategy: HydrationStrategy = (hydrate, forEachElement) => {
  // forEachElement is a helper to iterate through all the root elements
  // in the component's non-hydrated DOM, since the root can be a fragment
  // instead of a single element
  forEachElement(el => {
    // ...
  })
  // call `hydrate` when ready
  hydrate()
  return () => {
    // return a teardown function if needed
  }
}

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: myStrategy
})
```

## Using with Suspense {#using-with-suspense}

Async components can be used with the `<Suspense>` built-in component. The interaction between `<Suspense>` and async components is documented in the [dedicated chapter for `<Suspense>`](/guide/built-ins/suspense).

---

---
url: /api/built-in-components.md
---

# Built-in Components {#built-in-components}

:::info Registration and Usage
Built-in components can be used directly in templates without needing to be registered. They are also tree-shakeable: they are only included in the build when they are used.

When using them in [render functions](/guide/extras/render-function), they need to be imported explicitly. For example:

```js
import { h, Transition } from 'vue'

h(Transition, {
  /* props */
})
```

:::

## `<Transition>` {#transition}

Provides animated transition effects to a **single** element or component.

- **Props**

  ```ts
  interface TransitionProps {
    /**
     * Used to automatically generate transition CSS class names.
     * e.g. `name: 'fade'` will auto expand to `.fade-enter`,
     * `.fade-enter-active`, etc.
     */
    name?: string
    /**
     * Whether to apply CSS transition classes.
     * Default: true
     */
    css?: boolean
    /**
     * Specifies the type of transition events to wait for to
     * determine transition end timing.
     * Default behavior is auto detecting the type that has
     * longer duration.
     */
    type?: 'transition' | 'animation'
    /**
     * Specifies explicit durations of the transition.
     * Default behavior is wait for the first `transitionend`
     * or `animationend` event on the root transition element.
     */
    duration?: number | { enter: number; leave: number }
    /**
     * Controls the timing sequence of leaving/entering transitions.
     * Default behavior is simultaneous.
     */
    mode?: 'in-out' | 'out-in' | 'default'
    /**
     * Whether to apply transition on initial render.
     * Default: false
     */
    appear?: boolean

    /**
     * Props for customizing transition classes.
     * Use kebab-case in templates, e.g. enter-from-class="xxx"
     */
    enterFromClass?: string
    enterActiveClass?: string
    enterToClass?: string
    appearFromClass?: string
    appearActiveClass?: string
    appearToClass?: string
    leaveFromClass?: string
    leaveActiveClass?: string
    leaveToClass?: string
  }
  ```

- **Events**

  - `@before-enter`
  - `@before-leave`
  - `@enter`
  - `@leave`
  - `@appear`
  - `@after-enter`
  - `@after-leave`
  - `@after-appear`
  - `@enter-cancelled`
  - `@leave-cancelled` (`v-show` only)
  - `@appear-cancelled`

- **Example**

  Simple element:

  ```vue-html
  <Transition>
    <div v-if="ok">toggled content</div>
  </Transition>
  ```

  Forcing a transition by changing the `key` attribute:

  ```vue-html
  <Transition>
    <div :key="text">{{ text }}</div>
  </Transition>
  ```

  Dynamic component, with transition mode + animate on appear:

  ```vue-html
  <Transition name="fade" mode="out-in" appear>
    <component :is="view"></component>
  </Transition>
  ```

  Listening to transition events:

  ```vue-html
  <Transition @after-enter="onTransitionComplete">
    <div v-show="ok">toggled content</div>
  </Transition>
  ```

- **See also** [Guide - Transition](/guide/built-ins/transition)

## `<TransitionGroup>` {#transitiongroup}

Provides transition effects for **multiple** elements or components in a list.

- **Props**

  `<TransitionGroup>` accepts the same props as `<Transition>` except `mode`, plus two additional props:

  ```ts
  interface TransitionGroupProps extends Omit<TransitionProps, 'mode'> {
    /**
     * If not defined, renders as a fragment.
     */
    tag?: string
    /**
     * For customizing the CSS class applied during move transitions.
     * Use kebab-case in templates, e.g. move-class="xxx"
     */
    moveClass?: string
  }
  ```

- **Events**

  `<TransitionGroup>` emits the same events as `<Transition>`.

- **Details**

  By default, `<TransitionGroup>` doesn't render a wrapper DOM element, but one can be defined via the `tag` prop.

  Note that every child in a `<transition-group>` must be [**uniquely keyed**](/guide/essentials/list#maintaining-state-with-key) for the animations to work properly.

  `<TransitionGroup>` supports moving transitions via CSS transform. When a child's position on screen has changed after an update, it will get applied a moving CSS class (auto generated from the `name` attribute or configured with the `move-class` prop). If the CSS `transform` property is "transition-able" when the moving class is applied, the element will be smoothly animated to its destination using the [FLIP technique](https://aerotwist.com/blog/flip-your-animations/).

- **Example**

  ```vue-html
  <TransitionGroup tag="ul" name="slide">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </TransitionGroup>
  ```

- **See also** [Guide - TransitionGroup](/guide/built-ins/transition-group)

## `<KeepAlive>` {#keepalive}

Caches dynamically toggled components wrapped inside.

- **Props**

  ```ts
  interface KeepAliveProps {
    /**
     * If specified, only components with names matched by
     * `include` will be cached.
     */
    include?: MatchPattern
    /**
     * Any component with a name matched by `exclude` will
     * not be cached.
     */
    exclude?: MatchPattern
    /**
     * The maximum number of component instances to cache.
     */
    max?: number | string
  }

  type MatchPattern = string | RegExp | (string | RegExp)[]
  ```

- **Details**

  When wrapped around a dynamic component, `<KeepAlive>` caches the inactive component instances without destroying them.

  There can only be one active component instance as the direct child of `<KeepAlive>` at any time.

  When a component is toggled inside `<KeepAlive>`, its `activated` and `deactivated` lifecycle hooks will be invoked accordingly, providing an alternative to `mounted` and `unmounted`, which are not called. This applies to the direct child of `<KeepAlive>` as well as to all of its descendants.

- **Example**

  Basic usage:

  ```vue-html
  <KeepAlive>
    <component :is="view"></component>
  </KeepAlive>
  ```

  When used with `v-if` / `v-else` branches, there must be only one component rendered at a time:

  ```vue-html
  <KeepAlive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </KeepAlive>
  ```

  Used together with `<Transition>`:

  ```vue-html
  <Transition>
    <KeepAlive>
      <component :is="view"></component>
    </KeepAlive>
  </Transition>
  ```

  Using `include` / `exclude`:

  ```vue-html
  <!-- comma-delimited string -->
  <KeepAlive include="a,b">
    <component :is="view"></component>
  </KeepAlive>

  <!-- regex (use `v-bind`) -->
  <KeepAlive :include="/a|b/">
    <component :is="view"></component>
  </KeepAlive>

  <!-- Array (use `v-bind`) -->
  <KeepAlive :include="['a', 'b']">
    <component :is="view"></component>
  </KeepAlive>
  ```

  Usage with `max`:

  ```vue-html
  <KeepAlive :max="10">
    <component :is="view"></component>
  </KeepAlive>
  ```

- **See also** [Guide - KeepAlive](/guide/built-ins/keep-alive)

## `<Teleport>` {#teleport}

Renders its slot content to another part of the DOM.

- **Props**

  ```ts
  interface TeleportProps {
    /**
     * Required. Specify target container.
     * Can either be a selector or an actual element.
     */
    to: string | HTMLElement
    /**
     * When `true`, the content will remain in its original
     * location instead of moved into the target container.
     * Can be changed dynamically.
     */
    disabled?: boolean
    /**
     * When `true`, the Teleport will defer until other
     * parts of the application have been mounted before
     * resolving its target. (3.5+)
     */
    defer?: boolean
  }
  ```

- **Example**

  Specifying target container:

  ```vue-html
  <Teleport to="#some-id" />
  <Teleport to=".some-class" />
  <Teleport to="[data-teleport]" />
  ```

  Conditionally disabling:

  ```vue-html
  <Teleport to="#popup" :disabled="displayVideoInline">
    <video src="./my-movie.mp4">
  </Teleport>
  ```

  Defer target resolution <sup class="vt-badge" data-text="3.5+" />:

  ```vue-html
  <Teleport defer to="#late-div">...</Teleport>

  <!-- somewhere later in the template -->
  <div id="late-div"></div>
  ```

- **See also** [Guide - Teleport](/guide/built-ins/teleport)

## `<Suspense>` <sup class="vt-badge experimental" /> {#suspense}

Used for orchestrating nested async dependencies in a component tree.

- **Props**

  ```ts
  interface SuspenseProps {
    timeout?: string | number
    suspensible?: boolean
  }
  ```

- **Events**

  - `@resolve`
  - `@pending`
  - `@fallback`

- **Details**

  `<Suspense>` accepts two slots: the `#default` slot and the `#fallback` slot. It will display the content of the fallback slot while rendering the default slot in memory.

  If it encounters async dependencies ([Async Components](/guide/components/async) and components with [`async setup()`](/guide/built-ins/suspense#async-setup)) while rendering the default slot, it will wait until all of them are resolved before displaying the default slot.

  By setting the Suspense as `suspensible`, all the async dependency handling will be handled by the parent Suspense. See [implementation details](https://github.com/vuejs/core/pull/6736)

- **See also** [Guide - Suspense](/guide/built-ins/suspense)

---

---
url: /api/built-in-directives.md
---
# Built-in Directives {#built-in-directives}

## v-text {#v-text}

Update the element's text content.

- **Expects:** `string`

- **Details**

  `v-text` works by setting the element's [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) property, so it will overwrite any existing content inside the element. If you need to update only part of the `textContent`, you should use [mustache interpolations](/guide/essentials/template-syntax#text-interpolation) instead (ie. <span v-pre>`<span>Keep this but update a {{dynamicPortion}}</span>`</span>).

- **Example**

  ```vue-html
  <span v-text="msg"></span>
  <!-- same as -->
  <span>{{msg}}</span>
  ```

- **See also** [Template Syntax - Text Interpolation](/guide/essentials/template-syntax#text-interpolation)

## v-html {#v-html}

Update the element's [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML).

- **Expects:** `string`

- **Details**

  Contents of `v-html` are inserted as plain HTML - Vue template syntax will not be processed. If you find yourself trying to compose templates using `v-html`, try to rethink the solution by using components instead.

  ::: warning Security Note
  Dynamically rendering arbitrary HTML on your website can be very dangerous because it can easily lead to [XSS attacks](https://en.wikipedia.org/wiki/Cross-site_scripting). Only use `v-html` on trusted content and **never** on user-provided content.
  :::

  In [Single-File Components](/guide/scaling-up/sfc), `scoped` styles will not apply to content inside `v-html`, because that HTML is not processed by Vue's template compiler. If you want to target `v-html` content with scoped CSS, you can instead use [CSS modules](./sfc-css-features#css-modules) or an additional, global `<style>` element with a manual scoping strategy such as BEM.

- **Example**

  ```vue-html
  <div v-html="html"></div>
  ```

- **See also** [Template Syntax - Raw HTML](/guide/essentials/template-syntax#raw-html)

## v-show {#v-show}

Toggle the element's visibility based on the truthy-ness of the expression value.

- **Expects:** `any`

- **Details**

  `v-show` works by setting the `display` CSS property via inline styles, and will try to respect the initial `display` value when the element is visible. It also triggers transitions when its condition changes.

- **See also** [Conditional Rendering - v-show](/guide/essentials/conditional#v-show)

## v-if {#v-if}

Conditionally render an element or a template fragment based on the truthy-ness of the expression value.

- **Expects:** `any`

- **Details**

  When a `v-if` element is toggled, the element and its contained directives / components are destroyed and re-constructed. If the initial condition is falsy, then the inner content won't be rendered at all.

  Can be used on `<template>` to denote a conditional block containing only text or multiple elements.

  This directive triggers transitions when its condition changes.

  When used together, `v-if` has a higher priority than `v-for`. We don't recommend using these two directives together on one element — see the [list rendering guide](/guide/essentials/list#v-for-with-v-if) for details.

- **See also** [Conditional Rendering - v-if](/guide/essentials/conditional#v-if)

## v-else {#v-else}

Denote the "else block" for `v-if` or a `v-if` / `v-else-if` chain.

- **Does not expect expression**

- **Details**

  - Restriction: previous sibling element must have `v-if` or `v-else-if`.

  - Can be used on `<template>` to denote a conditional block containing only text or multiple elements.

- **Example**

  ```vue-html
  <div v-if="Math.random() > 0.5">
    Now you see me
  </div>
  <div v-else>
    Now you don't
  </div>
  ```

- **See also** [Conditional Rendering - v-else](/guide/essentials/conditional#v-else)

## v-else-if {#v-else-if}

Denote the "else if block" for `v-if`. Can be chained.

- **Expects:** `any`

- **Details**

  - Restriction: previous sibling element must have `v-if` or `v-else-if`.

  - Can be used on `<template>` to denote a conditional block containing only text or multiple elements.

- **Example**

  ```vue-html
  <div v-if="type === 'A'">
    A
  </div>
  <div v-else-if="type === 'B'">
    B
  </div>
  <div v-else-if="type === 'C'">
    C
  </div>
  <div v-else>
    Not A/B/C
  </div>
  ```

- **See also** [Conditional Rendering - v-else-if](/guide/essentials/conditional#v-else-if)

## v-for {#v-for}

Render the element or template block multiple times based on the source data.

- **Expects:** `Array | Object | number | string | Iterable`

- **Details**

  The directive's value must use the special syntax `alias in expression` to provide an alias for the current element being iterated on:

  ```vue-html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```

  Alternatively, you can also specify an alias for the index (or the key if used on an Object):

  ```vue-html
  <div v-for="(item, index) in items"></div>
  <div v-for="(value, key) in object"></div>
  <div v-for="(value, name, index) in object"></div>
  ```

  The default behavior of `v-for` will try to patch the elements in-place without moving them. To force it to reorder elements, you should provide an ordering hint with the `key` special attribute:

  ```vue-html
  <div v-for="item in items" :key="item.id">
    {{ item.text }}
  </div>
  ```

  `v-for` can also work on values that implement the [Iterable Protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol), including native `Map` and `Set`.

- **See also**
  - [List Rendering](/guide/essentials/list)

## v-on {#v-on}

Attach an event listener to the element.

- **Shorthand:** `@`

- **Expects:** `Function | Inline Statement | Object (without argument)`

- **Argument:** `event` (optional if using Object syntax)

- **Modifiers**

  - `.stop` - call `event.stopPropagation()`.
  - `.prevent` - call `event.preventDefault()`.
  - `.capture` - add event listener in capture mode.
  - `.self` - only trigger handler if event was dispatched from this element.
  - `.{keyAlias}` - only trigger handler on certain keys.
  - `.once` - trigger handler at most once.
  - `.left` - only trigger handler for left button mouse events.
  - `.right` - only trigger handler for right button mouse events.
  - `.middle` - only trigger handler for middle button mouse events.
  - `.passive` - attaches a DOM event with `{ passive: true }`.

- **Details**

  The event type is denoted by the argument. The expression can be a method name, an inline statement, or omitted if there are modifiers present.

  When used on a normal element, it listens to [**native DOM events**](https://developer.mozilla.org/en-US/docs/Web/Events) only. When used on a custom element component, it listens to **custom events** emitted on that child component.

  When listening to native DOM events, the method receives the native event as the only argument. If using inline statement, the statement has access to the special `$event` property: `v-on:click="handle('ok', $event)"`.

  `v-on` also supports binding to an object of event / listener pairs without an argument. Note when using the object syntax, it does not support any modifiers.

- **Example**

  ```vue-html
  <!-- method handler -->
  <button v-on:click="doThis"></button>

  <!-- dynamic event -->
  <button v-on:[event]="doThis"></button>

  <!-- inline statement -->
  <button v-on:click="doThat('hello', $event)"></button>

  <!-- shorthand -->
  <button @click="doThis"></button>

  <!-- shorthand dynamic event -->
  <button @[event]="doThis"></button>

  <!-- stop propagation -->
  <button @click.stop="doThis"></button>

  <!-- prevent default -->
  <button @click.prevent="doThis"></button>

  <!-- prevent default without expression -->
  <form @submit.prevent></form>

  <!-- chain modifiers -->
  <button @click.stop.prevent="doThis"></button>

  <!-- key modifier using keyAlias -->
  <input @keyup.enter="onEnter" />

  <!-- the click event will be triggered at most once -->
  <button v-on:click.once="doThis"></button>

  <!-- object syntax -->
  <button v-on="{ mousedown: doThis, mouseup: doThat }"></button>
  ```

  Listening to custom events on a child component (the handler is called when "my-event" is emitted on the child):

  ```vue-html
  <MyComponent @my-event="handleThis" />

  <!-- inline statement -->
  <MyComponent @my-event="handleThis(123, $event)" />
  ```

- **See also**
  - [Event Handling](/guide/essentials/event-handling)
  - [Components - Custom Events](/guide/essentials/component-basics#listening-to-events)

## v-bind {#v-bind}

Dynamically bind one or more attributes, or a component prop to an expression.

- **Shorthand:**
  - `:` or `.` (when using `.prop` modifier)
  - Omitting value (when attribute and bound value has the same name, requires 3.4+)

- **Expects:** `any (with argument) | Object (without argument)`

- **Argument:** `attrOrProp (optional)`

- **Modifiers**

  - `.camel` - transform the kebab-case attribute name into camelCase.
  - `.prop` - force a binding to be set as a DOM property (3.2+).
  - `.attr` - force a binding to be set as a DOM attribute (3.2+).

- **Usage**

  When used to bind the `class` or `style` attribute, `v-bind` supports additional value types such as Array or Objects. See linked guide section below for more details.

  When setting a binding on an element, Vue by default checks whether the element has the key defined as a property using an `in` operator check. If the property is defined, Vue will set the value as a DOM property instead of an attribute. This should work in most cases, but you can override this behavior by explicitly using `.prop` or `.attr` modifiers. This is sometimes necessary, especially when [working with custom elements](/guide/extras/web-components#passing-dom-properties).

  When used for component prop binding, the prop must be properly declared in the child component.

  When used without an argument, can be used to bind an object containing attribute name-value pairs.

- **Example**

  ```vue-html
  <!-- bind an attribute -->
  <img v-bind:src="imageSrc" />

  <!-- dynamic attribute name -->
  <button v-bind:[key]="value"></button>

  <!-- shorthand -->
  <img :src="imageSrc" />

  <!-- same-name shorthand (3.4+), expands to :src="src" -->
  <img :src />

  <!-- shorthand dynamic attribute name -->
  <button :[key]="value"></button>

  <!-- with inline string concatenation -->
  <img :src="'/path/to/images/' + fileName" />

  <!-- class binding -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]"></div>

  <!-- style binding -->
  <div :style="{ fontSize: size + 'px' }"></div>
  <div :style="[styleObjectA, styleObjectB]"></div>

  <!-- binding an object of attributes -->
  <div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

  <!-- prop binding. "prop" must be declared in the child component. -->
  <MyComponent :prop="someThing" />

  <!-- pass down parent props in common with a child component -->
  <MyComponent v-bind="$props" />

  <!-- XLink -->
  <svg><a :xlink:special="foo"></a></svg>
  ```

  The `.prop` modifier also has a dedicated shorthand, `.`:

  ```vue-html
  <div :someProperty.prop="someObject"></div>

  <!-- equivalent to -->
  <div .someProperty="someObject"></div>
  ```

  The `.camel` modifier allows camelizing a `v-bind` attribute name when using in-DOM templates, e.g. the SVG `viewBox` attribute:

  ```vue-html
  <svg :view-box.camel="viewBox"></svg>
  ```

  `.camel` is not needed if you are using string templates, or pre-compiling the template with a build step.

- **See also**
  - [Class and Style Bindings](/guide/essentials/class-and-style)
  - [Components - Prop Passing Details](/guide/components/props#prop-passing-details)

## v-model {#v-model}

Create a two-way binding on a form input element or a component.

- **Expects:** varies based on value of form inputs element or output of components

- **Limited to:**

  - `<input>`
  - `<select>`
  - `<textarea>`
  - components

- **Modifiers**

  - [`.lazy`](/guide/essentials/forms#lazy) - listen to `change` events instead of `input`
  - [`.number`](/guide/essentials/forms#number) - cast valid input string to numbers
  - [`.trim`](/guide/essentials/forms#trim) - trim input

- **See also**

  - [Form Input Bindings](/guide/essentials/forms)
  - [Component Events - Usage with `v-model`](/guide/components/v-model)

## v-slot {#v-slot}

Denote named slots or scoped slots that expect to receive props.

- **Shorthand:** `#`

- **Expects:** JavaScript expression that is valid in a function argument position, including support for destructuring. Optional - only needed if expecting props to be passed to the slot.

- **Argument:** slot name (optional, defaults to `default`)

- **Limited to:**

  - `<template>`
  - [components](/guide/components/slots#scoped-slots) (for a lone default slot with props)

- **Example**

  ```vue-html
  <!-- Named slots -->
  <BaseLayout>
    <template v-slot:header>
      Header content
    </template>

    <template v-slot:default>
      Default slot content
    </template>

    <template v-slot:footer>
      Footer content
    </template>
  </BaseLayout>

  <!-- Named slot that receives props -->
  <InfiniteScroll>
    <template v-slot:item="slotProps">
      <div class="item">
        {{ slotProps.item.text }}
      </div>
    </template>
  </InfiniteScroll>

  <!-- Default slot that receive props, with destructuring -->
  <Mouse v-slot="{ x, y }">
    Mouse position: {{ x }}, {{ y }}
  </Mouse>
  ```

- **See also**
  - [Components - Slots](/guide/components/slots)

## v-pre {#v-pre}

Skip compilation for this element and all its children.

- **Does not expect expression**

- **Details**

  Inside the element with `v-pre`, all Vue template syntax will be preserved and rendered as-is. The most common use case of this is displaying raw mustache tags.

- **Example**

  ```vue-html
  <span v-pre>{{ this will not be compiled }}</span>
  ```

## v-once {#v-once}

Render the element and component once only, and skip future updates.

- **Does not expect expression**

- **Details**

  On subsequent re-renders, the element/component and all its children will be treated as static content and skipped. This can be used to optimize update performance.

  ```vue-html
  <!-- single element -->
  <span v-once>This will never change: {{msg}}</span>
  <!-- the element have children -->
  <div v-once>
    <h1>Comment</h1>
    <p>{{msg}}</p>
  </div>
  <!-- component -->
  <MyComponent v-once :comment="msg"></MyComponent>
  <!-- `v-for` directive -->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

  Since 3.2, you can also memoize part of the template with invalidation conditions using [`v-memo`](#v-memo).

- **See also**
  - [Data Binding Syntax - interpolations](/guide/essentials/template-syntax#text-interpolation)
  - [v-memo](#v-memo)

## v-memo {#v-memo}

- Only supported in 3.2+

- **Expects:** `any[]`

- **Details**

  Memoize a sub-tree of the template. Can be used on both elements and components. The directive expects a fixed-length array of dependency values to compare for the memoization. If every value in the array was the same as last render, then updates for the entire sub-tree will be skipped. For example:

  ```vue-html
  <div v-memo="[valueA, valueB]">
    ...
  </div>
  ```

  When the component re-renders, if both `valueA` and `valueB` remain the same, all updates for this `<div>` and its children will be skipped. In fact, even the Virtual DOM VNode creation will also be skipped since the memoized copy of the sub-tree can be reused.

  It is important to specify the memoization array correctly, otherwise we may skip updates that should indeed be applied. `v-memo` with an empty dependency array (`v-memo="[]"`) would be functionally equivalent to `v-once`.

  **Usage with `v-for`**

  `v-memo` is provided solely for micro optimizations in performance-critical scenarios and should be rarely needed. The most common case where this may prove helpful is when rendering large `v-for` lists (where `length > 1000`):

  ```vue-html
  <div v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
    <p>ID: {{ item.id }} - selected: {{ item.id === selected }}</p>
    <p>...more child nodes</p>
  </div>
  ```

  When the component's `selected` state changes, a large amount of VNodes will be created even though most of the items remained exactly the same. The `v-memo` usage here is essentially saying "only update this item if it went from non-selected to selected, or the other way around". This allows every unaffected item to reuse its previous VNode and skip diffing entirely. Note we don't need to include `item.id` in the memo dependency array here since Vue automatically infers it from the item's `:key`.

  :::warning
  When using `v-memo` with `v-for`, make sure they are used on the same element. **`v-memo` does not work inside `v-for`.**
  :::

  `v-memo` can also be used on components to manually prevent unwanted updates in certain edge cases where the child component update check has been de-optimized. But again, it is the developer's responsibility to specify correct dependency arrays to avoid skipping necessary updates.

- **See also**
  - [v-once](#v-once)

## v-cloak {#v-cloak}

Used to hide un-compiled template until it is ready.

- **Does not expect expression**

- **Details**

  **This directive is only needed in no-build-step setups.**

  When using in-DOM templates, there can be a "flash of un-compiled templates": the user may see raw mustache tags until the mounted component replaces them with rendered content.

  `v-cloak` will remain on the element until the associated component instance is mounted. Combined with CSS rules such as `[v-cloak] { display: none }`, it can be used to hide the raw templates until the component is ready.

- **Example**

  ```css
  [v-cloak] {
    display: none;
  }
  ```

  ```vue-html
  <div v-cloak>
    {{ message }}
  </div>
  ```

  The `<div>` will not be visible until the compilation is done.

---

---
url: /api/built-in-special-attributes.md
---
# Built-in Special Attributes {#built-in-special-attributes}

## key {#key}

The `key` special attribute is primarily used as a hint for Vue's virtual DOM algorithm to identify vnodes when diffing the new list of nodes against the old list.

- **Expects:** `number | string | symbol`

- **Details**

  Without keys, Vue uses an algorithm that minimizes element movement and tries to patch/reuse elements of the same type in-place as much as possible. With keys, it will reorder elements based on the order change of keys, and elements with keys that are no longer present will always be removed / destroyed.

  Children of the same common parent must have **unique keys**. Duplicate keys will cause render errors.

  The most common use case is combined with `v-for`:

  ```vue-html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  It can also be used to force replacement of an element/component instead of reusing it. This can be useful when you want to:

  - Properly trigger lifecycle hooks of a component
  - Trigger transitions

  For example:

  ```vue-html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

  When `text` changes, the `<span>` will always be replaced instead of patched, so a transition will be triggered.

- **See also** [Guide - List Rendering - Maintaining State with `key`](/guide/essentials/list#maintaining-state-with-key)

## ref {#ref}

Denotes a [template ref](/guide/essentials/template-refs).

- **Expects:** `string | Function`

- **Details**

  `ref` is used to register a reference to an element or a child component.

  In Options API, the reference will be registered under the component's `this.$refs` object:

  ```vue-html
  <!-- stored as this.$refs.p -->
  <p ref="p">hello</p>
  ```

  In Composition API, the reference will be stored in a ref with matching name:

  ```vue
  <script setup>
  import { useTemplateRef } from 'vue'

  const pRef = useTemplateRef('p')
  </script>

  <template>
    <p ref="p">hello</p>
  </template>
  ```

  If used on a plain DOM element, the reference will be that element; if used on a child component, the reference will be the child component instance.

  Alternatively `ref` can accept a function value which provides full control over where to store the reference:

  ```vue-html
  <ChildComponent :ref="(el) => child = el" />
  ```

  An important note about the ref registration timing: because the refs themselves are created as a result of the render function, you must wait until the component is mounted before accessing them.

  `this.$refs` is also non-reactive, therefore you should not attempt to use it in templates for data-binding.

- **See also**
  - [Guide - Template Refs](/guide/essentials/template-refs)
  - [Guide - Typing Template Refs](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />
  - [Guide - Typing Component Template Refs](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

## is {#is}

Used for binding [dynamic components](/guide/essentials/component-basics#dynamic-components).

- **Expects:** `string | Component`

- **Usage on native elements**
 
  - Only supported in 3.1+

  When the `is` attribute is used on a native HTML element, it will be interpreted as a [Customized built-in element](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example), which is a native web platform feature.

  There is, however, a use case where you may need Vue to replace a native element with a Vue component, as explained in [in-DOM Template Parsing Caveats](/guide/essentials/component-basics#in-dom-template-parsing-caveats). You can prefix the value of the `is` attribute with `vue:` so that Vue will render the element as a Vue component instead:

  ```vue-html
  <table>
    <tr is="vue:my-row-component"></tr>
  </table>
  ```

- **See also**

  - [Built-in Special Element - `<component>`](/api/built-in-special-elements#component)
  - [Dynamic Components](/guide/essentials/component-basics#dynamic-components)

---

---
url: /api/built-in-special-elements.md
---
# Built-in Special Elements {#built-in-special-elements}

:::info Not Components
`<component>`, `<slot>` and `<template>` are component-like features and part of the template syntax. They are not true components and are compiled away during template compilation. As such, they are conventionally written with lowercase in templates.
:::

## `<component>` {#component}

A "meta component" for rendering dynamic components or elements.

- **Props**

  ```ts
  interface DynamicComponentProps {
    is: string | Component
  }
  ```

- **Details**

  The actual component to render is determined by the `is` prop.

  - When `is` is a string, it could be either an HTML tag name or a component's registered name.

  - Alternatively, `is` can also be directly bound to the definition of a component.

- **Example**

  Rendering components by registered name (Options API):

  ```vue
  <script>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: { Foo, Bar },
    data() {
      return {
        view: 'Foo'
      }
    }
  }
  </script>

  <template>
    <component :is="view" />
  </template>
  ```

  Rendering components by definition (Composition API with `<script setup>`):

  ```vue
  <script setup>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'
  </script>

  <template>
    <component :is="Math.random() > 0.5 ? Foo : Bar" />
  </template>
  ```

  Rendering HTML elements:

  ```vue-html
  <component :is="href ? 'a' : 'span'"></component>
  ```

  The [built-in components](./built-in-components) can all be passed to `is`, but you must register them if you want to pass them by name. For example:

  ```vue
  <script>
  import { Transition, TransitionGroup } from 'vue'

  export default {
    components: {
      Transition,
      TransitionGroup
    }
  }
  </script>

  <template>
    <component :is="isGroup ? 'TransitionGroup' : 'Transition'">
      ...
    </component>
  </template>
  ```

  Registration is not required if you pass the component itself to `is` rather than its name, e.g. in `<script setup>`.

  If `v-model` is used on a `<component>` tag, the template compiler will expand it to a `modelValue` prop and `update:modelValue` event listener, much like it would for any other component. However, this won't be compatible with native HTML elements, such as `<input>` or `<select>`. As a result, using `v-model` with a dynamically created native element won't work:

  ```vue
  <script setup>
  import { ref } from 'vue'

  const tag = ref('input')
  const username = ref('')
  </script>

  <template>
    <!-- This won't work as 'input' is a native HTML element -->
    <component :is="tag" v-model="username" />
  </template>
  ```

  In practice, this edge case isn't common as native form fields are typically wrapped in components in real applications. If you do need to use a native element directly then you can split the `v-model` into an attribute and event manually.

- **See also** [Dynamic Components](/guide/essentials/component-basics#dynamic-components)

## `<slot>` {#slot}

Denotes slot content outlets in templates.

- **Props**

  ```ts
  interface SlotProps {
    /**
     * Any props passed to <slot> to passed as arguments
     * for scoped slots
     */
    [key: string]: any
    /**
     * Reserved for specifying slot name.
     */
    name?: string
  }
  ```

- **Details**

  The `<slot>` element can use the `name` attribute to specify a slot name. When no `name` is specified, it will render the default slot. Additional attributes passed to the slot element will be passed as slot props to the scoped slot defined in the parent.

  The element itself will be replaced by its matched slot content.

  `<slot>` elements in Vue templates are compiled into JavaScript, so they are not to be confused with [native `<slot>` elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot).

- **See also** [Component - Slots](/guide/components/slots)

## `<template>` {#template}

The `<template>` tag is used as a placeholder when we want to use a built-in directive without rendering an element in the DOM.

- **Details**

  The special handling for `<template>` is only triggered if it is used with one of these directives:

  - `v-if`, `v-else-if`, or `v-else`
  - `v-for`
  - `v-slot`

  If none of those directives are present then it will be rendered as a [native `<template>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) instead.

  A `<template>` with a `v-for` can also have a [`key` attribute](/api/built-in-special-attributes#key). All other attributes and directives will be discarded, as they aren't meaningful without a corresponding element.

  Single-file components use a [top-level `<template>` tag](/api/sfc-spec#language-blocks) to wrap the entire template. That usage is separate from the use of `<template>` described above. That top-level tag is not part of the template itself and doesn't support template syntax, such as directives.

- **See also**
  - [Guide - `v-if` on `<template>`](/guide/essentials/conditional#v-if-on-template)
  - [Guide - `v-for` on `<template>`](/guide/essentials/list#v-for-on-template)
  - [Guide - Named slots](/guide/components/slots#named-slots)

---

---
url: /guide/essentials/class-and-style.md
---
# Class and Style Bindings {#class-and-style-bindings}

A common need for data binding is manipulating an element's class list and inline styles. Since `class` and `style` are both attributes, we can use `v-bind` to assign them a string value dynamically, much like with other attributes. However, trying to generate those values using string concatenation can be annoying and error-prone. For this reason, Vue provides special enhancements when `v-bind` is used with `class` and `style`. In addition to strings, the expressions can also evaluate to objects or arrays.

## Binding HTML Classes {#binding-html-classes}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/dynamic-css-classes-with-vue-3" title="Free Vue.js Dynamic CSS Classes Lesson"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-dynamic-css-classes-with-vue" title="Free Vue.js Dynamic CSS Classes Lesson"/>
</div>
