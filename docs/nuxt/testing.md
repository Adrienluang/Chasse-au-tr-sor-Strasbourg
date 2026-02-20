# Testing

::tip
If you are a module author, you can find more specific information in the [Module Author's guide](https://nuxt.com/docs/4.x/guide/modules/testing).
::

Nuxt offers first-class support for end-to-end and unit testing of your Nuxt application via `@nuxt/test-utils`, a library of test utilities and configuration that currently powers the [tests we use on Nuxt itself](https://github.com/nuxt/nuxt/tree/main/test){rel="&#x22;nofollow&#x22;"} and tests throughout the module ecosystem.

:video-accordion{title="Watch a video from Alexander Lichter about getting started with @nuxt/test-utils" video-id="yGzwk9xi9gU"}

## Installation

In order to allow you to manage your other testing dependencies, `@nuxt/test-utils` ships with various optional peer dependencies. For example:

- you can choose between `happy-dom` and `jsdom` for a runtime Nuxt environment
- you can choose between `vitest`, `cucumber`, `jest` and `playwright` for end-to-end test runners
- `playwright-core` is only required if you wish to use the built-in browser testing utilities (and are not using `@playwright/test` as your test runner)

::code-group{sync="pm"}
```bash [npm]
npm i --save-dev @nuxt/test-utils vitest @vue/test-utils happy-dom playwright-core
```

```bash [yarn]
yarn add --dev @nuxt/test-utils vitest @vue/test-utils happy-dom playwright-core
```

```bash [pnpm]
pnpm add -D @nuxt/test-utils vitest @vue/test-utils happy-dom playwright-core
```

```bash [bun]
bun add --dev @nuxt/test-utils vitest @vue/test-utils happy-dom playwright-core
```
::

## Unit Testing

We currently ship an environment for unit testing code that needs a [Nuxt](https://nuxt.com){rel="&#x22;nofollow&#x22;"} runtime environment. It currently &#x2A;only has support for `vitest`* (although contribution to add other runtimes would be welcome).

### Setup

1. Add `@nuxt/test-utils/module` to your `nuxt.config` file (optional). It adds a Vitest integration to your Nuxt DevTools which supports running your unit tests in development.
   ```ts twoslash
   export default defineNuxtConfig({
     modules: [
       '@nuxt/test-utils/module',
     ],
   })
   ```
2. Create a `vitest.config.ts` with the following content:
   ```ts twoslash
   import { defineConfig } from 'vitest/config'
   import { defineVitestProject } from '@nuxt/test-utils/config'

   export default defineConfig({
     test: {
       projects: [
         {
           test: {
             name: 'unit',
             include: ['test/unit/*.{test,spec}.ts'],
             environment: 'node',
           },
         },
         {
           test: {
             name: 'e2e',
             include: ['test/e2e/*.{test,spec}.ts'],
             environment: 'node',
           },
         },
         await defineVitestProject({
           test: {
             name: 'nuxt',
             include: ['test/nuxt/*.{test,spec}.ts'],
             environment: 'nuxt',
           },
         }),
       ],
     },
   })
   ```

::tip
When importing `@nuxt/test-utils` in your vitest config, It is necessary to have `"type": "module"` specified in your `package.json` or rename your vitest config file appropriately.

> i.e., `vitest.config.m{ts,js}`.
::

::tip
It is possible to set environment variables for testing by using the `.env.test` file.
::

### Using a Nuxt Runtime Environment

Using [Vitest projects](https://vitest.dev/guide/projects.html#test-projects){rel="&#x22;nofollow&#x22;"}, you have fine-grained control over which tests run in which environment:

- **Unit tests**: Place regular unit tests in `test/unit/` - these run in a Node environment for speed
- **Nuxt tests**: Place tests that rely on the Nuxt runtime environment in `test/nuxt/` - these will run within a Nuxt runtime environment

#### Alternative: Simple Setup

If you prefer a simpler setup and want all tests to run in the Nuxt environment, you can use the basic configuration:

```ts twoslash
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    // you can optionally set Nuxt-specific environment options
    // environmentOptions: {
    //   nuxt: {
    //     rootDir: fileURLToPath(new URL('./playground', import.meta.url)),
    //     domEnvironment: 'happy-dom', // 'happy-dom' (default) or 'jsdom'
    //     overrides: {
    //       // other Nuxt config you want to pass
    //     }
    //   }
    // }
  },
})
```

If you're using the simple setup with `environment: 'nuxt'` by default, you can opt *out* of the [Nuxt environment](https://vitest.dev/guide/environment.html#test-environment){rel="&#x22;nofollow&#x22;"} per test file as needed.

```ts twoslash
// @vitest-environment node
import { test } from 'vitest'

test('my test', () => {
  // ... test without Nuxt environment!
})
```

::warning
This approach is not recommended as it creates a hybrid environment where Nuxt Vite plugins run but the Nuxt entry and `nuxtApp` are not initialized. This can lead to hard-to-debug errors.
::

### Organizing Your Tests

With the project-based setup, you might organize your tests as follows:

```bash [Directory structure]
test/
├── e2e/
│   └── ssr.test.ts
├── nuxt/
│   ├── components.test.ts
│   └── composables.test.ts
├── unit/
│   └── utils.test.ts
```

You can of course opt for any test structure, but keeping the Nuxt runtime environment separated from Nuxt end-to-end tests is important for test stability.

#### TypeScript Support in Tests

By default, test files in `test/nuxt/` and `tests/nuxt/` directories are included in the [Nuxt app TypeScript context](https://nuxt.com/docs/4.x/guide/concepts/typescript#how-nuxt-uses-project-references). That means they will recognise Nuxt aliases (like `~/`, `@/`, `#imports`) and TypeScript will be aware of auto-imports that work in your Nuxt app.

::tip
This matches the recommended structure where only tests that need the Nuxt runtime environment are placed in these directories. Unit tests in other directories like `test/unit/` can be added manually if needed.
::

##### Adding other test directories

If you have tests in other directories that you will be running in the Nuxt Vitest environment, you can include them in the Nuxt app TypeScript context by adding them to your configuration:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  typescript: {
    tsConfig: {
      include: [
        // this path is relative to the generated .nuxt/tsconfig.json
        '../test/other-nuxt-context/**/*',
      ],
    },
  },
})
```

::important
Unit tests should not depend on Nuxt runtime features like auto-imports or composables. Only add TypeScript path alias support if your tests import from your source files (e.g., `~/utils/helpers`), not for Nuxt-specific features.
::

#### Running Tests

With the project setup, you can run different test suites:

```bash
