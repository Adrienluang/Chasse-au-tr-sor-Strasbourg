### Type Augmentation Placement {#type-augmentation-placement}

We can put this type augmentation in a `.ts` file, or in a project-wide `*.d.ts` file. Either way, make sure it is included in `tsconfig.json`. For library / plugin authors, this file should be specified in the `types` property in `package.json`.

In order to take advantage of module augmentation, you will need to ensure the augmentation is placed in a [TypeScript module](https://www.typescriptlang.org/docs/handbook/modules.html). That is to say, the file needs to contain at least one top-level `import` or `export`, even if it is just `export {}`. If the augmentation is placed outside of a module, it will overwrite the original types rather than augmenting them!

```ts
// Does not work, overwrites the original types.
declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

```ts
// Works correctly
export {}

declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

## Augmenting Custom Options {#augmenting-custom-options}

Some plugins, for example `vue-router`, provide support for custom component options such as `beforeRouteEnter`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    // ...
  }
})
```

Without proper type augmentation, the arguments of this hook will implicitly have `any` type. We can augment the `ComponentCustomOptions` interface to support these custom options:

```ts
import { Route } from 'vue-router'

declare module 'vue' {
  interface ComponentCustomOptions {
    beforeRouteEnter?(to: Route, from: Route, next: () => void): void
  }
}
```

Now the `beforeRouteEnter` option will be properly typed. Note this is just an example - well-typed libraries like `vue-router` should automatically perform these augmentations in their own type definitions.

The placement of this augmentation is subject to the [same restrictions](#type-augmentation-placement) as global property augmentations.

See also:

- [TypeScript unit tests for component type extensions](https://github.com/vuejs/core/blob/main/packages-private/dts-test/componentTypeExtensions.test-d.tsx)

## Typing Global Custom Directives {#typing-global-custom-directives}

See: [Typing Custom Global Directives](/guide/typescript/composition-api#typing-global-custom-directives) <sup class="vt-badge ts" />

---

---
url: /guide/reusability/plugins.md
---
# Plugins {#plugins}

## Introduction {#introduction}

Plugins are self-contained code that usually add app-level functionality to Vue. This is how we install a plugin:

```js
import { createApp } from 'vue'

const app = createApp({})

app.use(myPlugin, {
  /* optional options */
})
```

A plugin is defined as either an object that exposes an `install()` method, or simply a function that acts as the install function itself. The install function receives the [app instance](/api/application) along with additional options passed to `app.use()`, if any:

```js
const myPlugin = {
  install(app, options) {
    // configure the app
  }
}
```

There is no strictly defined scope for a plugin, but common scenarios where plugins are useful include:

1. Register one or more global components or custom directives with [`app.component()`](/api/application#app-component) and [`app.directive()`](/api/application#app-directive).

2. Make a resource [injectable](/guide/components/provide-inject) throughout the app by calling [`app.provide()`](/api/application#app-provide).

3. Add some global instance properties or methods by attaching them to [`app.config.globalProperties`](/api/application#app-config-globalproperties).

4. A library that needs to perform some combination of the above (e.g. [vue-router](https://github.com/vuejs/vue-router-next)).

## Writing a Plugin {#writing-a-plugin}

In order to better understand how to create your own Vue.js plugins, we will create a very simplified version of a plugin that displays `i18n` (short for [Internationalization](https://en.wikipedia.org/wiki/Internationalization_and_localization)) strings.

Let's begin by setting up the plugin object. It is recommended to create it in a separate file and export it, as shown below to keep the logic contained and separate.

```js [plugins/i18n.js]
export default {
  install: (app, options) => {
    // Plugin code goes here
  }
}
```

We want to create a translation function. This function will receive a dot-delimited `key` string, which we will use to look up the translated string in the user-provided options. This is the intended usage in templates:

```vue-html
<h1>{{ $translate('greetings.hello') }}</h1>
```

Since this function should be globally available in all templates, we will make it so by attaching it to `app.config.globalProperties` in our plugin:

```js{3-10} [plugins/i18n.js]
export default {
  install: (app, options) => {
    // inject a globally available $translate() method
    app.config.globalProperties.$translate = (key) => {
      // retrieve a nested property in `options`
      // using `key` as the path
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }
  }
}
```

Our `$translate` function will take a string such as `greetings.hello`, look inside the user provided configuration and return the translated value.

The object containing the translated keys should be passed to the plugin during installation via additional parameters to `app.use()`:

```js
import i18nPlugin from './plugins/i18n'

app.use(i18nPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
})
```

Now, our initial expression `$translate('greetings.hello')` will be replaced by `Bonjour!` at runtime.

See also: [Augmenting Global Properties](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />

:::tip
Use global properties scarcely, since it can quickly become confusing if too many global properties injected by different plugins are used throughout an app.
:::
