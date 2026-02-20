### `<router-view>`, `<keep-alive>`, and `<transition>`

`transition` and `keep-alive` must now be used **inside** of `RouterView` via the `v-slot` API:

```vue-html
<router-view v-slot="{ Component }">
  <transition>
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </transition>
</router-view>
```

**Reason**: This was a necessary change. See the [related RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0034-router-view-keep-alive-transitions.md).
