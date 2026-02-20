### Removed `*` (star or catch all) routes

Catch all routes (`*`, `/*`) must now be defined using a parameter with a custom regex:

```js
const routes = [
  // pathMatch is the name of the param, e.g., going to /not/found yields
  // { params: { pathMatch: ['not', 'found'] }}
  // this is thanks to the last *, meaning repeated params and it is necessary if you
  // plan on directly navigating to the not-found route using its name
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
  // if you omit the last `*`, the `/` character in params will be encoded when resolving or pushing
  { path: '/:pathMatch(.*)', name: 'bad-not-found', component: NotFound },
]
// bad example if using named routes:
router.resolve({
  name: 'bad-not-found',
  params: { pathMatch: 'not/found' },
}).href // '/not%2Ffound'
// good example:
router.resolve({
  name: 'not-found',
  params: { pathMatch: ['not', 'found'] },
}).href // '/not/found'
```

:::tip
You don't need to add the `*` for repeated params if you don't plan to directly push to the not found route using its name. If you call `router.push('/not/found/url')`, it will provide the right `pathMatch` param.
:::

**Reason**: Vue Router doesn't use `path-to-regexp` anymore, instead it implements its own parsing system that allows route ranking and enables dynamic routing. Since we usually add one single catch-all route per project, there is no big benefit in supporting a special syntax for `*`. The encoding of params is encoding across routes, without exception to make things easier to predict.
