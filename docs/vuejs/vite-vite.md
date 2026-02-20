### Vite {#vite}

`@vitejs/plugin-vue` automatically provides default values for these flags. To change the default values, use Vite's [`define` config option](https://vite.dev/config/shared-options.html#define):

```js [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    // enable hydration mismatch details in production build
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  }
})
```
