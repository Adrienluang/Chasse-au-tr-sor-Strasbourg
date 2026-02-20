### Binding to Arrays {#binding-to-arrays-1}

We can bind `:style` to an array of multiple style objects. These objects will be merged and applied to the same element:

```vue-html
<div :style="[baseStyles, overridingStyles]"></div>
```
