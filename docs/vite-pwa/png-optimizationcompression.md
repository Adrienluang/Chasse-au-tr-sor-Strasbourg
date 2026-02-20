### PNG optimization/compression

By default, all generated PNG files are optimized using:

```txt
{
  compressionLevel: 9,
  quality: 60
}
```

You can provide your optimization options using `png` option, check the options in [sharp png output options](https://sharp.pixelplumbing.com/api-output#png):

```ts
import {
  defineConfig,
  minimal2023Preset
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: {
    preset: '2023'
  },
  preset: {
    ...minimal2023Preset,
    png: {
      compressionLevel: 9,
      quality: 85
    }
  },
  images: ['public/logo.svg']
})
```
