### iOS/iPad Splash Screens

PWA Assets Generator will generate iOS/iPad splash screens when explicitly defined in the preset: [iOS and iPadOS in web.dev](https://web.dev/learn/pwa/enhancements/#splash-screens).

You can use `createAppleSplashScreens` function to create the splash screens configuration using global configuration and the device names you want to generate the splash screens for.

If the device names are not provided in the `createAppleSplashScreens` function, PWA Assets Generator will generate splash screens for all devices (defined in the [splash](https://github.com/vite-pwa/assets-generator/blob/main/src/splash.ts) module).

PWA Assets Generator will generate the landscape and portrait PNG files per device. If you also want to generate the dark splash screens, you will end up with four PNG files per device.

For example, if you want to generate splash screens for `iPad Air 9.7"` device, you can use the following configuration (the values in the example are the default ones if you don't provide any configuration):

```ts
import {
  createAppleSplashScreens,
  defineConfig,
  minimal2023Preset
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: {
    preset: '2023'
  },
  preset: {
    ...minimal2023Preset,
    appleSplashScreens: createAppleSplashScreens({
      padding: 0.3,
      resizeOptions: { background: 'white', fit: 'contain' },
      // by default, dark splash screens are exluded
      // darkResizeOptions: { background: 'black' },
      linkMediaOptions: {
        // will log the links you need to add to your html pages
        log: true,
        // add screen to media attribute link?
        // by default:
        // <link rel="apple-touch-startup-image" href="..." media="screen and ...">
        addMediaScreen: true,
        basePath: '/',
        // add closing link tag?
        // by default:
        // <link rel="apple-touch-startup-image" href="..." media="...">
        // with xhtml enabled:
        // <link rel="apple-touch-startup-image" href="..." media="..." />
        xhtml: false
      },
      png: {
        compressionLevel: 9,
        quality: 60
      },
      name: (landscape, size, dark) => {
        return `apple-splash-${landscape ? 'landscape' : 'portrait'}-${typeof dark === 'boolean' ? (dark ? 'dark-' : 'light-') : ''}${size.width}x${size.height}.png`
      }
    }, ['iPad Air 9.7"'])
  },
  images: ['public/logo.svg']
})
```

You can also use `combinePresetAndAppleSplashScreens` to combine the preset and the splash screens configuration:

```ts
import {
  combinePresetAndAppleSplashScreens,
  defineConfig,
  minimal2023Preset
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: {
    preset: '2023'
  },
  preset: combinePresetAndAppleSplashScreens(
    minimal2023Preset,
    {
      padding: 0.3,
      resizeOptions: { background: 'white', fit: 'contain' },
      // by default, dark splash screens are exluded
      // darkResizeOptions: { background: 'black' },
      linkMediaOptions: {
        // will log the links you need to add to your html pages
        log: true,
        // add screen to media attribute link?
        // by default:
        // <link rel="apple-touch-startup-image" href="..." media="screen and ...">
        addMediaScreen: true,
        basePath: '/',
        // add closing link tag?
        // by default:
        // <link rel="apple-touch-startup-image" href="..." media="...">
        // with xhtml enabled:
        // <link rel="apple-touch-startup-image" href="..." media="..." />
        xhtml: false
      },
      png: {
        compressionLevel: 9,
        quality: 60
      },
      name: (landscape, size, dark) => {
        return `apple-splash-${landscape ? 'landscape' : 'portrait'}-${typeof dark === 'boolean' ? (dark ? 'dark-' : 'light-') : ''}${size.width}x${size.height}.png`
      }
    },
    ['iPad Air 9.7"']
  ),
  images: ['public/logo.svg']
})
```

#### Dark Splash Screens

If you also want to generate `dark` splash screens, you can provide an empty `darkResizeOptions` option (the generator will set `background: 'black'` and `'fit: 'contain'` if missing) or providing any other options. Following with the previous example:

```ts
import {
  combinePresetAndAppleSplashScreens,
  defineConfig,
  minimal2023Preset
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: {
    preset: '2023'
  },
  preset: combinePresetAndAppleSplashScreens(minimal2023Preset, {
    // dark splash screens using black background (the default)
    darkResizeOptions: { background: 'black', fit: 'contain' },
    // or using a custom background color
    // darkResizeOptions: { background: '#1f1f1f' },
  }, ['iPad Air 9.7"']),
  images: ['public/logo.svg']
})
```

#### Advanced Configuration

We strongly suggest using the global configuration, providing `padding`, `resizeOptions`, `darkResizeOptions` and `png` options globally, PWA Assets Generator will configure any splash screen device options properly.

If you still want to use a custom configuration per device, you can provide `padding`, `resizeOptions`, `darkResizeOptions` and `png` options per device, but you will need to configure them via some custom logic. You can use the following exports from the `config` module (check the [splash](https://github.com/vite-pwa/assets-generator/blob/main/src/splash.ts) module, all splash exports being exported also in the `@vite-pwa/assets-generator/config` module):

* `AppleDeviceName`: all Apple device names
* `appleSplashScreenSizes`: all Apple splash screen sizes including the scale factor
* `AllAppleDeviceNames`: all Apple device names as an array
* `createAppleSplashScreens`: the logic inside that function is quite simple, you can use it as a starting point to create your own splash screens configuration

`resizeOptions` and `darkResizeOptions` are [ResizeOptions from Sharp](https://github.com/search?q=repo%3Alovell%2Fsharp%20ResizeOptions\&type=code)

For example, to create this custom configuration:

* generate dark splash screens
* global configuration with `0.5` padding, default splash screen names and `#1f1f1f` background color for dark splash screens
* create splash screens for `iPad Air 9.7"` device using global configuration
* create splash screens for `iPhone 6` device using a custom configuration:
  * padding: `0.4`
  * custom splash screen name
  * `#2f2f2f` background color for dark splash screens

you can use the following configuration:

```ts
import type {
  AppleDeviceName,
  AppleDeviceSize,
} from '@vite-pwa/assets-generator/config'
import {
  appleSplashScreenSizes,
  defineConfig,
  minimal2023Preset
} from '@vite-pwa/assets-generator/config'

const devices: AppleDeviceName[] = ['iPad Air 9.7"', 'iPhone 6']

function createCustomAppleSplashScreens(
  options: {
    padding?: number
    resizeOptions?: ResizeOptions
    darkResizeOptions?: ResizeOptions
    linkMediaOptions?: AppleTouchStartupImageOptions
    name?: AppleSplashScreenName
  } = {}
) {
  const {
    padding,
    resizeOptions,
    darkResizeOptions,
    linkMediaOptions,
    name,
  } = options

  return <AppleSplashScreens>{
    sizes: devices.map((deviceName) => {
      const size = appleSplashScreenSizes[deviceName]
      if (deviceName === 'iPhone 6') {
        return <AppleDeviceSize>{
          size: { ...size, padding: 0.4 },
          darkResizeOptions: { background: '#2f2f2f' },
          name: (landscape, size, dark) => `iphone6-${landscape ? 'landscape' : 'portrait'}${dark ? '-dark' : ''}.png`
        }
      }

      return size
    }),
    padding,
    resizeOptions,
    darkResizeOptions,
    linkMediaOptions,
    name,
  }
}

export default defineConfig({
  headLinkOptions: {
    preset: '2023'
  },
  preset: {
    ...minimal2023Preset,
    appleSplashScreens: createCustomAppleSplashScreens({
      padding: 0.5,
      darkResizeOptions: { background: '#1f1f1f' },
    })
  },
  images: ['public/logo.svg']
})
```

#### Custom Dark Splash Screens Image Source&#x20;

From version `v0.2.2`, you can provide a custom dark splash screens image source using `darkImageResolver` option in the `createAppleSplashScreens` and `combinePresetAndAppleSplashScreens` functions options:

* if you're using multiple images, you will need to return the proper dark image using the `imageName` parameter in the `darkImageResolver` function: check the [playground](https://github.com/vite-pwa/assets-generator/blob/main/playground/pwa-assets.config.mts) for an example.
* if you're using a single image, you can ignore the `imageName` parameter.

---

---
url: /guide/development.md
---

# Development

From version `v0.11.13` you can use the service worker on development.

The PWA will not be registered, only the service worker logic, check the details for each strategy below.

::: warning
There will be only one single registration on the service worker precache manifest (`self.__WB_MANIFEST`) when necessary: `navigateFallback`.
:::

The service worker on development will be only available if `disabled` plugin option is not `true` and the `enable` development option is `true`.

## Plugin configuration

To enable the service worker on development, you only need to add the following options to the plugin configuration:

```ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      /* other options */
      /* enable sw on development */
      devOptions: {
        enabled: true
        /* other options */
      }
    })
  ]
})
```

## Type declarations

::: warning
Since version `0.12.4+`, the `webManifestUrl` has been deprecated, the plugin will use `navigateFallbackAllowlist` instead.
:::

```ts
/**
 * Development options.
 */
export interface DevOptions {
  /**
   * Should the service worker be available on development?.
   *
   * @default false
   */
  enabled?: boolean
  /**
   * The service worker type.
   *
   * @default 'classic'
   */
  type?: WorkerType
  /**
   * This option will enable you to not use the `runtimeConfig` configured on `workbox.runtimeConfig` plugin option.
   *
   * **WARNING**: this option will only be used when using `generateSW` strategy.
   *
   * @default false
   */
  disableRuntimeConfig?: boolean
  /**
   * This option will allow you to configure the `navigateFallback` when using `registerRoute` for `offline` support:
   * configure here the corresponding `url`, for example `navigateFallback: 'index.html'`.
   *
   * **WARNING**: this option will only be used when using `injectManifest` strategy.
   */
  navigateFallback?: string

  /**
   * This option will allow you to configure the `navigateFallbackAllowlist`: new option from version `v0.12.4`.
   *
   * Since we need at least the entry point in the service worker's precache manifest, we don't want the rest of the assets to be intercepted by the service worker.
   *
   * If you configure this option, the plugin will use it instead the default.
   *
   * **WARNING**: this option will only be used when using `generateSW` strategy.
   *
   * @default [/^\/$/]
   */
  navigateFallbackAllowlist?: RegExp[]

  /**
   * On dev mode the `manifest.webmanifest` file can be on other path.
   *
   * For example, **SvelteKit** will request `/_app/manifest.webmanifest`, when `webmanifest` added to the output bundle, **SvelteKit** will copy it to the `/_app/` folder.
   *
   * **WARNING**: this option will only be used when using `generateSW` strategy.
   *
   * @default `${vite.base}${pwaOptions.manifestFilename}`
   * @deprecated This option has been deprecated from version `v0.12.4`, the plugin will use navigateFallbackAllowlist instead.
   * @see navigateFallbackAllowlist
   */
  webManifestUrl?: string
}
```

## manifest.webmanifest

Since version `0.12.1` the `manifest.webmanifest` is also served on development mode: you can now check it on `dev tools`.

## generateSW strategy

When using this strategy, the `navigateFallback` on development options will be ignored. The PWA plugin will check if `workbox.navigateFallback` is configured and will only register it on `additionalManifestEntries`.

The PWA plugin will force `type: 'classic'` on service worker registration to avoid errors on client side (not yet supported):

```shell
Uncaught (in promise) TypeError: Failed to execute 'importScripts' on 'WorkerGlobalScope': Module scripts don't support importScripts().
```

::: warning
If your pages/routes other than the entry point are being intercepted by the service worker, use `navigateFallbackAllowlist` to include only the entry point: by default, the plugin will use `[/^\/$/]`.

You **ONLY** need to add the `navigateFallbackAllowlist` option to the `devOptions` entry in `vite-plugin-pwa` configuration if your pages/routes are being intercepting by the service worker and preventing to work as expected:

```ts
export default defineConfig({
  plugins: [
    VitePWA({
      /* other options */
      devOptions: {
        navigateFallbackAllowlist: [/^index.html$/]
        /* other options */
      }
    })
  ]
})
```

:::

## injectManifest strategy

You can use `type: 'module'` when registering the service worker (right now only supported on latest versions of `Chromium` based browsers: `Chromium/Chrome/Edge`):

```ts
devOptions: {
  enabled: true,
  type: 'module',
  /* other options */
}
```

::: warning
When building the application, the `vite-plugin-pwa` plugin will always register your service worker with `type: 'classic'` for compatibility with all browsers.
:::

::: tip
You should only intercept the entry point of your application, if you don't include the `allowlist` option in the `NavigationRoute`, all your pages/routes might not work as they are being intercepted by the service worker (which will return by default the content of the entry point by not including your pages/routes in its precache manifest):

```ts
let allowlist: undefined | RegExp[]
if (import.meta.env.DEV)
  allowlist = [/^\/$/]

// to allow work offline
registerRoute(new NavigationRoute(
  createHandlerBoundToURL('index.html'),
  { allowlist }
))
```

:::

When using this strategy, the `vite-plugin-pwa` plugin will delegate the service worker compilation to `Vite`, so if you're using `import` statements instead `importScripts` in your custom service worker, you **must** configure `type: 'module'` on development options.

If you are using `registerRoute` in your custom service worker you should add `navigateFallback` on development options, the `vite-plugin-pwa` plugin will include it in the injection point (`self.__WB_MANIFEST`).

You **must** not use `HMR (Hot Module Replacement)` in your custom service worker, since we cannot use yet dynamic imports in service workers: `import.meta.hot`.

If you register your custom service worker (not using `vite-plugin-pwa` virtual module and configuring `injectRegister: false` or `injectRegister: null`), use the following code (remember also to add `scope` option if necessary):

```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    import.meta.env.MODE === 'production' ? '/sw.js' : '/dev-sw.js?dev-sw'
  )
}
```

If you are also using `import` statements instead `importScripts`, use the following code (remember also to add the `scope` option if necessary):

```ts
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    import.meta.env.MODE === 'production' ? '/sw.js' : '/dev-sw.js?dev-sw',
    { type: import.meta.env.MODE === 'production' ? 'classic' : 'module' }
  )
}
```

When you change your service worker source code, `Vite` will force a full reload, since we're using `workbox-window` to register it (by default, you can register it manually) you may have some problems with the service worker events.

## Example

You can find an example here: [vue-router](https://github.com/antfu/vite-plugin-pwa/tree/main/examples/vue-router).

To run the example, you must build the PWA plugin (`pnpm run build` from root folder), change to `vue-router` directory
(`cd examples/vue-router`) and run it:

* `generateSW` strategy: `pnpm run dev`
* `injectManifest` strategy: `pnpm run dev-claims`

Since version `0.12.1`, you also have the development scripts for all other frameworks as well.

The instructions for running the `dev` or `dev-claims` scripts are the same as for `vue-router` but running them in the corresponding framework directory.

---

---
url: /guide/faq.md
---

# FAQ

## IDE errors 'Cannot find module' (ts2307)

## Type declarations

You can find the full list of the `vite-plugin-pwa` plugin configuration options in the following [types.ts module](https://github.com/antfu/vite-plugin-pwa/blob/main/src/types.ts).

You can find all the `vite-plugin-pwa` virtual modules declarations in the following [client.d.ts](https://github.com/antfu/vite-plugin-pwa/blob/main/client.d.ts).

## Web app manifest and 401 status code (Unauthorized)

[Browsers send requests for the web manifest without credentials](https://web.dev/articles/add-manifest#link-manifest), so if your site sits behind auth, the request will fail with a 401 Unauthorized error – even if the user is logged in.

To send the request with credentials, the `<link rel="manifest">` needs a `crossorigin="use-credentials"` attribute, which you can enable via `useCredentials` in the [plugin options](https://github.com/antfu/vite-plugin-pwa/blob/main/src/types.ts#L79):

```ts
useCredentials: true
```

## Service Worker errors on browser

## Error: Unable to find a place to inject the manifest

If you're using a custom service worker without `precaching` (`self.__WB_MANIFEST`) and you're getting this error on build process, you need to disable `injection point` in your pwa plugin configuration (available only from version `^0.14.0`):

```ts
injectManifest: {
  injectionPoint: undefined
}
```

## Service Worker Registration Errors

You can handle Service Worker registration errors if you want to notify the user with following code on your `main.ts`
or `main.js`:

```ts
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onRegisterError(error) {}
})
```

and then inside `onRegisterError`, just notify the user that there was an error registering the service worker.

## Missing assets from SW precache manifest

:::tip
From version `0.20.2`, the plugin will throw an error if the `maximumFileSizeToCacheInBytes` warning is present when building the service worker.
:::

If you find any assets are missing from the service worker's precache manifest, you should check if they exceed the `maximumFileSizeToCacheInBytes`, the default value is **2 MiB**.

You can increase the value to your needs, for example to allow assets up to **3 MiB**:

* when using `generateSW` strategy:

```ts
workbox: {
  maximumFileSizeToCacheInBytes: 3000000
}
```

* when using `injectManifest` strategy:

```ts
injectManifest: {
  maximumFileSizeToCacheInBytes: 3000000
}
```

## Exclude routes

If you need to exclude some routes from service worker interception:

* [for `generateSW` strategy](/workbox/generate-sw#exclude-routes)
* [for `injectManifest` strategy](/workbox/inject-manifest#exclude-routes)

## `navigator / window` is `undefined`

If you are getting `navigator is undefined` or `window is undefined` errors when building your application, you have configured your application in an `SSR / SSG` environment.

The error could be due to using this plugin or another library not aware of `SSR / SSG`:  your code will be called on the client but also on the server side on build process, so when building the application your server logic will be invoked, and there is no `navigator / window` on the server, it is `undefined`.
