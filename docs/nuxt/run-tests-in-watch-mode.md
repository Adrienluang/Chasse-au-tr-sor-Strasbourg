# Run tests in watch mode
npx vitest --watch
```

::warning
When you run your tests within the Nuxt environment, they will be running in a [`happy-dom`](https://github.com/capricorn86/happy-dom){rel=""nofollow""} or [`jsdom`](https://github.com/jsdom/jsdom){rel=""nofollow""} environment. Before your tests run, a global Nuxt app will be initialized (including, for example, running any plugins or code you've defined in your `app.vue`).

This means you should take particular care not to mutate the global state in your tests (or, if you need to, to reset it afterwards).
::

### 🎭 Built-In Mocks

`@nuxt/test-utils` provides some built-in mocks for the DOM environment.

#### `intersectionObserver`

Default `true`, creates a dummy class without any functionality for the IntersectionObserver API

#### `indexedDB`

Default `false`, uses [`fake-indexeddb`](https://github.com/dumbmatter/fakeIndexedDB){rel="&#x22;nofollow&#x22;"} to create a functional mock of the IndexedDB API

These can be configured in the `environmentOptions` section of your `vitest.config.ts` file:

```ts twoslash
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environmentOptions: {
      nuxt: {
        mock: {
          intersectionObserver: true,
          indexedDb: true,
        },
      },
    },
  },
})
```

### 🛠️ Helpers

`@nuxt/test-utils` provides a number of helpers to make testing Nuxt apps easier.

#### `mountSuspended`

`mountSuspended` allows you to mount any Vue component within the Nuxt environment, allowing async setup and access to injections from your Nuxt plugins.

::note
Under the hood, `mountSuspended` wraps `mount` from `@vue/test-utils`, so you can check out [the Vue Test Utils documentation](https://test-utils.vuejs.org/guide/){rel=""nofollow""} for more on the options you can pass, and how to use this utility.
::

For example:

```ts twoslash
// @noErrors
import { expect, it } from 'vitest'
import type { Component } from 'vue'

declare module '#components' {
  export const SomeComponent: Component
}
// ---cut---
// tests/components/SomeComponents.nuxt.spec.ts
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { SomeComponent } from '#components'

it('can mount some component', async () => {
  const component = await mountSuspended(SomeComponent)
  expect(component.text()).toMatchInlineSnapshot(
    '"This is an auto-imported component"',
  )
})
```

```ts twoslash
// @noErrors
import { expect, it } from 'vitest'
// ---cut---
// tests/components/SomeComponents.nuxt.spec.ts
import { mountSuspended } from '@nuxt/test-utils/runtime'
import App from '~/app.vue'

// tests/App.nuxt.spec.ts
it('can also mount an app', async () => {
  const component = await mountSuspended(App, { route: '/test' })
  expect(component.html()).toMatchInlineSnapshot(`
      "<div>This is an auto-imported component</div>
      <div> I am a global component </div>
      <div>/</div>
      <a href="/test"> Test link </a>"
    `)
})
```

#### `renderSuspended`

`renderSuspended` allows you to render any Vue component within the Nuxt environment using `@testing-library/vue`, allowing async setup and access to injections from your Nuxt plugins.

This should be used together with utilities from Testing Library, e.g. `screen` and `fireEvent`. Install [@testing-library/vue](https://testing-library.com/docs/vue-testing-library/intro/){rel="&#x22;nofollow&#x22;"} in your project to use these.

Additionally, Testing Library also relies on testing globals for cleanup. You should turn these on in your [Vitest config](https://vitest.dev/config/globals){rel="&#x22;nofollow&#x22;"}.

The passed in component will be rendered inside a `<div id="test-wrapper"></div>`.

Examples:

```ts twoslash
// @noErrors
import { expect, it } from 'vitest'
import type { Component } from 'vue'

declare module '#components' {
  export const SomeComponent: Component
}
// ---cut---
// tests/components/SomeComponents.nuxt.spec.ts
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { SomeComponent } from '#components'
import { screen } from '@testing-library/vue'

it('can render some component', async () => {
  await renderSuspended(SomeComponent)
  expect(screen.getByText('This is an auto-imported component')).toBeDefined()
})
```

```ts twoslash
// @noErrors
import { expect, it } from 'vitest'
// ---cut---
// tests/App.nuxt.spec.ts
import { renderSuspended } from '@nuxt/test-utils/runtime'
import App from '~/app.vue'

it('can also render an app', async () => {
  const html = await renderSuspended(App, { route: '/test' })
  expect(html).toMatchInlineSnapshot(`
    "<div id="test-wrapper">
      <div>This is an auto-imported component</div>
      <div> I am a global component </div>
      <div>Index page</div><a href="/test"> Test link </a>
    </div>"
  `)
})
```

#### `mockNuxtImport`

`mockNuxtImport` allows you to mock Nuxt's auto import functionality. For example, to mock `useStorage`, you can do so like this:

```ts twoslash
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

