### Removal of `event` and `tag` props in `<router-link>`

Both `event`, and `tag` props have been removed from `<router-link>`. You can use the [`v-slot` API](/guide/advanced/composition-api#uselink) to fully customize `<router-link>`:

```vue-html
replace
<router-link to="/about" tag="span" event="dblclick">About Us</router-link>
with
<router-link to="/about" custom v-slot="{ navigate }">
  <span @click="navigate" @keypress.enter="navigate" role="link">About Us</span>
</router-link>
```

**Reason**: These props were often used together to use something different from an `<a>` tag but were introduced before the `v-slot` API and are not used enough to justify adding to the bundle size for everybody.
