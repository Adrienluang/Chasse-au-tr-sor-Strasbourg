### Custom Rollup and Vite Plugins&#x20;

From `v0.18.0`, you can add custom Rollup and/or Vite plugins to the service worker build, using `rollup` and `vite` options in the new `buildPlugins` option.

::: warning
The old `plugins` option has been deprecated, use `buildPlugins.rollup` instead:

* if `buildPlugins.rollup` is configured then `plugins` will be ignored
* if `buildPlugins.rollup` is not configured then `plugins` will be used
  :::

You can check the [vue-router example](https://github.com/vite-pwa/vite-plugin-pwa/tree/main/examples/vue-router) using a custom Vite plugin with a simple virtual module consumed by both custom service workers.

## Auto Update Behavior

If you need your custom service worker works with `Auto Update` behavior, you need to change the plugin configuration options and add some custom code to your service worker code.
