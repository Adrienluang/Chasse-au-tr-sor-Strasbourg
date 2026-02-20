### PNG output names

The PNG files names will be generated using the following function (can be found in [utils module](https://github.com/vite-pwa/assets-generator/tree/main/src/utils.ts)):

```ts
export function defaultAssetName(type: AssetType, size: ResolvedAssetSize) {
  switch (type) {
    case 'transparent':
      return `pwa-${size.width}x${size.height}.png`
    case 'maskable':
      return `maskable-icon-${size.width}x${size.height}.png`
    case 'apple':
      return `apple-touch-icon-${size.width}x${size.height}.png`
  }
}
```

You can override the PNG output names providing custom `assetName` option:

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
    assetName: (type: AssetType, size: ResolvedAssetSize) => {
      /* your logic here */
    }
  },
  images: ['public/logo.svg']
})
```
