### Preset Minimal 2023&#x20;

Refer to [Definitive edition of "How to Favicon" in 2023](https://dev.to/masakudamatsu/favicon-nightmare-how-to-maintain-sanity-3al7) for more details.

Our minimal recommendation is:

* transparent 48x48 ico: register it in the html head: `<link rel="icon" href="/favicon.ico" sizes="48x48">`
* Use SVG image as source image: register it in the html head: `<link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml">`
* transparent 64x64 icon (PWA Manifest icon)
* transparent 192x192 icon (PWA Manifest icon)
* transparent 512x512 icon with `purpose: 'any'` (PWA Manifest icon)
* white 512x512 icon with `purpose: 'maskable'` (PWA Manifest icon): background color can be customized to your needs
* white 180x180 icon for iOS/MacOS (html head link: `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`): background color can be customized to your needs
