### vs. React Hooks {#vs-react-hooks}

If you have experience with React, you may notice that this looks very similar to custom React hooks. Composition API was in part inspired by React hooks, and Vue composables are indeed similar to React hooks in terms of logic composition capabilities. However, Vue composables are based on Vue's fine-grained reactivity system, which is fundamentally different from React hooks' execution model. This is discussed in more detail in the [Composition API FAQ](/guide/extras/composition-api-faq#comparison-with-react-hooks).

## Further Reading {#further-reading}

- [Reactivity In Depth](/guide/extras/reactivity-in-depth): for a low-level understanding of how Vue's reactivity system works.
- [State Management](/guide/scaling-up/state-management): for patterns of managing state shared by multiple components.
- [Testing Composables](/guide/scaling-up/testing#testing-composables): tips on unit testing composables.
- [VueUse](https://vueuse.org/): an ever-growing collection of Vue composables. The source code is also a great learning resource.

---

---
url: /guide/extras/composition-api-faq.md
---

# Composition API FAQ {#composition-api-faq}

:::tip
This FAQ assumes prior experience with Vue - in particular, experience with Vue 2 while primarily using Options API.
:::

## What is Composition API? {#what-is-composition-api}

<VueSchoolLink href="https://vueschool.io/lessons/introduction-to-the-vue-js-3-composition-api" title="Free Composition API Lesson"/>

Composition API is a set of APIs that allows us to author Vue components using imported functions instead of declaring options. It is an umbrella term that covers the following APIs:

- [Reactivity API](/api/reactivity-core), e.g. `ref()` and `reactive()`, that allows us to directly create reactive state, computed state, and watchers.

- [Lifecycle Hooks](/api/composition-api-lifecycle), e.g. `onMounted()` and `onUnmounted()`, that allow us to programmatically hook into the component lifecycle.

- [Dependency Injection](/api/composition-api-dependency-injection), i.e. `provide()` and `inject()`, that allow us to leverage Vue's dependency injection system while using Reactivity APIs.

Composition API is a built-in feature of Vue 3 and [Vue 2.7](https://blog.vuejs.org/posts/vue-2-7-naruto.html). For older Vue 2 versions, use the officially maintained [`@vue/composition-api`](https://github.com/vuejs/composition-api) plugin. In Vue 3, it is also primarily used together with the [`<script setup>`](/api/sfc-script-setup) syntax in Single-File Components. Here's a basic example of a component using Composition API:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// reactive state
const count = ref(0)

// functions that mutate state and trigger updates
function increment() {
  count.value++
}

// lifecycle hooks
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

Despite an API style based on function composition, **Composition API is NOT functional programming**. Composition API is based on Vue's mutable, fine-grained reactivity paradigm, whereas functional programming emphasizes immutability.

If you are interested in learning how to use Vue with Composition API, you can set the site-wide API preference to Composition API using the toggle at the top of the left sidebar, and then go through the guide from the beginning.

## Why Composition API? {#why-composition-api}
