### 2. Update Imports

**Vite plugin:**

```ts
import VueRouter from 'unplugin-vue-router/vite' // [!code --]
import VueRouter from 'vue-router/vite' // [!code ++]
```

Other build tools (Webpack, Rollup, esbuild) import from `vue-router/unplugin`:

```ts
import VueRouter from 'vue-router/unplugin'

VueRouter.webpack({
  /* ... */
})
VueRouter.rollup({
  /* ... */
})
// etc.
```

**Data loaders:**

```ts
import { defineBasicLoader } from 'unplugin-vue-router/data-loaders/basic' // [!code --]
import { defineColadaLoader } from 'unplugin-vue-router/data-loaders/pinia-colada' // [!code --]
import { DataLoaderPlugin } from 'unplugin-vue-router/data-loaders' // [!code --]
import { defineBasicLoader, DataLoaderPlugin } from 'vue-router/experimental' // [!code ++]
import { defineColadaLoader } from 'vue-router/experimental/pinia-colada' // [!code ++]
```

**Unplugin utilities (for custom integrations):**

```ts
import {
  VueRouterAutoImports,
  EditableTreeNode,
  createTreeNodeValue,
  createRoutesContext,
  getFileBasedRouteName,
  getPascalCaseRouteName,
} from 'unplugin-vue-router' // [!code --]
} from 'vue-router/unplugin' // [!code ++]
```

**Types:**

```ts
import type { Options, EditableTreeNode } from 'unplugin-vue-router' // [!code --]
import type { Options, EditableTreeNode } from 'vue-router/unplugin' // [!code ++]
```

**Volar plugins:**

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "rootDir": ".",
  },
  "vueCompilerOptions": {
    "plugins": [
      "unplugin-vue-router/volar/sfc-typed-router", // [!code --]
      "unplugin-vue-router/volar/sfc-route-blocks", // [!code --]
    ],
  },
}
```

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "rootDir": ".",
  },
  "vueCompilerOptions": {
    "plugins": [
      "vue-router/volar/sfc-typed-router", // [!code ++]
      "vue-router/volar/sfc-route-blocks", // [!code ++]
    ],
  },
}
```
