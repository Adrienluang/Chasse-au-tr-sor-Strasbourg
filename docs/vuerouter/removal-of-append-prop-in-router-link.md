### Removal of `append` prop in `<router-link>`

The `append` prop has been removed from `<router-link>`. You can manually concatenate the value to an existing `path` instead:

```vue-html
replace
<router-link to="child-route" append>to relative child</router-link>
with
<router-link :to="append($route.path, 'child-route')">
  to relative child
</router-link>
```

You must define a global `append` function on your *App* instance:

```js
app.config.globalProperties.append = (path, pathToAppend) =>
  path + (path.endsWith('/') ? '' : '/') + pathToAppend
```

**Reason**: `append` wasn't used very often, is easy to replicate in user land.
