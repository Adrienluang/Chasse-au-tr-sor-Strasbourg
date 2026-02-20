### Using Vnodes in `<template>`

```vue
<script setup>
import { h } from 'vue'

const vnode = h('button', ['Hello'])
</script>

<template>
  <!-- Via <component /> -->
  <component :is="vnode">Hi</component>

  <!-- Or directly as element -->
  <vnode />
  <vnode>Hi</vnode>
</template>
```

A vnode object has been declared in `setup()`, you can use it like a normal component for rendering.

:::warning
A vnode represents an already created render output, not a component definition. Using a vnode in `<template>` does not create a new component instance, and the vnode will be rendered as-is.

This pattern should be used with care and is not a replacement for normal components.
:::

## JSX / TSX {#jsx-tsx}

[JSX](https://facebook.github.io/jsx/) is an XML-like extension to JavaScript that allows us to write code like this:

```jsx
const vnode = <div>hello</div>
```

Inside JSX expressions, use curly braces to embed dynamic values:

```jsx
const vnode = <div id={dynamicId}>hello, {userName}</div>
```

`create-vue` and Vue CLI both have options for scaffolding projects with pre-configured JSX support. If you are configuring JSX manually, please refer to the documentation of [`@vue/babel-plugin-jsx`](https://github.com/vuejs/jsx-next) for details.

Although first introduced by React, JSX actually has no defined runtime semantics and can be compiled into various different outputs. If you have worked with JSX before, do note that **Vue JSX transform is different from React's JSX transform**, so you can't use React's JSX transform in Vue applications. Some notable differences from React JSX include:

- You can use HTML attributes such as `class` and `for` as props - no need to use `className` or `htmlFor`.
- Passing children to components (i.e. slots) [works differently](#passing-slots).

Vue's type definition also provides type inference for TSX usage. When using TSX, make sure to specify `"jsx": "preserve"` in `tsconfig.json` so that TypeScript leaves the JSX syntax intact for Vue JSX transform to process.
