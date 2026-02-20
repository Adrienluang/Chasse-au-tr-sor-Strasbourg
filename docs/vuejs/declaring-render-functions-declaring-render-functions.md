### Declaring Render Functions {#declaring-render-functions}

<div class="composition-api">

When using templates with Composition API, the return value of the `setup()` hook is used to expose data to the template. When using render functions, however, we can directly return the render function instead:

```js
import { ref, h } from 'vue'

export default {
  props: {
    /* ... */
  },
  setup(props) {
    const count = ref(1)

    // return the render function
    return () => h('div', props.msg + count.value)
  }
}
```

The render function is declared inside `setup()` so it naturally has access to the props and any reactive state declared in the same scope.

In addition to returning a single vnode, you can also return strings or arrays:

```js
export default {
  setup() {
    return () => 'hello world!'
  }
}
```

```js
import { h } from 'vue'

export default {
  setup() {
    // use an array to return multiple root nodes
    return () => [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

:::tip
Make sure to return a function instead of directly returning values! The `setup()` function is called only once per component, while the returned render function will be called multiple times.
:::

</div>
<div class="options-api">

We can declare render functions using the `render` option:

```js
import { h } from 'vue'

export default {
  data() {
    return {
      msg: 'hello'
    }
  },
  render() {
    return h('div', this.msg)
  }
}
```

The `render()` function has access to the component instance via `this`.

In addition to returning a single vnode, you can also return strings or arrays:

```js
export default {
  render() {
    return 'hello world!'
  }
}
```

```js
import { h } from 'vue'

export default {
  render() {
    // use an array to return multiple root nodes
    return [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

</div>

If a render function component doesn't need any instance state, they can also be declared directly as a function for brevity:

```js
function Hello() {
  return 'hello world!'
}
```

That's right, this is a valid Vue component! See [Functional Components](#functional-components) for more details on this syntax.
