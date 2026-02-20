### Recursive Components {#recursive-components}

An SFC can implicitly refer to itself via its filename. E.g. a file named `FooBar.vue` can refer to itself as `<FooBar/>` in its template.

Note this has lower priority than imported components. If you have a named import that conflicts with the component's inferred name, you can alias the import:

```js
import { FooBar as FooBarChild } from './components'
```
