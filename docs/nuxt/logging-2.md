# Logging

Nuxt provides a logger instance that you can use to log messages with extra features. `useLogger` allows you to get a logger instance.

## `useLogger`

Returns a logger instance. It uses [consola](https://github.com/unjs/consola){rel="&#x22;nofollow&#x22;"} under the hood.

### Usage

```ts twoslash
import { defineNuxtModule, useLogger } from '@nuxt/kit'

export default defineNuxtModule({
  setup (options, nuxt) {
    const logger = useLogger('my-module')

    logger.info('Hello from my module!')
  },
})
```

### Type

```ts
function useLogger (tag?: string, options?: Partial<ConsolaOptions>): ConsolaInstance
```

### Parameters

**`tag`**: A tag to suffix all log messages with, displayed on the right near the timestamp.

**`options`**: Consola configuration options.

### Examples

```ts twoslash
import { defineNuxtModule, useLogger } from '@nuxt/kit'

export default defineNuxtModule({
  setup (options, nuxt) {
    const logger = useLogger('my-module', { level: options.quiet ? 0 : 3 })

    logger.info('Hello from my module!')
  },
})
```
