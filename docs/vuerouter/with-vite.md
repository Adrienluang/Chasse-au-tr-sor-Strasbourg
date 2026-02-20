### With Vite

We can define the chunks under the [`rollupOptions`](https://vite.dev/config/build-options.html#build-rollupoptions):

```js [vite.config.js]
export default defineConfig({
  build: {
    rollupOptions: {
      // https://rollupjs.org/guide/en/#outputmanualchunks
      output: {
        manualChunks: {
          'group-user': [
            './src/UserDetails',
            './src/UserDashboard',
            './src/UserProfileEdit',
          ],
        },
      },
    },
  },
})
```
