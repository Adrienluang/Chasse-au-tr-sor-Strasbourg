### Registering the router plugin

Once we've created our router instance, we need to register it as a plugin by calling `use()` on our application:

```js
createApp(App).use(router).mount('#app')
```

Or, equivalently:

```js
const app = createApp(App)
app.use(router)
app.mount('#app')
```

Like with most Vue plugins, the call to `use()` needs to happen before the call to `mount()`.

If you're curious about what this plugin does, some of its responsibilities include:

1. [Globally registering](https://vuejs.org/guide/components/registration.html#global-registration) the `RouterView` and `RouterLink` components.
2. Adding the global `$router` and `$route` properties.
3. Enabling the `useRouter()` and `useRoute()` composables.
4. Triggering the router to resolve the initial route.
