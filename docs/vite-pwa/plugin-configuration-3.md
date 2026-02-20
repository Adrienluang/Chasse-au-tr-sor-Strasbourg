### Plugin Configuration

We recommend you to put your custom service worker inside `src` directory.

You need to configure `srcDir: 'src'` and `filename: 'sw.ts'` plugin options in your `vite.config.ts` file, configure both options with the directory and the name of your custom service worker properly:

```ts
VitePWA({
  srcDir: 'src',
  filename: 'sw.ts'
})
```
