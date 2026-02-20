### Moved the `base` option

The `base` option is now passed as the first argument to `createWebHistory` (and other histories):

```js
import { createRouter, createWebHistory } from 'vue-router'
createRouter({
  history: createWebHistory('/base-directory/'),
  routes: [],
})
```
