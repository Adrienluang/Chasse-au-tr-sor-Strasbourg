### `router` and `route`

Throughout the guide, we will often refer to the router instance as `router`. This is the object returned by `createRouter()`. How you access that object in your application will depend on the context. For example, in a component using the Composition API, it can be accessed by calling `useRouter()`. With the Options API, it can be accessed using `this.$router`.

Similarly, the current route will be referred to as `route`. It can be accessed in components using `useRoute()` or `this.$route`, depending on which API the component is using.
