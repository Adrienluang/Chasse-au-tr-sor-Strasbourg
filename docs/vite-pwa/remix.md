### Remix

Vite dev server will be restarted when changing the configuration (inlined or using external file).

Check the [Remix PWA Assets](/frameworks/remix#pwa-assets) section for more details about the components.

## New Virtual Modules

`vite-plugin-pwa` plugin exposes two new virtual modules for the integrations, they are not meant to be consumed from your application:

* `virtual:pwa-assets/head`: will expose PWA image links and the `theme-color` meta tag
* `virtual:pwa-assets/icons`: will expose PWA web manifest icons

If you're using TypeScript in your application, you can add `vite-plugin-pwa/pwa-assets` to your `tsconfig.json` file to avoid TypeScript errors:

```json
{
  "compilerOptions": {
    "types": [
      "vite-plugin-pwa/pwa-assets"
    ]
  }
}
```

You can also add the following reference to the beginning of your application code:

```ts
/// <reference types="vite-plugin-pwa/pwa-assets" />
```

You can find the virtual modules types in the [pwa-assets.d.ts](https://github.com/vite-pwa/vite-plugin-pwa/tree/main/pwa-assets.d.ts) file.

## PWA Assets Options

```ts
/**
 * PWA assets generation and injection options.
 */
export interface PWAAssetsOptions {
  /**
   * Enable PWA assets generation and injection.
   *
   * @default false
   */
  disabled?: boolean

  /**
   * PWA assets generation and injection.
   *
   * By default, the plugin will search for the pwa assets generator configuration file in the root directory of your project:
   * - pwa-assets.config.js
   * - pwa-assets.config.mjs
   * - pwa-assets.config.cjs
   * - pwa-assets.config.ts
   * - pwa-assets.config.cts
   * - pwa-assets.config.mts
   *
   * If using a string path, it should be relative to the root directory of your project.
   *
   * Setting to `false` will disable config resolving.
   *
   * **WARNING**: You can use only one image in the configuration file.
   *
   * @default false
   * @see https://vite-pwa-org.netlify.app/assets-generator/cli.html#configurations
   */
  config?: string | boolean

  /**
   * Preset to use.
   *
   * If the `config` option is enabled, this option will be ignored.
   *
   * Setting this option to `false` will disable PWA assets generation (if the `config` option is also disabled).
   *
   * @default 'minimal-2023'
   */
  preset?: false | BuiltInPreset | Preset

  /**
   * Path relative to `root` folder where to find the image to use for generating PWA assets.
   *
   * If the `config` option is enabled, this option will be ignored.
   *
   * @default `public/favicon.svg`
   */
  image?: string

  /**
   * The preset to use for head links (favicon links).
   *
   * If `config` option is enabled, this option will be ignored.
   *
   * @see https://vite-pwa-org.netlify.app/assets-generator/#preset-minimal-2023
   * @see https://vite-pwa-org.netlify.app/assets-generator/#preset-minimal
   * @default '2023'
   */
  htmlPreset?: HtmlLinkPreset

  /**
   * Should the plugin include html head links?
   *
   * @default true
   */
  includeHtmlHeadLinks?: boolean

  /**
   * Should the plugin override the PWA web manifest icons' entry?
   *
   * The plugin will auto-detect the icons from the manifest, if missing, then the plugin will ignore this option and will include the icons.
   *
   * @default false
   */
  overrideManifestIcons?: boolean

  /**
   * Should the PWA web manifest `theme_color` be injected in the html head?
   *
   * @default true
   */
  injectThemeColor?: boolean

  /**
   * PWA Assets integration support.
   *
   * This option should be only used by integrations, it is not meant to be used by end users.
   */
  integration?: {
    /**
     * The base url for the PWA assets.
     *
     * @default `vite.base`
     */
    baseUrl?: string

    /**
     * The public directory to resolve the image: should be an absolute path.
     *
     * @default `vite.root/vite.publicDir`
     */
    publicDir?: string

    /**
     * The output directory: should be an absolute path.
     *
     * @default `vite.root/vite.build.outDir`
     */
    outDir?: string
  }
}
```

---

---
url: /frameworks/laravel.md
---

# Laravel

## Introduction

Using `vite-plugin-pwa` in a Laravel project is made complex by Laravel being a mix of backend and frontend concepts. For example,

* Laravel has its own public dir inside the webserver's webroot. This means Vite builds to `/path/to/webroot/public/build/assets`. This different to the usual frontend layout, where `/build/assets` would be in the webroot.
* There isn't a default static HTML entrypoint for the PWA. Laravel builds this server-side. The resulting HTML has a `<div id="app"></div>` into which the Vue app is instantiated.
* Laravel will put other things (like [Telescope](https://laravel.com/docs/12.x/telescope)) in the public dir that you do not want offline.
* Laravel has its own [plugin for Vite](https://github.com/laravel/vite-plugin) for builds, which adds an extra layer of configuration that vite-pwa does not normally encounter.

To make it work, you need to configure vite-plugin-pwa to work around these issues:

* configure buildBase and outDir in vite.config.ts to make vite-pwa build to the same place as laravel/vite-plugin.
* create a Blade file to act as an HTML entrypoint and add config for this to vite.config.ts.
* Add a Service-Worker-Allowed header to your web server to work around the restrictions imposed by the build directory being in a subdir of the webroot.
* Configuring caching in vite.config.ts to work around other assets being in the public dir that you do not want to be offline.

## History

There's a detailed GitHub issue exploring this problem here:

https://github.com/vite-pwa/vite-plugin-pwa/issues/431

The accumulated knowledge within it lead to a Laravel, Vite, Vue3 and TypeScript app working as a PWA with offline support and app install prompts. The issue was asking for a demonstration repository so a repo above was created to share it. It is available here:

https://github.com/sfreytag/laravel-vite-pwa

## What's Included

The repo above demonstrates a working PWA with install prompts and offline support within Laravel using Vue3, Vite and Typescript. The useful things are:

* A [vite.config.ts](https://github.com/sfreytag/vite-pwa-docs/blob/main/vite.config.ts) with settings for `vite-plugin-pwa` that work with Laravel's directory layout
* A [Blade template](https://github.com/sfreytag/laravel-vite-pwa/blob/main/resources/views/welcome.blade.php) that works as the entrypoint for the PWA
* A [generator for the PWA icons](https://github.com/sfreytag/laravel-vite-pwa/blob/main/package.json#L7)
* A [server.php](https://github.com/sfreytag/laravel-vite-pwa/blob/main/server.php) file that supplies the sw.js and the Service-Worker-Allowed header for `php artisan serve` for local development (see [lines 18:23](https://github.com/sfreytag/laravel-vite-pwa/blob/main/server.php#L18-L23))
* A composable [usePwa](https://github.com/sfreytag/laravel-vite-pwa/blob/main/resources/js/composables/usePwa/index.ts) that demonstrates how to access the `vite-plugin-pwa` functionality within Vue3 and TypeScript (eg install and update hooks, online/offline status)
* A [PwaStatus component](https://github.com/sfreytag/laravel-vite-pwa/blob/main/resources/js/components/PwaStatus.vue) that shows how it all works
* TypeScript [types for the install event](https://github.com/sfreytag/laravel-vite-pwa/blob/main/resources/js/composables/usePwa/types.ts)

## Setup

The repo has been built on a vanilla install of Laravel 10 using composer from `composer create-project laravel/laravel`.

To add the PWA to your own Laravel project you can review the changes required to set up `vite-plugin-pwa`:

* Work through the commit history, which builds it up step-by-step
* Or view the entire diff of the HEAD against the vanilla Laravel install: https://github.com/sfreytag/laravel-vite-pwa/compare/a59497..HEAD

Or just fork the repo and start from there.

## Build

To build the repo, follow the usual Laravel steps. Nothing extra is required for `vite-plugin-pwa`. Assuming you have PHP, NPM and Composer:

```
git clone git@github.com:sfreytag/laravel-vite-pwa.git
cd laravel-vite-pwa
composer install
cp .env.example .env
php artisan key:generate
npm install
npm run build
```

## Run

Before you run it, bear in mind that the PWA installs a service worker and fills a cache. This can conflict with other service workers and caches from your other localhost projects. So it is recommended to use a port unique to each PWA project. To use eg 8082 for Laravel:

```
php artisan serve --port=8082
```

The app should now be running on `http://localhost:8082`. It should immediately work as a PWA. If you check the dev tools, the service worker should be running. If your browser supports it there will be an intall prompt in the address bar. It should then be installable. And if you use dev tools to take either the network or service worker offline, it should continue working if you reload the page.

## Working on the PWA

The PWA is configured to only work with prod builds, rather than dev. This is straightforward to work with and helps stop the PWA offline cache get in the way of refreshing your build during the dev cycle. However this might not suit everyone. It would be a good PR to submit to this repo to get the PWA working with a dev build. In the meantime, before running the PWA and when making changes, to be sure you have the latest version of it, ensure you use:

```
npm run build
```

## PWA Icons

The repo uses [@vite-pwa/assets-generator](https://github.com/vite-pwa/assets-generator) for its icons.

The canonical icon should be an SVG file. This is useful for the PWA anyway, so it can be saved in `public/favicon.svg`. Then build the other icons from it by running:

```
npm run pwa-icons
```

This generates a set of icons defined by the minimal preset described [here](/assets-generator/cli.html#presets).

They are automatically packaged in the public folder so they are web readable. They are also included in the repo so this process only needs repeating if you change the canonical `favicon.svg` icon.

---

---
url: /assets-generator/migrations.md
---

# Migrations

When migrating from one version to a new one, you should remove all the PWA assets generated previously and generate them again after upgrading `@vite-pwa/assets-generator` package.

:::warning
If you're using some of the old PWA assets in your application, **don't remove them**.
:::

Remember to check the changes before upgrading to a new version in your local environment:

* start the current version in your local server, opening your application to check the old PWA assets
* upgrade the package to the new version and regenerate the PWA assets
* start the new version in your local server, refresh your application to check the new PWA assets

## From `v0.1.0` to `v0.2.0`

The `api` and the core has been built from scratch, the CLI has been rebuilt on top of the API.

The main changes included in version `v0.2.0` are:

* `generatePWAImageAssets` and  `generatePWAAssets` functions have been removed from `@vite-pwa/assets-generator` package export: now the package only export types and some utilities.
* new `@vite-pwa/assets-generator/api/instructions` package export: new `instructions` function to collect the icon assets instructions.
* new `@vite-pwa/assets-generator/api/generate-assets` package export: new `generateAssets` function to generate icon assets from an instruction.
* new `@vite-pwa/assets-generator/api/generate-html-markup` package export: new `generateHtmlMarkup` function to generate all html head links from an instruction.
* new `@vite-pwa/assets-generator/api/generate-manifest-icons-entry` package export: new `generateManifestIconsEntry` function to generate the PWA web manifest icons' entry.
* new CLI options for html head links generation: `xhtml` and `includeId`.

If you are using `generatePWAImageAssets` and/or `generatePWAAssets` functions, you need to update your code to use the new `instructions` and `generateAssets` functions.

If you're only using the CLI, you don't need to change anything.

For more details about the new version `v0.2.0`, check [this comment](https://github.com/vite-pwa/assets-generator/issues/20#issuecomment-1848382903) in the repository.

## From `minimal` to `minimal-2023` Preset

If you are using `pwa-assets-generator` in your `package.json` scripts, update the script from:

```json
"generate-assets": "pwa-assets-generator --preset minimal <your-logo-path>"
```

to:

```json
"generate-assets": "pwa-assets-generator --preset minimal-2023 <your-logo-path>"
```

If you are using a configuration file:

* update the built-in preset name or update the import to use `minimal2023Preset`: check the code snippets in the [built-in features section](/assets-generator/cli#built-in-features).
* include `headLinkOptions.preset = '2023'` in you configuration file

The new `minimal-2023` preset changes only the `favicon.ico` size, the `apple-touch-icon` and PWA manifest icons are the same, you need to update your html head favicon entries, from:

```html
<head>
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
</head>
```

to:

```html
<head>
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml">
</head>
```

---

---
url: /deployment/netlify.md
---

# Netlify

## Configure `manifest.webmanifest` mime type

You need to register the correct MIME type for the web manifest by adding a headers table to your `netlify.toml` file (see basic deployment below):

```toml
[[headers]]
  for = "/manifest.webmanifest"
  [headers.values]
    Content-Type = "application/manifest+json"
```

## Cache-Control

As a general rule, files in `/assets/` can have a very long cache time, as everything in there should contain a hash in the filename.

Add another headers table to your `netlify.toml` file (see basic deployment below):

```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    cache-control = '''
    max-age=31536000,
    immutable
    '''
```

## Configure http to https redirection

Netlify will redirect automatically, so you don't worry about it.

## Basic deployment example

Add `netlify.toml` file to the root directory with the content:

```toml
[build]
  publish = "dist"
  command = "pnpm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/manifest.webmanifest"
  [headers.values]
    Content-Type = "application/manifest+json"

[[headers]]
  for = "/assets/*"
  [headers.values]
    cache-control = '''
    max-age=31536000,
    immutable
    '''
```

---

---
url: /deployment/nginx.md
---

# NGINX

## Configure `manifest.webmanifest` mime type

You need to register the correct MIME type for the web manifest by adding it either to the [default](https://www.nginx.com/resources/wiki/start/topics/examples/full/#mime-types) file at `/etc/nginx/mime.types`

```nginx
# /etc/nginx/mime.types
types {
  # Manifest files
  application/manifest+json  webmanifest;
  ...
}
```

or any `http`, `server` or location `location` block with

```nginx
include mime.types;
types {
  application/manifest+json  webmanifest;
}
```

You can validate the setting by checking the HTTP headers once the app is deployed

```shell script
curl -s -I -X GET https://yourserver/manifest.webmanifest | grep content-type -i
```

and check that the result is `content-type: application/manifest+json`.

## Basic configuration with http to https redirection

Update your `server.conf` configuration file with:

```nginx
server {
  listen 80;
  server_name yourdomain.com www.yourdomain.com;
  return 301 https://yourdomain.com$request_uri;
}
```

## Cache-Control

Ensure you have a very restrictive setup for your `Cache-Control` headers in place.

Double check that **you do not** have caching features enabled, especially `immutable`, on locations like:

* `/`
* `/sw.js`
* `/index.html`
* `/manifest.webmanifest`

NGINX will add `E-Tag`-headers itself, so there is not much to in that regard.

As a general rule, files in `/assets/` can have a very long cache time, as everything in there should contain a hash in the filename.

An example configuration inside your `server` block could be:

```nginx
# all assets contain hash in filename, cache forever
location ^~ /assets/ {
    add_header Cache-Control "public, max-age=31536000, s-maxage=31536000, immutable";
    ...
    try_files $uri =404;
}

# all workbox scripts are compiled with hash in filename, cache forever
location ^~ /workbox- {
    add_header Cache-Control "public, max-age=31536000, s-maxage=31536000, immutable";
    ...
    try_files $uri =404;
}

# assume that everything else is handled by the application router, by injecting the index.html.
location / {
    autoindex off;
    expires off;
    add_header Cache-Control "public, max-age=0, s-maxage=0, must-revalidate" always;
    ...
    try_files $uri /index.html =404;
}
```

Be aware that this is a very simplistic approach and you must test every change, as the NGINX match precedences for locations are not very intuitive and error prone if you do not know the [exact rules](https://docs.nginx.com/nginx/admin-guide/web-server/web-server/#location_priority).

::: danger
**Always re-test and re-assure** that the caching for mission critical files is **as low** as possible if not hashed files or you might invalidate clients for a long time.
:::

---

---
url: /examples/nuxt.md
---

# Nuxt 3

You need to stop the dev server once started and then to see the PWA in action run:

* `nr dev:preview:build`: Nuxt build command + start server
* `nr dev:preview:generate`: Nuxt generate command + start server

::: info WIP
You can also check [Elk repo](https://github.com/elk-zone/elk) for a real world example: we're working to update the repo.

Elk repo is using `Push Notifications` and `Web Share Target API` PWA capabilities and `Prompt for update` register type via `injectManifest` strategy.
:::

---

---
url: /frameworks/nuxt.md
---

# Nuxt 3

::: warning
This PWA module can only be used with Vite.
:::

## Nuxt 3 Integration

`vite-plugin-pwa` provides the new `@vite-pwa/nuxt` module that will allow you to use `vite-plugin-pwa` in your Nuxt 3 applications.

You will need to install `@vite-pwa/nuxt` using:

```shell
npx nuxi@latest module add @vite-pwa/nuxt
```

To update your project to use the new `@vite-pwa/nuxt` module for Nuxt 3, you only need to change the Nuxt config file adding the `@vite-pwa/nuxt` module, move the `vite-plugin-pwa` options to the module options, and remove the `vite-plugin-pwa` plugin (if present):

```ts
export default defineNuxtConfig({
  modules: ['@vite-pwa/nuxt'],
  pwa: {
    /* your pwa options */
  }
})
```

## Using Nuxt 3 Plugin

`@vite-pwa/nuxt` will register a plugin that will provide PWA logic via `$pwa` property when the PWA is enabled (`$pwa` will be `undefined` if PWA disabled or running dev server without PWA dev options enabled).

You can access `$pwa` property directly inside your Vue component templates. You can also access to `$pwa` in your Vue script setup or in any other module via `useNuxtApp().$pwa`.

The module will provide the following features via `$pwa` property:

* Prompt for update and offline ready via `needRefresh` and `offlineReady` properties.
* Cancelling prompt for update application and offline via `closePrompt` function.
* Update application when using `prompt for update` behaviour via `updateServiceWorker` function.
* Intercepting `beforeinstallprompt` event via `showInstallPrompt` property: this feature will prevent the browser to show the default `Install PWA Application` prompt.
* Cancelling install prompt via `cancelInstall` function.
* `Install PWA application` via `install` function.
* Service worker registration status via `swActivated` and `registrationError` properties.
* Service worker registration via `getSWActivated` function.

You will need to activate `pwa.client.installPrompt` property in your Nuxt config file to enable `beforeinstallprompt` event interception: configure `true` or the key name used in local storage to store the `beforeinstallprompt` cancellation for your install prompt/widget.

Additionally, you can also configure periodic sync for updates, you can enable it via `pwa.client.periodicSyncForUpdates` property in your Nuxt config file: configure the interval in seconds in previous property.

You can disable this plugin by setting `pwa.client.registerPlugin` property to `false` in your Nuxt config file. In that case, you will need to import `VanillaJS` or `Vue` PWA virtual module in your application, and previous features will not be available (you can only access to the features exposed by the virtual module).

::: info
This is the initial release of `@vite-pwa/nuxt` integration, we're working to improve it and add more features.
:::
