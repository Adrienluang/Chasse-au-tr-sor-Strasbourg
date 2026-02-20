# Programmatic Usage

Programmatic usage can be helpful when you want to use Nuxt programmatically, for example, when building a [CLI tool](https://github.com/nuxt/cli){rel="&#x22;nofollow&#x22;"} or [test utils](https://github.com/nuxt/test-utils){rel="&#x22;nofollow&#x22;"}.

## `loadNuxt`

Load Nuxt programmatically. It will load the Nuxt configuration, instantiate and return the promise with Nuxt instance.

### Type

```ts
function loadNuxt (loadOptions?: LoadNuxtOptions): Promise<Nuxt>
```

### Parameters

**`loadOptions`**: Loading conditions for Nuxt. `loadNuxt` uses [`c12`](https://github.com/unjs/c12){rel="&#x22;nofollow&#x22;"} under the hood, so it accepts the same options as `c12.loadConfig` with some additional options:

| Property | Type      | Required | Description                                                                                                                                                       |
| -------- | --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dev`    | `boolean` | `false`  | If set to `true`, Nuxt will be loaded in development mode.                                                                                                        |
| `ready`  | `boolean` | `true`   | If set to `true`, Nuxt will be ready to use after the `loadNuxt` call. If set to `false`, you will need to call `nuxt.ready()` to make sure Nuxt is ready to use. |

## `buildNuxt`

Build Nuxt programmatically. It will invoke the builder (currently [@nuxt/vite-builder](https://github.com/nuxt/nuxt/tree/main/packages/vite){rel="&#x22;nofollow&#x22;"} or [@nuxt/webpack-builder](https://github.com/nuxt/nuxt/tree/main/packages/webpack){rel="&#x22;nofollow&#x22;"}) to bundle the application.

### Type

```ts
function buildNuxt (nuxt: Nuxt): Promise<any>
```

### Parameters

**`nuxt`**: Nuxt instance to build. It can be retrieved from the context via `useNuxt()` call.

## `loadNuxtConfig`

Load Nuxt configuration. It will return the promise with the configuration object.

### Type

```ts
function loadNuxtConfig (options: LoadNuxtConfigOptions): Promise<NuxtOptions>
```

### Parameters

**`options`**: Options to pass in [`c12`](https://github.com/unjs/c12#options){rel="&#x22;nofollow&#x22;"} `loadConfig` call.

## `writeTypes`

Generates `tsconfig.json` and writes it to the project buildDir.

### Type

```ts
function writeTypes (nuxt?: Nuxt): void
```

### Parameters

**`nuxt`**: Nuxt instance to build. It can be retrieved from the context via `useNuxt()` call.
