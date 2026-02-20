# .styl and .stylus
npm add -D stylus
```

If using Vue single file components, this also automatically enables `<style lang="sass">` et al.

Vite improves `@import` resolving for Sass and Less so that Vite aliases are also respected. In addition, relative `url()` references inside imported Sass/Less files that are in different directories from the root file are also automatically rebased to ensure correctness. Rebasing `url()` references that starts with a variable or a interpolation are not supported due to its API constraints.

`@import` alias and url rebasing are not supported for Stylus due to its API constraints.

You can also use CSS modules combined with pre-processors by prepending `.module` to the file extension, for example `style.module.scss`.

### Disabling CSS injection into the page

The automatic injection of CSS contents can be turned off via the `?inline` query parameter. In this case, the processed CSS string is returned as the module's default export as usual, but the styles aren't injected to the page.

```js twoslash
import 'vite/client'
// ---cut---
import './foo.css' // will be injected into the page
import otherStyles from './bar.css?inline' // will not be injected
```

::: tip NOTE
Default and named imports from CSS files (e.g `import style from './foo.css'`) are removed since Vite 5. Use the `?inline` query instead.
:::

### Lightning CSS

Starting from Vite 4.4, there is experimental support for [Lightning CSS](https://lightningcss.dev/). You can opt into it by adding [`css.transformer: 'lightningcss'`](../config/shared-options.md#css-transformer) to your config file and install the optional [`lightningcss`](https://www.npmjs.com/package/lightningcss) dependency:

```bash
npm add -D lightningcss
```

If enabled, CSS files will be processed by Lightning CSS instead of PostCSS. To configure it, you can pass Lightning CSS options to the [`css.lightningcss`](../config/shared-options.md#css-lightningcss) config option.

To configure CSS Modules, you'll use [`css.lightningcss.cssModules`](https://lightningcss.dev/css-modules.html) instead of [`css.modules`](../config/shared-options.md#css-modules) (which configures the way PostCSS handles CSS modules).

By default, Vite uses esbuild to minify CSS. Lightning CSS can also be used as the CSS minifier with [`build.cssMinify: 'lightningcss'`](../config/build-options.md#build-cssminify).

## Static Assets

Watch an interactive lesson on Scrimba

Importing a static asset will return the resolved public URL when it is served:

```js twoslash
import 'vite/client'
// ---cut---
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

Special queries can modify how assets are loaded:

```js twoslash
import 'vite/client'
// ---cut---
// Explicitly load assets as URL (automatically inlined depending on the file size)
import assetAsURL from './asset.js?url'
```

```js twoslash
import 'vite/client'
// ---cut---
// Load assets as strings
import assetAsString from './shader.glsl?raw'
```

```js twoslash
import 'vite/client'
// ---cut---
// Load Web Workers
import Worker from './worker.js?worker'
```

```js twoslash
import 'vite/client'
// ---cut---
// Web Workers inlined as base64 strings at build time
import InlineWorker from './worker.js?worker&inline'
```

More details in [Static Asset Handling](./assets).

## JSON

JSON files can be directly imported - named imports are also supported:

```js twoslash
import 'vite/client'
// ---cut---
// import the entire object
import json from './example.json'
// import a root field as named exports - helps with tree-shaking!
import { field } from './example.json'
```

## Glob Import

Vite supports importing multiple modules from the file system via the special `import.meta.glob` function:

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js')
```

The above will be transformed into the following:

```js
// code produced by vite
const modules = {
  './dir/bar.js': () => import('./dir/bar.js'),
  './dir/foo.js': () => import('./dir/foo.js'),
}
```

You can then iterate over the keys of the `modules` object to access the corresponding modules:

```js
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```

Matched files are by default lazy-loaded via dynamic import and will be split into separate chunks during build. If you'd rather import all the modules directly (e.g. relying on side-effects in these modules to be applied first), you can pass `{ eager: true }` as the second argument:

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', { eager: true })
```

The above will be transformed into the following:

```js
// code produced by vite
import * as __vite_glob_0_0 from './dir/bar.js'
import * as __vite_glob_0_1 from './dir/foo.js'
const modules = {
  './dir/bar.js': __vite_glob_0_0,
  './dir/foo.js': __vite_glob_0_1,
}
```

### Multiple Patterns

The first argument can be an array of globs, for example

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob(['./dir/*.js', './another/*.js'])
```

### Negative Patterns

Negative glob patterns are also supported (prefixed with `!`). To ignore some files from the result, you can add exclude glob patterns to the first argument:

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob(['./dir/*.js', '!**/bar.js'])
```

