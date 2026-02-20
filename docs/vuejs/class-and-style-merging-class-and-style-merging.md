### `class` and `style` Merging {#class-and-style-merging}

If the child component's root element already has existing `class` or `style` attributes, it will be merged with the `class` and `style` values that are inherited from the parent. Suppose we change the template of `<MyButton>` in the previous example to:

```vue-html
<!-- template of <MyButton> -->
<button class="btn">Click Me</button>
```

Then the final rendered DOM would now become:

```html
<button class="btn large">Click Me</button>
```
