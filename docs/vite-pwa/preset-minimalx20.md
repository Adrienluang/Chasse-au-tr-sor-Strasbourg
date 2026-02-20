### Preset Minimal&#x20;

Our minimal recommendation is:

* transparent 64x64 ico: register it in the html head: `<link rel="icon" href="/favicon.ico" sizes="any">`
* Use SVG image as source image: register it in the html head: `<link rel="icon" href="/favicon.svg" type="image/svg+xml">`
* transparent 64x64 icon (PWA Manifest icon)
* transparent 192x192 icon (PWA Manifest icon)
* transparent 512x512 icon with `purpose: 'any'` (PWA Manifest icon)
* white 512x512 icon with `purpose: 'maskable'` (PWA Manifest icon): background color can be customized to your needs
* white 180x180 icon for iOS/MacOS (html head link: `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`): background color can be customized to your needs

## Example using minimal preset

You can generate icons using the `minimal-2023` preset included in [@vite-pwa/assets-generator](https://github.com/vite-pwa/assets-generator) package via a source image, check out the [CLI](/assets-generator/cli) and [API](/assets-generator/api) documentation for more details.

Update your PWA manifest icons entry with:

```ts
icons: [
  {
    src: 'pwa-64x64.png',
    sizes: '64x64',
    type: 'image/png'
  },
  {
    src: 'pwa-192x192.png',
    sizes: '192x192',
    type: 'image/png'
  },
  {
    src: 'pwa-512x512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'any'
  },
  {
    src: 'maskable-icon-512x512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable'
  }
]
```

and use the following HTML head entries in your entry point:
