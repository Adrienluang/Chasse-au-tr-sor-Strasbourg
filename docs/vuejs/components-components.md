### Components {#components}

To create a vnode for a component, the first argument passed to `h()` should be the component definition. This means when using render functions, it is unnecessary to register components - you can just use the imported components directly:

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return h('div', [h(Foo), h(Bar)])
}
```

```jsx
function render() {
  return (
    <div>
      <Foo />
      <Bar />
    </div>
  )
}
```

As we can see, `h` can work with components imported from any file format as long as it's a valid Vue component.

Dynamic components are straightforward with render functions:

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return ok.value ? h(Foo) : h(Bar)
}
```

```jsx
function render() {
  return ok.value ? <Foo /> : <Bar />
}
```

If a component is registered by name and cannot be imported directly (for example, globally registered by a library), it can be programmatically resolved by using the [`resolveComponent()`](/api/render-function#resolvecomponent) helper.
