### Service Worker Code

You need to define `self` scope with `ServiceWorkerGlobalScope`:

```ts
import { precacheAndRoute } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope

precacheAndRoute(self.__WB_MANIFEST)
```

---

---
url: /deployment/apache.md
---

# Apache Http Server 2.4+

## Configure `manifest.webmanifest` mime type

You need to configure the following mime type (see basic configuration below):

```ini
<IfModule mod_mime.c>
   # Manifest file
   AddType application/manifest+json webmanifest
</IfModule>
```

## Basic configuration with http to https redirection

Update your `httpd.conf` configuration file with:

```ini
# httpd.conf
ServerRoot "<your apache server root>"

Listen 80
ServerName www.yourdomain.com

DocumentRoot "<your document root>"

# modules
LoadModule mime_module modules/mod_mime.so
LoadModule rewrite_module modules/mod_rewrite.so

# mime types
<IfModule mod_mime.c>
   # Manifest file
   AddType application/manifest+json webmanifest
</IfModule>

# your https configuration
Include conf/extra/https-www.yourdomain.com.conf

<IfModule ssl_module>
    SSLRandomSeed startup builtin
    SSLRandomSeed connect builtin
</IfModule>

<VirtualHost www.yourdomain.com:80>
    ServerName www.yourdomain.com

    RewriteEngine On

    # disable TRACE and TRACK methods
    RewriteCond %{REQUEST_METHOD} ^(TRACE|TRACK)
    RewriteRule .* - [F]

    Options +FollowSymlinks
    RewriteCond %{SERVER_PORT} !443

    RewriteRule (.*) https://www.yourdomain.com/ [L,R]

    ErrorLog logs/www.yourdomain.com-error_log
    CustomLog logs/www.yourdomain.com-access_log combined
</VirtualHost>
```

---

---
url: /assets-generator/api.md
---

# PWA Assets Generator API

From `v0.2.0`, `@vite-pwa/assets-generator` is shipped with a CLI, an API (low-level api): refer to [API](#api) for more details.

The API can be found in the [api folder](https://github.com/vite-pwa/assets-generator/tree/main/src/api).

## Installation

This package is shipped with the `@vite-pwa/assets-generator` package:

::: code-group

```bash [pnpm]
pnpm add -D @vite-pwa/assets-generator
```

```bash [yarn]
yarn add -D @vite-pwa/assets-generator
```

```bash [npm]
npm install -D @vite-pwa/assets-generator
```

:::

## API

From version `v0.2.0`, `@vite-pwa/assets-generator` exposes the following packages:

* `@vite-pwa/assets-generator/api`: low-level functions api.
* new `@vite-pwa/assets-generator/api/instructions`: `instructions` function to collect the icon assets instructions.
* new `@vite-pwa/assets-generator/api/generate-assets`: `generateAssets` function to generate icon assets from an instruction.
* new `@vite-pwa/assets-generator/api/generate-html-markup`: `generateHtmlMarkup` function to generate all html head links from an instruction.
* new `@vite-pwa/assets-generator/api/generate-manifest-icons-entry`: `generateManifestIconsEntry` function to generate the PWA web manifest icons' entry.

The API can be found in the [api folder](https://github.com/vite-pwa/assets-generator/tree/main/src/api) and the [JSDOCS documentation](https://paka.dev/npm/@vite-pwa/assets-generator).

If you need to generate the PWA assets from your own code, you can use the `instructions`, `generateHtmlMarkup`, `generateAssets` and `generateManifestIconsEntry` functions:

1. [instructions](https://github.com/vite-pwa/assets-generator/tree/main/src/api/instructions.ts): collect the icon assets instructions, provides function helpers to generate each icon asset as a `Buffer` and html head links with `string` and `object` notation.
2. [generateAssets](https://github.com/vite-pwa/assets-generator/tree/main/src/api/generate-assets.ts): once you collect the icon assets instructions, you can use this function to save all the icon assets to the file system.
3. [generateHtmlMarkup](https://github.com/vite-pwa/assets-generator/tree/main/src/api/generate-html-markup.ts): once you collect the icon assets instructions, you can use this function to generate all the html head markup for the icon assets.
4. [generateManifestIconsEntry](https://github.com/vite-pwa/assets-generator/tree/main/src/api/generate-manifest-icons-entry.ts) function to generate the PWA web manifest icons' entry.

::: info
We're working to expose the new api in `vite-plugin-pwa` plugin and the integrations.

From `v0.19.0`, `vite-plugin-pwa` includes a new experimental feature, check [Integrations](/assets-generator/integrations) section.
:::
