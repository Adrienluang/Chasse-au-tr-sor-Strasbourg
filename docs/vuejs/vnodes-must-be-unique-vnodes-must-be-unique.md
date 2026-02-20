### Vnodes Must Be Unique {#vnodes-must-be-unique}

All vnodes in the component tree must be unique. That means the following render function is invalid:

```js
function render() {
  const p = h('p', 'hi')
  return h('div', [
    // Yikes - duplicate vnodes!
    p,
    p
  ])
}
```

If you really want to duplicate the same element/component many times, you can do so with a factory function. For example, the following render function is a perfectly valid way of rendering 20 identical paragraphs:

```js
function render() {
  return h(
    'div',
    Array.from({ length: 20 }).map(() => {
      return h('p', 'hi')
    })
  )
}
```
