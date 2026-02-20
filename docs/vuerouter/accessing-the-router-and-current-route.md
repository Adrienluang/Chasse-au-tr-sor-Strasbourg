### Accessing the router and current route

You'll likely want to access the router from elsewhere in your application.

If you're exporting the router instance from an ES module, you could import the router instance directly where you need it. In some cases this is the best approach, but we have other options if we're inside a component.

In component templates, the router instance is exposed as `$router`. This is similar to the `$route` property we saw earlier, but note the extra `r` on the end.

If we're using the Options API, we can access these same two properties as `this.$router` and `this.$route` in our JavaScript code. The `HomeView.vue` component in the Playground example accesses the router that way:

```js
export default {
  methods: {
    goToAbout() {
      this.$router.push('/about')
    },
  },
}
```

This method is calling `push()`, which is used for [programmatic navigation](./essentials/navigation). We'll learn more about that later.

With the Composition API, we don't have access to the component instance via `this`, so Vue Router includes some composables that we can use instead. `AboutView.vue` in the Playground example is using that approach:

```vue
<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const search = computed({
  get() {
    return route.query.search ?? ''
  },
  set(search) {
    router.replace({ query: { search } })
  },
})
</script>
```

It's not necessary to understand all of that code right now. The key thing to notice is that the composables `useRouter()` and `useRoute()` are used to access the router instance and current route respectively.