```js
// code produced by vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
}
```

#### Named Imports

It's possible to only import parts of the modules with the `import` options.

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', { import: 'setup' })
```

```ts
// code produced by vite
const modules = {
  './dir/bar.js': () => import('./dir/bar.js').then((m) => m.setup),
  './dir/foo.js': () => import('./dir/foo.js').then((m) => m.setup),
}
```

When combined with `eager` it's even possible to have tree-shaking enabled for those modules.

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  import: 'setup',
  eager: true,
})
```

```ts
// code produced by vite:
import { setup as __vite_glob_0_0 } from './dir/bar.js'
import { setup as __vite_glob_0_1 } from './dir/foo.js'
const modules = {
  './dir/bar.js': __vite_glob_0_0,
  './dir/foo.js': __vite_glob_0_1,
}
```

Set `import` to `default` to import the default export.

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  import: 'default',
  eager: true,
})
```

```ts
// code produced by vite:
import { default as __vite_glob_0_0 } from './dir/bar.js'
import { default as __vite_glob_0_1 } from './dir/foo.js'
const modules = {
  './dir/bar.js': __vite_glob_0_0,
  './dir/foo.js': __vite_glob_0_1,
}
```

#### Custom Queries

You can also use the `query` option to provide queries to imports, for example, to import assets [as a string](/guide/assets.html#importing-asset-as-string) or [as a url](/guide/assets.html#importing-asset-as-url):

```ts twoslash
import 'vite/client'
// ---cut---
const moduleStrings = import.meta.glob('./dir/*.svg', {
  query: '?raw',
  import: 'default',
})
const moduleUrls = import.meta.glob('./dir/*.svg', {
  query: '?url',
  import: 'default',
})
```

```ts
// code produced by vite:
const moduleStrings = {
  './dir/bar.svg': () => import('./dir/bar.svg?raw').then((m) => m['default']),
  './dir/foo.svg': () => import('./dir/foo.svg?raw').then((m) => m['default']),
}
const moduleUrls = {
  './dir/bar.svg': () => import('./dir/bar.svg?url').then((m) => m['default']),
  './dir/foo.svg': () => import('./dir/foo.svg?url').then((m) => m['default']),
}
```

You can also provide custom queries for other plugins to consume:

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  query: { foo: 'bar', bar: true },
})
```

#### Base Path

You can also use the `base` option to provide base path for the imports:

```ts twoslash
import 'vite/client'
// ---cut---
const modulesWithBase = import.meta.glob('./**/*.js', {
  base: './base',
})
```

```ts
// code produced by vite:
const modulesWithBase = {
  './dir/foo.js': () => import('./base/dir/foo.js'),
  './dir/bar.js': () => import('./base/dir/bar.js'),
}
```

The base option can only be a directory path relative to the importer file or absolute against the project root. Aliases and virtual modules aren't supported.

Only the globs that are relative paths are interpreted as relative to the resolved base.

All the resulting module keys are modified to be relative to the base if provided.

### Glob Import Caveats

Note that:

