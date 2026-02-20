# Features

At the very basic level, developing using Vite is not that different from using a static file server. However, Vite provides many enhancements over native ESM imports to support various features that are typically seen in bundler-based setups.

## npm Dependency Resolving and Pre-Bundling

Native ES imports do not support bare module imports like the following:

```js
import { someMethod } from 'my-dep'
```

The above will throw an error in the browser. Vite will detect such bare module imports in all served source files and perform the following:

1. [Pre-bundle](./dep-pre-bundling) them to improve page loading speed and convert CommonJS / UMD modules to ESM. The pre-bundling step is performed with [esbuild](http://esbuild.github.io/) and makes Vite's cold start time significantly faster than any JavaScript-based bundler.

2. Rewrite the imports to valid URLs like `/node_modules/.vite/deps/my-dep.js?v=f3sf2ebd` so that the browser can import them properly.

**Dependencies are Strongly Cached**

Vite caches dependency requests via HTTP headers, so if you wish to locally edit/debug a dependency, follow the steps [here](./dep-pre-bundling#browser-cache).

## Hot Module Replacement

Vite provides an [HMR API](./api-hmr) over native ESM. Frameworks with HMR capabilities can leverage the API to provide instant, precise updates without reloading the page or blowing away application state. Vite provides first-party HMR integrations for [Vue Single File Components](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue) and [React Fast Refresh](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react). There are also official integrations for Preact via [@prefresh/vite](https://github.com/JoviDeCroock/prefresh/tree/main/packages/vite).

Note you don't need to manually set these up - when you [create an app via `create-vite`](./), the selected templates would have these pre-configured for you already.

## TypeScript

Vite supports importing `.ts` files out of the box.

### Transpile Only

Note that Vite only performs transpilation on `.ts` files and does **NOT** perform type checking. It assumes type checking is taken care of by your IDE and build process.

The reason Vite does not perform type checking as part of the transform process is because the two jobs work fundamentally differently. Transpilation can work on a per-file basis and aligns perfectly with Vite's on-demand compile model. In comparison, type checking requires knowledge of the entire module graph. Shoe-horning type checking into Vite's transform pipeline will inevitably compromise Vite's speed benefits.

Vite's job is to get your source modules into a form that can run in the browser as fast as possible. To that end, we recommend separating static analysis checks from Vite's transform pipeline. This principle applies to other static analysis checks such as ESLint.

* For production builds, you can run `tsc --noEmit` in addition to Vite's build command.

* During development, if you need more than IDE hints, we recommend running `tsc --noEmit --watch` in a separate process, or use [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) if you prefer having type errors directly reported in the browser.

Vite uses [esbuild](https://github.com/evanw/esbuild) to transpile TypeScript into JavaScript which is about 20~30x faster than vanilla `tsc`, and HMR updates can reflect in the browser in under 50ms.

Use the [Type-Only Imports and Export](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export) syntax to avoid potential problems like type-only imports being incorrectly bundled, for example:

```ts
import type { T } from 'only/types'
export type { T }
```

### TypeScript Compiler Options

Vite respects some of the options in `tsconfig.json` and sets the corresponding esbuild options. For each file, Vite uses the `tsconfig.json` in the closest parent directory. If that `tsconfig.json` contains a [`references`](https://www.typescriptlang.org/tsconfig/#references) field, Vite will use the referenced config file that satisfies the [`include`](https://www.typescriptlang.org/tsconfig/#include) and [`exclude`](https://www.typescriptlang.org/tsconfig/#exclude) fields.

When the options are set in both the Vite config and the `tsconfig.json`, the value in the Vite config takes precedence.

Some configuration fields under `compilerOptions` in `tsconfig.json` require special attention.

#### `isolatedModules`

* [TypeScript documentation](https://www.typescriptlang.org/tsconfig#isolatedModules)

Should be set to `true`.

It is because `esbuild` only performs transpilation without type information, it doesn't support certain features like const enum and implicit type-only imports.

You must set `"isolatedModules": true` in your `tsconfig.json` under `compilerOptions`, so that TS will warn you against the features that do not work with isolated transpilation.

If a dependency doesn't work well with `"isolatedModules": true`. You can use `"skipLibCheck": true` to temporarily suppress the errors until it is fixed upstream.

#### `useDefineForClassFields`

* [TypeScript documentation](https://www.typescriptlang.org/tsconfig#useDefineForClassFields)

The default value will be `true` if the TypeScript target is `ES2022` or newer including `ESNext`. It is consistent with the [behavior of TypeScript 4.3.2+](https://github.com/microsoft/TypeScript/pull/42663).
Other TypeScript targets will default to `false`.

`true` is the standard ECMAScript runtime behavior.

If you are using a library that heavily relies on class fields, please be careful about the library's intended usage of it.
While most libraries expect `"useDefineForClassFields": true`, you can explicitly set `useDefineForClassFields` to `false` if your library doesn't support it.

#### `target`

* [TypeScript documentation](https://www.typescriptlang.org/tsconfig#target)

Vite ignores the `target` value in the `tsconfig.json`, following the same behavior as `esbuild`.

To specify the target in dev, the [`esbuild.target`](/config/shared-options.html#esbuild) option can be used, which defaults to `esnext` for minimal transpilation. In builds, the [`build.target`](/config/build-options.html#build-target) option takes higher priority over `esbuild.target` and can also be set if needed.

::: warning `useDefineForClassFields`

If `target` in `tsconfig.json` is not `ESNext` or `ES2022` or newer, or if there's no `tsconfig.json` file, `useDefineForClassFields` will default to `false` which can be problematic with the default `esbuild.target` value of `esnext`. It may transpile to [static initialization blocks](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks#browser_compatibility) which may not be supported in your browser.

As such, it is recommended to set `target` to `ESNext` or `ES2022` or newer, or set `useDefineForClassFields` to `true` explicitly when configuring `tsconfig.json`.
:::

#### Other Compiler Options Affecting the Build Result

* [`extends`](https://www.typescriptlang.org/tsconfig#extends)
* [`importsNotUsedAsValues`](https://www.typescriptlang.org/tsconfig#importsNotUsedAsValues)
* [`preserveValueImports`](https://www.typescriptlang.org/tsconfig#preserveValueImports)
* [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax)
* [`jsx`](https://www.typescriptlang.org/tsconfig#jsx)
* [`jsxFactory`](https://www.typescriptlang.org/tsconfig#jsxFactory)
* [`jsxFragmentFactory`](https://www.typescriptlang.org/tsconfig#jsxFragmentFactory)
* [`jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource)
* [`experimentalDecorators`](https://www.typescriptlang.org/tsconfig#experimentalDecorators)
* [`alwaysStrict`](https://www.typescriptlang.org/tsconfig#alwaysStrict)

::: tip `skipLibCheck`
Vite starter templates have `"skipLibCheck": "true"` by default to avoid typechecking dependencies, as they may choose to only support specific versions and configurations of TypeScript. You can learn more at [vuejs/vue-cli#5688](https://github.com/vuejs/vue-cli/pull/5688).
:::

### Client Types

Vite's default types are for its Node.js API. To shim the environment of client-side code in a Vite application, you can add `vite/client` to `compilerOptions.types` inside `tsconfig.json`:

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["vite/client", "some-other-global-lib"]
  }
}
```

Note that if [`compilerOptions.types`](https://www.typescriptlang.org/tsconfig#types) is specified, only these packages will be included in the global scope (instead of all visible ”@types” packages). This is recommended since TS 5.9.

::: details Using triple-slash directive

Alternatively, you can add a `d.ts` declaration file:

```typescript [vite-env.d.ts]
/// <reference types="vite/client" />
```

:::

`vite/client` provides the following type shims:

* Asset imports (e.g. importing an `.svg` file)
* Types for the Vite-injected [constants](./env-and-mode#env-variables) on `import.meta.env`
* Types for the [HMR API](./api-hmr) on `import.meta.hot`

::: tip
To override the default typing, add a type definition file that contains your typings. Then, add the type reference before `vite/client`.

For example, to make the default import of `*.svg` a React component:

* `vite-env-override.d.ts` (the file that contains your typings):
  ```ts
  declare module '*.svg' {
    const content: React.FC<React.SVGProps<SVGElement>>
    export default content
  }
  ```
* If you are using `compilerOptions.types`, ensure the file is included in `tsconfig.json`:
  ```json [tsconfig.json]
  {
    "include": ["src", "./vite-env-override.d.ts"]
  }
  ```
* If you are using triple-slash directives, update the file containing the reference to `vite/client` (normally `vite-env.d.ts`):
  ```ts
  /// <reference types="./vite-env-override.d.ts" />
  /// <reference types="vite/client" />
  ```

:::

## HTML

HTML files stand [front-and-center](/guide/#index-html-and-project-root) of a Vite project, serving as the entry points for your application, making it simple to build single-page and [multi-page applications](/guide/build.html#multi-page-app).

Any HTML files in your project root can be directly accessed by its respective directory path:

* `<root>/index.html` -> `http://localhost:5173/`
* `<root>/about.html` -> `http://localhost:5173/about.html`
* `<root>/blog/index.html` -> `http://localhost:5173/blog/index.html`

Assets referenced by HTML elements such as `<script type="module" src>` and `<link href>` are processed and bundled as part of the app. The full list of supported elements are as below:

* `<audio src>`
* `<embed src>`
* `<img src>` and `<img srcset>`
* `<image href>` and `<image xlink:href>`
* `<input src>`
* `<link href>` and `<link imagesrcset>`
* `<object data>`
* `<script type="module" src>`
* `<source src>` and `<source srcset>`
* `<track src>`
* `<use href>` and `<use xlink:href>`
* `<video src>` and `<video poster>`
* `<meta content>`
  * Only if `name` attribute matches `msapplication-tileimage`, `msapplication-square70x70logo`, `msapplication-square150x150logo`, `msapplication-wide310x150logo`, `msapplication-square310x310logo`, `msapplication-config`, or `twitter:image`
  * Or only if `property` attribute matches `og:image`, `og:image:url`, `og:image:secure_url`, `og:audio`, `og:audio:secure_url`, `og:video`, or `og:video:secure_url`

```html {4-5,8-9}
<!doctype html>
<html>
  <head>
    <link rel="icon" href="/favicon.ico" />
    <link rel="stylesheet" href="/src/styles.css" />
  </head>
  <body>
    <img src="/src/images/logo.svg" alt="logo" />
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

To opt-out of HTML processing on certain elements, you can add the `vite-ignore` attribute on the element, which can be useful when referencing external assets or CDN.

## Frameworks

All modern frameworks maintain integrations with Vite. Most framework plugins are maintained by each framework team, with the exception of the official Vue and React Vite plugins that are maintained in the vite org:

* Vue support via [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)
* Vue JSX support via [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)
* React support via [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react)
* React using SWC support via [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react-swc)
* [React Server Components (RSC)](https://react.dev/reference/rsc/server-components) support via [@vitejs/plugin-rsc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-rsc)

Check out the [Plugins Guide](/plugins/) for more information.

## JSX

`.jsx` and `.tsx` files are also supported out of the box. JSX transpilation is also handled via [esbuild](https://esbuild.github.io).

Your framework of choice will already configure JSX out of the box (for example, Vue users should use the official [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx) plugin, which provides Vue 3 specific features including HMR, global component resolving, directives and slots).

If using JSX with your own framework, custom `jsxFactory` and `jsxFragment` can be configured using the [`esbuild` option](/config/shared-options.md#esbuild). For example, the Preact plugin would use:

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
})
```

More details in [esbuild docs](https://esbuild.github.io/content-types/#jsx).

You can inject the JSX helpers using `jsxInject` (which is a Vite-only option) to avoid manual imports:

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
})
```

## CSS

Importing `.css` files will inject its content to the page via a `<style>` tag with HMR support.

### `@import` Inlining and Rebasing

Vite is pre-configured to support CSS `@import` inlining via `postcss-import`. Vite aliases are also respected for CSS `@import`. In addition, all CSS `url()` references, even if the imported files are in different directories, are always automatically rebased to ensure correctness.

`@import` aliases and URL rebasing are also supported for Sass and Less files (see [CSS Pre-processors](#css-pre-processors)).

### PostCSS

If the project contains valid PostCSS config (any format supported by [postcss-load-config](https://github.com/postcss/postcss-load-config), e.g. `postcss.config.js`), it will be automatically applied to all imported CSS.

Note that CSS minification will run after PostCSS and will use [`build.cssTarget`](/config/build-options.md#build-csstarget) option.

### CSS Modules

Any CSS file ending with `.module.css` is considered a [CSS modules file](https://github.com/css-modules/css-modules). Importing such a file will return the corresponding module object:

```css [example.module.css]
.red {
  color: red;
}
```

```js twoslash
import 'vite/client'
// ---cut---
import classes from './example.module.css'
document.getElementById('foo').className = classes.red
```

CSS modules behavior can be configured via the [`css.modules` option](/config/shared-options.md#css-modules).

If `css.modules.localsConvention` is set to enable camelCase locals (e.g. `localsConvention: 'camelCaseOnly'`), you can also use named imports:

```js twoslash
import 'vite/client'
// ---cut---
// .apply-color -> applyColor
import { applyColor } from './example.module.css'
document.getElementById('foo').className = applyColor
```

### CSS Pre-processors

Because Vite targets modern browsers only, it is recommended to use native CSS variables with PostCSS plugins that implement CSSWG drafts (e.g. [postcss-nesting](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting)) and author plain, future-standards-compliant CSS.

That said, Vite does provide built-in support for `.scss`, `.sass`, `.less`, `.styl` and `.stylus` files. There is no need to install Vite-specific plugins for them, but the corresponding pre-processor itself must be installed:

```bash
