### Dynamic Components {#dynamic-components}

Since components are referenced as variables instead of registered under string keys, we should use dynamic `:is` binding when using dynamic components inside `<script setup>`:

```vue
<script setup>
import Foo from './Foo.vue'
import Bar from './Bar.vue'
</script>

<template>
  <component :is="Foo" />
  <component :is="someCondition ? Foo : Bar" />
</template>
```

Note how the components can be used as variables in a ternary expression.
