### **All** navigations are now always asynchronous

All navigations, including the first one, are now asynchronous, meaning that, if you use a `transition`, you may need to wait for the router to be *ready* before mounting the app:

```js
app.use(router)
// Note: on Server Side, you need to manually push the initial location
router.isReady().then(() => app.mount('#app'))
```

Otherwise there will be an initial transition as if you provided the `appear` prop to `transition` because the router displays its initial location (nothing) and then displays the first location.

Note that **if you have navigation guards upon the initial navigation**, you might not want to block the app render until they are resolved unless you are doing Server Side Rendering. In this scenario, not waiting the router to be ready to mount the app would yield the same result as in Vue 2.
