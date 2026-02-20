### Configurations

Create a `pwa-assets.config.js` or `pwa-assets.config.ts` configuration file in the root-level of your project to customize PWA assets generator CLI:

```ts
import {
  defineConfig,
  minimal2023Preset as preset
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: {
    preset: '2023'
  },
  preset,
  images: ['public/logo.svg']
})
```

:::info
CLI options will override the configuration file options.
:::

You can use one of the built-in presets or just define your own, this is the [minimal-2023 preset](https://github.com/vite-pwa/assets-generator/tree/main/src/presets/minimal-2023.ts) definition:

```ts
import type { Preset } from '@vite-pwa/assets-generator/config';

export const minimal2023Preset: Preset = {
  transparent: {
    sizes: [64, 192, 512],
    favicons: [[48, 'favicon.ico']]
  },
  maskable: {
    sizes: [512]
  },
  apple: {
    sizes: [180]
  }
}
```

Then run the CLI from the command line:

```bash
$ pwa-assets-generator
```

or configure it in your `package.json` and run it via your package manager from the command line:

```json
{
  "scripts": {
    "generate-pwa-assets": "pwa-assets-generator"
  }
}
```