* This is a Vite-only feature and is not a web or ES standard.
* The glob patterns are treated like import specifiers: they must be either relative (start with `./`) or absolute (start with `/`, resolved relative to project root) or an alias path (see [`resolve.alias` option](/config/shared-options.md#resolve-alias)).
* The glob matching is done via [`tinyglobby`](https://github.com/SuperchupuDev/tinyglobby) - check out its documentation for [supported glob patterns](https://superchupu.dev/tinyglobby/comparison).
* You should also be aware that all the arguments in the `import.meta.glob` must be **passed as literals**. You can NOT use variables or expressions in them.

## Dynamic Import

Similar to [glob import](#glob-import), Vite also supports dynamic import with variables.

```ts
const module = await import(`./dir/${file}.js`)
```

Note that variables only represent file names one level deep. If `file` is `'foo/bar'`, the import would fail. For more advanced usage, you can use the [glob import](#glob-import) feature.

## WebAssembly

Pre-compiled `.wasm` files can be imported with `?init`.
The default export will be an initialization function that returns a Promise of the [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Instance):

```js twoslash
import 'vite/client'
// ---cut---
import init from './example.wasm?init'

init().then((instance) => {
  instance.exports.test()
})
```

The init function can also take an importObject which is passed along to [`WebAssembly.instantiate`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/instantiate) as its second argument:

```js twoslash
import 'vite/client'
import init from './example.wasm?init'
// ---cut---
init({
  imports: {
    someFunc: () => {
      /* ... */
    },
  },
}).then(() => {
  /* ... */
})
```

In the production build, `.wasm` files smaller than `assetInlineLimit` will be inlined as base64 strings. Otherwise, they will be treated as a [static asset](./assets) and fetched on-demand.

::: tip NOTE
[ES Module Integration Proposal for WebAssembly](https://github.com/WebAssembly/esm-integration) is not currently supported.
Use [`vite-plugin-wasm`](https://github.com/Menci/vite-plugin-wasm) or other community plugins to handle this.
:::

### Accessing the WebAssembly Module

If you need access to the `Module` object, e.g. to instantiate it multiple times, use an [explicit URL import](./assets#explicit-url-imports) to resolve the asset, and then perform the instantiation:

```js twoslash
import 'vite/client'
// ---cut---
import wasmUrl from 'foo.wasm?url'

const main = async () => {
  const responsePromise = fetch(wasmUrl)
  const { module, instance } =
    await WebAssembly.instantiateStreaming(responsePromise)
  /* ... */
}

main()
```

### Fetching the module in Node.js

In SSR, the `fetch()` happening as part of the `?init` import, may fail with `TypeError: Invalid URL`.
See the issue [Support wasm in SSR](https://github.com/vitejs/vite/issues/8882).

Here is an alternative, assuming the project base is the current directory:

```js twoslash
import 'vite/client'
// ---cut---
import wasmUrl from 'foo.wasm?url'
import { readFile } from 'node:fs/promises'

const main = async () => {
  const resolvedUrl = (await import('./test/boot.test.wasm?url')).default
  const buffer = await readFile('.' + resolvedUrl)
  const { instance } = await WebAssembly.instantiate(buffer, {
    /* ... */
  })
  /* ... */
}

main()
```

## Web Workers

### Import with Constructors

A web worker script can be imported using [`new Worker()`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) and [`new SharedWorker()`](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker/SharedWorker). Compared to the worker suffixes, this syntax leans closer to the standards and is the **recommended** way to create workers.

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url))
```

The worker constructor also accepts options, which can be used to create "module" workers:

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
})
```

The worker detection will only work if the `new URL()` constructor is used directly inside the `new Worker()` declaration. Additionally, all options parameters must be static values (i.e. string literals).

### Import with Query Suffixes

A web worker script can be directly imported by appending `?worker` or `?sharedworker` to the import request. The default export will be a custom worker constructor:

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker'

const worker = new MyWorker()
```

The worker script can also use ESM `import` statements instead of `importScripts()`. **Note**: During development this relies on [browser native support](https://caniuse.com/?search=module%20worker), but for the production build it is compiled away.

By default, the worker script will be emitted as a separate chunk in the production build. If you wish to inline the worker as base64 strings, add the `inline` query:

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker&inline'
```

If you wish to retrieve the worker as a URL, add the `url` query:

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker&url'
```

See [Worker Options](/config/worker-options.md) for details on configuring the bundling of all workers.

## Content Security Policy (CSP)

To deploy CSP, certain directives or configs must be set due to Vite's internals.

### [`'nonce-{RANDOM}'`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#nonce-base64-value)

When [`html.cspNonce`](/config/shared-options#html-cspnonce) is set, Vite adds a nonce attribute with the specified value to any `<script>` and `<style>` tags, as well as `<link>` tags for stylesheets and module preloading. Additionally, when this option is set, Vite will inject a meta tag (`<meta property="csp-nonce" nonce="PLACEHOLDER" />`).

The nonce value of a meta tag with `property="csp-nonce"` will be used by Vite whenever necessary during both dev and after build.

:::warning
Ensure that you replace the placeholder with a unique value for each request. This is important to prevent bypassing a resource's policy, which can otherwise be easily done.
:::

### [`data:`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#scheme-source:~:text=schemes%20\(not%20recommended\).-,data%3A,-Allows%20data%3A)

By default, during build, Vite inlines small assets as data URIs. Allowing `data:` for related directives (e.g. [`img-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/img-src), [`font-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/font-src)), or, disabling it by setting [`build.assetsInlineLimit: 0`](/config/build-options#build-assetsinlinelimit) is necessary.

:::warning
Do not allow `data:` for [`script-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src). It will allow injection of arbitrary scripts.
:::

## License

Vite can generate a file of all the dependencies' licenses used in the build with the [`build.license`](/config/build-options.md#build-license) option. It can be hosted to display and acknowledge the dependencies used by the app.

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    license: true,
  },
})
```

This will generate a `.vite/license.md` file with an output that may look like this:

```md
