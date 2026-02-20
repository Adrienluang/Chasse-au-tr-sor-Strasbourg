### Scoped Slots {#scoped-slots}

To render a scoped slot in the parent component, a slot is passed to the child. Notice how the slot now has a parameter `text`. The slot will be called in the child component and the data from the child component will be passed up to the parent component.

```js
// parent component
export default {
  setup() {
    return () => h(MyComp, null, {
      default: ({ text }) => h('p', text)
    })
  }
}
```

Remember to pass `null` so the slots will not be treated as props.

```js
// child component
export default {
  setup(props, { slots }) {
    const text = ref('hi')
    return () => h('div', null, slots.default({ text: text.value }))
  }
}
```

JSX equivalent:

```jsx
<MyComponent>{{
  default: ({ text }) => <p>{ text }</p>  
}}</MyComponent>
```
