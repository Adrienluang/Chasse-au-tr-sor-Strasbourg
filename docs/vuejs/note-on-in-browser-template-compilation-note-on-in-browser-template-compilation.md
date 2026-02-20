### Note on In-Browser Template Compilation {#note-on-in-browser-template-compilation}

When using Vue without a build step, component templates are written either directly in the page's HTML or as inlined JavaScript strings. In such cases, Vue needs to ship the template compiler to the browser in order to perform on-the-fly template compilation. On the other hand, the compiler would be unnecessary if we pre-compile the templates with a build step. To reduce client bundle size, Vue provides [different "builds"](https://unpkg.com/browse/vue@3/dist/) optimized for different use cases.

- Build files that start with `vue.runtime.*` are **runtime-only builds**: they do not include the compiler. When using these builds, all templates must be pre-compiled via a build step.

- Build files that do not include `.runtime` are **full builds**: they include the compiler and support compiling templates directly in the browser. However, they will increase the payload by ~14kb.

Our default tooling setups use the runtime-only build since all templates in SFCs are pre-compiled. If, for some reason, you need in-browser template compilation even with a build step, you can do so by configuring the build tool to alias `vue` to `vue/dist/vue.esm-bundler.js` instead.

If you are looking for a lighter-weight alternative for no-build-step usage, check out [petite-vue](https://github.com/vuejs/petite-vue).

## IDE Support {#ide-support}

- The recommended IDE setup is [VS Code](https://code.visualstudio.com/) + the [Vue - Official extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (previously Volar). The extension provides syntax highlighting, TypeScript support, and intellisense for template expressions and component props.

  :::tip
  Vue - Official replaces [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), our previous official VS Code extension for Vue 2. If you have Vetur currently installed, make sure to disable it in Vue 3 projects.
  :::

- [WebStorm](https://www.jetbrains.com/webstorm/) also provides great built-in support for Vue SFCs.

- Other IDEs that support the [Language Service Protocol](https://microsoft.github.io/language-server-protocol/) (LSP) can also leverage Volar's core functionalities via LSP:

  - Sublime Text support via [LSP-Volar](https://github.com/sublimelsp/LSP-volar).

  - vim / Neovim support via [coc-volar](https://github.com/yaegassy/coc-volar).

  - emacs support via [lsp-mode](https://emacs-lsp.github.io/lsp-mode/page/lsp-volar/)

## Browser Devtools {#browser-devtools}

The Vue browser devtools extension allows you to explore a Vue app's component tree, inspect the state of individual components, track state management events, and profile performance.

![devtools screenshot](./images/devtools.png)

- [Documentation](https://devtools.vuejs.org/)
- [Chrome Extension](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Vite Plugin](https://devtools.vuejs.org/guide/vite-plugin)
- [Standalone Electron app](https://devtools.vuejs.org/guide/standalone)

## TypeScript {#typescript}

Main article: [Using Vue with TypeScript](/guide/typescript/overview).

- [Vue - Official extension](https://github.com/vuejs/language-tools) provides type checking for SFCs using `<script lang="ts">` blocks, including template expressions and cross-component props validation.

- Use [`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/tsc) for performing the same type checking from the command line, or for generating `d.ts` files for SFCs.

## Testing {#testing}

Main article: [Testing Guide](/guide/scaling-up/testing).

- [Cypress](https://www.cypress.io/) is recommended for E2E tests. It can also be used for component testing for Vue SFCs via the [Cypress Component Test Runner](https://docs.cypress.io/guides/component-testing/introduction).

- [Vitest](https://vitest.dev/) is a test runner created by Vue / Vite team members that focuses on speed. It is specifically designed for Vite-based applications to provide the same instant feedback loop for unit / component testing.

- [Jest](https://jestjs.io/) can be made to work with Vite via [vite-jest](https://github.com/sodatea/vite-jest). However, this is only recommended if you have existing Jest-based test suites that you need to migrate over to a Vite-based setup, as Vitest provides similar functionalities with a much more efficient integration.

## Linting {#linting}

The Vue team maintains [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue), an [ESLint](https://eslint.org/) plugin that supports SFC-specific linting rules.

Users previously using Vue CLI may be used to having linters configured via webpack loaders. However when using a Vite-based build setup, our general recommendation is:

1. `npm install -D eslint eslint-plugin-vue`, then follow `eslint-plugin-vue`'s [configuration guide](https://eslint.vuejs.org/user-guide/#usage).

2. Setup ESLint IDE extensions, for example [ESLint for VS Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), so you get linter feedback right in your editor during development. This also avoids unnecessary linting cost when starting the dev server.

3. Run ESLint as part of the production build command, so you get full linter feedback before shipping to production.

4. (Optional) Setup tools like [lint-staged](https://github.com/okonet/lint-staged) to automatically lint modified files on git commit.

## Formatting {#formatting}

- The [Vue - Official](https://github.com/vuejs/language-tools) VS Code extension provides formatting for Vue SFCs out of the box.

- Alternatively, [Prettier](https://prettier.io/) provides built-in Vue SFC formatting support.

## SFC Custom Block Integrations {#sfc-custom-block-integrations}

Custom blocks are compiled into imports to the same Vue file with different request queries. It is up to the underlying build tool to handle these import requests.

- If using Vite, a custom Vite plugin should be used to transform matched custom blocks into executable JavaScript. [Example](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-transforming-custom-blocks)

- If using Vue CLI or plain webpack, a webpack loader should be configured to transform the matched blocks. [Example](https://vue-loader.vuejs.org/guide/custom-blocks.html)

## Lower-Level Packages {#lower-level-packages}
