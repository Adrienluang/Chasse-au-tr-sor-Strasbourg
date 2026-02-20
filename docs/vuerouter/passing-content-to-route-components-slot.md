### Passing content to route components' `<slot>`

Before you could directly pass a template to be rendered by a route components' `<slot>` by nesting it under a `<router-view>` component:

```vue-html
<router-view>
  <p>In Vue Router 3, I render inside the route component</p>
</router-view>
```

Because of the introduction of the `v-slot` api for `<router-view>`, you must pass it to the `<component>` using the `v-slot` API:

```vue-html
<router-view v-slot="{ Component }">
  <component :is="Component">
    <p>In Vue Router 3, I render inside the route component</p>
  </component>
</router-view>
```
