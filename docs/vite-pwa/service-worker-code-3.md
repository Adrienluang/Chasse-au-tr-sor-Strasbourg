### Service Worker Code

You need to include on your service worker at least this code:

```js
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING')
    self.skipWaiting()
})
```

## TypeScript support

You can use TypeScript to write your custom service worker. To resolve service worker types, just add `WebWorker` to `lib` entry on your `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "lib": ["ESNext", "DOM", "WebWorker"]
  }
}
```
