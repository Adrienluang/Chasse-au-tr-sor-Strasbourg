### Third party libraries

If the cause of the error is a third party library that is not aware of the `SSR / SSG` environment, the way to work around the error is to import it with a dynamic import when `window` is defined:

```ts
if (typeof window !== 'undefined')
  import('./library-not-ssr-ssg-aware')
```

Alternatively, if your framework supports component `onMount / onMounted` lifecycle hook, you can import the third party library on the callback, since the frameworks should call this lifecycle hook only on client side, you should check your framework documentation.
