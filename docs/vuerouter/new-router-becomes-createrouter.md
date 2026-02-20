### new Router becomes createRouter

Vue Router is no longer a class but a set of functions. Instead of writing `new Router()`, you now have to call `createRouter`:

```js
// previously was
// import Router from 'vue-router'
import { createRouter } from 'vue-router'

const router = createRouter({
  // ...
})
```
