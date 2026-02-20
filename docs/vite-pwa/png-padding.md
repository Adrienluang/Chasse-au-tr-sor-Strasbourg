### PNG Padding

When generating PNG files, PWA Assets Generator will apply the following padding:

* for `transparent` PNG files: `0.05`
* for `maskable` and `apple` PNG files: `0.3`

`0` is no padding, `0.3` is a typical value for most icons.

These values can be customized inside a custom preset:

```ts
import type { Preset } from '@vite-pwa/assets-generator/config';

export const minimalPresetNoPadding: Preset = {
  transparent: {
    sizes: [64, 192, 512],
    favicons: [[48, 'favicon.ico']],
    padding: 0
  },
  maskable: {
    sizes: [512],
    padding: 0
  },
  apple: {
    sizes: [180],
    padding: 0
  }
}
```