mockNuxtImport('useStorage', () => {
  return () => {
    return { value: 'mocked storage' }
  }
})

// your tests here
```

::note
`mockNuxtImport` can only be used once per mocked import per test file. It is actually a macro that gets transformed to `vi.mock` and `vi.mock` is hoisted, as described [in the Vitest docs](https://vitest.dev/api/vi#vi-mock){rel=""nofollow""}.
::

If you need to mock a Nuxt import and provide different implementations between tests, you can do it by creating and exposing your mocks using [`vi.hoisted`](https://vitest.dev/api/vi#vi-hoisted){rel="&#x22;nofollow&#x22;"}, and then use those mocks in `mockNuxtImport`. You then have access to the mocked imports, and can change the implementation between tests. Be careful to [restore mocks](https://vitest.dev/api/mock#mockrestore){rel="&#x22;nofollow&#x22;"} before or after each test to undo mock state changes between runs.

```ts twoslash
import { vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const { useStorageMock } = vi.hoisted(() => {
  return {
    useStorageMock: vi.fn(() => {
      return { value: 'mocked storage' }
    }),
  }
})

mockNuxtImport('useStorage', () => {
  return useStorageMock
})

// Then, inside a test
useStorageMock.mockImplementation(() => {
  return { value: 'something else' }
})
```

#### `mockComponent`

`mockComponent` allows you to mock Nuxt's component.
The first argument can be the component name in PascalCase, or the relative path of the component.
The second argument is a factory function that returns the mocked component.

For example, to mock `MyComponent`, you can:

```ts twoslash
import { mockComponent } from '@nuxt/test-utils/runtime'

mockComponent('MyComponent', {
  props: {
    value: String,
  },
  setup (props) {
    // ...
  },
})

// relative path or alias also works
mockComponent('~/components/my-component.vue', () => {
  // or a factory function
  return defineComponent({
    setup (props) {
      // ...
    },
  })
})

// or you can use SFC for redirecting to a mock component
mockComponent('MyComponent', () => import('./MockComponent.vue'))

// your tests here
```

> **Note**: You can't reference local variables in the factory function since they are hoisted. If you need to access Vue APIs or other variables, you need to import them in your factory function.

```ts twoslash
import { mockComponent } from '@nuxt/test-utils/runtime'

mockComponent('MyComponent', async () => {
  const { ref, h } = await import('vue')

  return defineComponent({
    setup (props) {
      const counter = ref(0)
      return () => h('div', null, counter.value)
    },
  })
})
```

#### `registerEndpoint`

`registerEndpoint` allows you create Nitro endpoint that returns mocked data. It can come in handy if you want to test a component that makes requests to API to display some data.

The first argument is the endpoint name (e.g. `/test/`).
The second argument is a factory function that returns the mocked data.

For example, to mock `/test/` endpoint, you can do:

```ts twoslash
import { registerEndpoint } from '@nuxt/test-utils/runtime'

registerEndpoint('/test/', () => ({
  test: 'test-field',
}))
```

By default, your request will be made using the `GET` method. You may use another method by setting an object as the second argument instead of a function.

```ts twoslash
import { registerEndpoint } from '@nuxt/test-utils/runtime'

registerEndpoint('/test/', {
  method: 'POST',
  handler: () => ({ test: 'test-field' }),
})
```

> **Note**: If your requests in a component go to an external API, you can use `baseURL` and then make it empty using [Nuxt Environment Override Config](https://nuxt.com/docs/4.x/getting-started/configuration#environment-overrides) (`$test`) so all your requests will go to Nitro server.

#### Conflict with End-To-End Testing

`@nuxt/test-utils/runtime` and `@nuxt/test-utils/e2e` need to run in different testing environments and so can't be used in the same file.

If you would like to use both the end-to-end and unit testing functionality of `@nuxt/test-utils`, you can split your tests into separate files. You then either specify a test environment per-file with the special `// @vitest-environment nuxt` comment, or name your runtime unit test files with the `.nuxt.spec.ts` extension.

`app.nuxt.spec.ts`

```ts twoslash
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

mockNuxtImport('useStorage', () => {
  return () => {
    return { value: 'mocked storage' }
  }
})
```

`app.e2e.spec.ts`

```ts twoslash
import { $fetch, setup } from '@nuxt/test-utils/e2e'

await setup({
  setupTimeout: 10000,
})

// ...
```

### Using `@vue/test-utils`

If you prefer to use `@vue/test-utils` on its own for unit testing in Nuxt, and you are only testing components which do not rely on Nuxt composables, auto-imports or context, you can follow these steps to set it up.

1. Install the needed dependencies :code-group[```bash \[npm\]
   npm i --save-dev vitest @vue/test-utils happy-dom @vitejs/plugin-vue
   ``````bash \[yarn\]
   yarn add --dev vitest @vue/test-utils happy-dom @vitejs/plugin-vue
   ``````bash \[pnpm\]
   pnpm add -D vitest @vue/test-utils happy-dom @vitejs/plugin-vue
   ``````bash \[bun\]
   bun add --dev vitest @vue/test-utils happy-dom @vitejs/plugin-vue
   ```]{sync="pm"}
2. Create a `vitest.config.ts` with the following content:
   ```ts
   import { defineConfig } from 'vitest/config'
   import vue from '@vitejs/plugin-vue'

   export default defineConfig({
     plugins: [vue()],
     test: {
       environment: 'happy-dom',
     },
   })
   ```
3. Add a new command for test in your `package.json`
   ```json
   "scripts": {
     "build": "nuxt build",
     "dev": "nuxt dev",
     ...
     "test": "vitest"
   },
   ```
4. Create a simple `<HelloWorld>` component `app/components/HelloWorld.vue` with the following content:
   ```vue
   <template>
     <p>Hello world</p>
   </template>
   ```
5. Create a simple unit test for this newly created component `~/components/HelloWorld.spec.ts`
   ```ts twoslash
   import { describe, expect, it } from 'vitest'
   import { mount } from '@vue/test-utils'

   import HelloWorld from './HelloWorld.vue'

   describe('HelloWorld', () => {
     it('component renders Hello world properly', () => {
       const wrapper = mount(HelloWorld)
       expect(wrapper.text()).toContain('Hello world')
     })
   })
   ```
6. Run vitest command :code-group[```bash \[npm\]
   npm run test
   ``````bash \[yarn\]
   yarn test
   ``````bash \[pnpm\]
   pnpm run test
   ``````bash \[bun\]
   bun run test
   ```]{sync="pm"}

Congratulations, you're all set to start unit testing with `@vue/test-utils` in Nuxt! Happy testing!

## End-To-End Testing

For end-to-end testing, we support [Vitest](https://github.com/vitest-dev/vitest){rel="&#x22;nofollow&#x22;"}, [Jest](https://jestjs.io){rel="&#x22;nofollow&#x22;"}, [Cucumber](https://cucumber.io/){rel="&#x22;nofollow&#x22;"} and [Playwright](https://playwright.dev/){rel="&#x22;nofollow&#x22;"} as test runners.

### Setup

In each `describe` block where you are taking advantage of the `@nuxt/test-utils/e2e` helper methods, you will need to set up the test context before beginning.

```ts [test/my-test.spec.ts] twoslash
import { describe, test } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('My test', async () => {
  await setup({
    // test context options
  })

  test('my test', () => {
    // ...
  })
})
```

Behind the scenes, `setup` performs a number of tasks in `beforeAll`, `beforeEach`, `afterEach` and `afterAll` to set up the Nuxt test environment correctly.

Please use the options below for the `setup` method.

#### Nuxt Config

- `rootDir`: Path to a directory with a Nuxt app to be put under test.
  - Type: `string`
  - Default: `'.'`
- `configFile`: Name of the configuration file.
  - Type: `string`
  - Default: `'nuxt.config'`

#### Timings

- `setupTimeout`: The amount of time (in milliseconds) to allow for `setupTest` to complete its work (which could include building or generating files for a Nuxt application, depending on the options that are passed).
  - Type: `number`
  - Default: `120000` or `240000` on windows
- `teardownTimeout`: The amount of time (in milliseconds) to allow tearing down the test environment, such as closing the browser.
  - Type: `number`
  - Default: `30000`

#### Features

- `build`: Whether to run a separate build step.
  - Type: `boolean`
  - Default: `true` (`false` if `browser` or `server` is disabled, or if a `host` is provided)
- `server`: Whether to launch a server to respond to requests in the test suite.
  - Type: `boolean`
  - Default: `true` (`false` if a `host` is provided)
- `port`: If provided, set the launched test server port to the value.
  - Type: `number | undefined`
  - Default: `undefined`
- `host`: If provided, a URL to use as the test target instead of building and running a new server. Useful for running "real" end-to-end tests against a deployed version of your application, or against an already running local server (which may provide a significant reduction in test execution timings). See the [target host end-to-end example below](https://nuxt.com/docs/4.x/getting-started/testing#target-host-end-to-end-example).
  - Type: `string`
  - Default: `undefined`
- `browser`: Under the hood, Nuxt test utils uses [`playwright`](https://playwright.dev){rel="&#x22;nofollow&#x22;"} to carry out browser testing. If this option is set, a browser will be launched and can be controlled in the subsequent test suite.
  - Type: `boolean`
  - Default: `false`
- `browserOptions`
  - Type: `object`with the following properties
    - `type`: The type of browser to launch - either `chromium`, `firefox` or `webkit`
    - `launch`: `object` of options that will be passed to playwright when launching the browser. See [full API reference](https://playwright.dev/docs/api/class-browsertype#browser-type-launch){rel="&#x22;nofollow&#x22;"}.
- `runner`: Specify the runner for the test suite. Currently, [Vitest](https://vitest.dev){rel="&#x22;nofollow&#x22;"} is recommended.
  - Type: `'vitest' | 'jest' | 'cucumber'`
  - Default: `'vitest'`

##### Target `host` end-to-end example

A common use-case for end-to-end testing is running the tests against a deployed application running in the same environment typically used for Production.

For local development or automated deploy pipelines, testing against a separate local server can be more efficient and is typically faster than allowing the test framework to rebuild between tests.

To utilize a separate target host for end-to-end tests, simply provide the `host` property of the `setup` function with the desired URL.

```ts
import { createPage, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('login page', async () => {
  await setup({
    host: 'http://localhost:8787',
  })

  it('displays the email and password fields', async () => {
    const page = await createPage('/login')
    expect(await page.getByTestId('email').isVisible()).toBe(true)
    expect(await page.getByTestId('password').isVisible()).toBe(true)
  })
})
```

### APIs

#### `$fetch(url)`

Get the HTML of a server-rendered page.

```ts twoslash
import { $fetch } from '@nuxt/test-utils/e2e'

const html = await $fetch('/')
```

#### `fetch(url)`

Get the response of a server-rendered page.

```ts twoslash
import { fetch } from '@nuxt/test-utils/e2e'

const res = await fetch('/')
const { body, headers } = res
```

#### `url(path)`

Get the full URL for a given page (including the port the test server is running on.)

```ts twoslash
import { url } from '@nuxt/test-utils/e2e'

const pageUrl = url('/page')
// 'http://localhost:6840/page'
```

### Testing in a Browser

We provide built-in support using Playwright within `@nuxt/test-utils`, either programmatically or via the Playwright test runner.

#### `createPage(url)`

Within `vitest`, `jest` or `cucumber`, you can create a configured Playwright browser instance with `createPage`, and (optionally) point it at a path from the running server. You can find out more about the API methods available from [in the Playwright documentation](https://playwright.dev/docs/api/class-page){rel="&#x22;nofollow&#x22;"}.

```ts twoslash
import { createPage } from '@nuxt/test-utils/e2e'

const page = await createPage('/page')
// you can access all the Playwright APIs from the `page` variable
```

#### Testing with Playwright Test Runner

We also provide first-class support for testing Nuxt within [the Playwright test runner](https://playwright.dev/docs/intro){rel="&#x22;nofollow&#x22;"}.

::code-group{sync="pm"}
```bash [npm]
npm i --save-dev @playwright/test @nuxt/test-utils
```

```bash [yarn]
yarn add --dev @playwright/test @nuxt/test-utils
```

```bash [pnpm]
pnpm add -D @playwright/test @nuxt/test-utils
```

```bash [bun]
bun add --dev @playwright/test @nuxt/test-utils
```

```bash [deno]
deno add --dev npm:@playwright/test npm:@nuxt/test-utils
```
::

You can provide global Nuxt configuration, with the same configuration details as the `setup()` function mentioned earlier in this section.

```ts [playwright.config.ts]
import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'
import type { ConfigOptions } from '@nuxt/test-utils/playwright'

export default defineConfig<ConfigOptions>({
  use: {
    nuxt: {
      rootDir: fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  // ...
})
```

:read-more{target="_blank" title="See full example config" to="https://github.com/nuxt/test-utils/blob/main/examples/app-playwright/playwright.config.ts"}

Your test file should then use `expect` and `test` directly from `@nuxt/test-utils/playwright`:

```ts [tests/example.test.ts]
import { expect, test } from '@nuxt/test-utils/playwright'

test('test', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  await expect(page.getByRole('heading')).toHaveText('Welcome to Playwright!')
})
```

You can alternatively configure your Nuxt server directly within your test file:

```ts [tests/example.test.ts]
import { expect, test } from '@nuxt/test-utils/playwright'

test.use({
  nuxt: {
    rootDir: fileURLToPath(new URL('..', import.meta.url)),
  },
})

test('test', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  await expect(page.getByRole('heading')).toHaveText('Welcome to Playwright!')
})
```
