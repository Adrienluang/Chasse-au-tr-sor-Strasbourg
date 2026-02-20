### Scoped Style Tips {#scoped-style-tips}

- **Scoped styles do not eliminate the need for classes**. Due to the way browsers render various CSS selectors, `p { color: red }` will be many times slower when scoped (i.e. when combined with an attribute selector). If you use classes or ids instead, such as in `.example { color: red }`, then you virtually eliminate that performance hit.

- **Be careful with descendant selectors in recursive components!** For a CSS rule with the selector `.a .b`, if the element that matches `.a` contains a recursive child component, then all `.b` in that child component will be matched by the rule.

## CSS Modules {#css-modules}

A `<style module>` tag is compiled as [CSS Modules](https://github.com/css-modules/css-modules) and exposes the resulting CSS classes to the component as an object under the key of `$style`:

```vue
<template>
  <p :class="$style.red">This should be red</p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

The resulting classes are hashed to avoid collision, achieving the same effect of scoping the CSS to the current component only.

Refer to the [CSS Modules spec](https://github.com/css-modules/css-modules) for more details such as [global exceptions](https://github.com/css-modules/css-modules/blob/master/docs/composition.md#exceptions) and [composition](https://github.com/css-modules/css-modules/blob/master/docs/composition.md#composition).
