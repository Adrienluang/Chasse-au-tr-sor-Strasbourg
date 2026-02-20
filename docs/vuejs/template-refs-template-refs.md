### Template Refs {#template-refs}

<div class="composition-api">

With the Composition API, when using [`useTemplateRef()`](/api/composition-api-helpers#usetemplateref) <sup class="vt-badge" data-text="3.5+" />  template refs are created by passing the string value as prop to the vnode:

```js
import { h, useTemplateRef } from 'vue'

export default {
  setup() {
    const divEl = useTemplateRef('my-div')

    // <div ref="my-div">
    return () => h('div', { ref: 'my-div' })
  }
}
```

<details>
<summary>Usage before 3.5</summary>

In versions before 3.5 where useTemplateRef() was not introduced, template refs are created by passing the ref() itself as a prop to the vnode:

```js
import { h, ref } from 'vue'

export default {
  setup() {
    const divEl = ref()

    // <div ref="divEl">
    return () => h('div', { ref: divEl })
  }
}
```
</details>
</div>
<div class="options-api">

With the Options API, template refs are created by passing the ref name as a string in the vnode props:

```js
export default {
  render() {
    // <div ref="divEl">
    return h('div', { ref: 'divEl' })
  }
}
```

</div>

## Functional Components {#functional-components}

Functional components are an alternative form of component that don't have any state of their own. They act like pure functions: props in, vnodes out. They are rendered without creating a component instance (i.e. no `this`), and without the usual component lifecycle hooks.

To create a functional component we use a plain function, rather than an options object. The function is effectively the `render` function for the component.

<div class="composition-api">

The signature of a functional component is the same as the `setup()` hook:

```js
function MyComponent(props, { slots, emit, attrs }) {
  // ...
}
```

</div>
<div class="options-api">

As there is no `this` reference for a functional component, Vue will pass in the `props` as the first argument:

```js
function MyComponent(props, context) {
  // ...
}
```

The second argument, `context`, contains three properties: `attrs`, `emit`, and `slots`. These are equivalent to the instance properties [`$attrs`](/api/component-instance#attrs), [`$emit`](/api/component-instance#emit), and [`$slots`](/api/component-instance#slots) respectively.

</div>

Most of the usual configuration options for components are not available for functional components. However, it is possible to define [`props`](/api/options-state#props) and [`emits`](/api/options-state#emits) by adding them as properties:

```js
MyComponent.props = ['value']
MyComponent.emits = ['click']
```

If the `props` option is not specified, then the `props` object passed to the function will contain all attributes, the same as `attrs`. The prop names will not be normalized to camelCase unless the `props` option is specified.

For functional components with explicit `props`, [attribute fallthrough](/guide/components/attrs) works much the same as with normal components. However, for functional components that don't explicitly specify their `props`, only the `class`, `style`, and `onXxx` event listeners will be inherited from the `attrs` by default. In either case, `inheritAttrs` can be set to `false` to disable attribute inheritance:

```js
MyComponent.inheritAttrs = false
```

Functional components can be registered and consumed just like normal components. If you pass a function as the first argument to `h()`, it will be treated as a functional component.
