### Favicons

PWA Assets Generator will generate favicons when explicitly defined in the preset. If you want to generate favicons, but not the corresponding PWA icons, add the favicons sizes you want to generate, PWA Assets Generator will generate the PWA icon to generate the corresponding favicon and once generated, the PWA icon will be removed.

For example, if you want to generate a `48x48` favicon using the default preset, you can use the following configuration:

```ts
import { defineConfig } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  /* remember to include the preset for favicons and apple touch icon */
  headLinkOptions: {
    preset: '2023'
  },
  preset: {
    transparent: {
      sizes: [64, 192, 512],
      favicons: [[48, 'favicon-48x48.ico'], [64, 'favicon.ico']]
    },
    maskable: {
      sizes: [512]
    },
    apple: {
      sizes: [180]
    }
  },
  images: ['public/logo.svg'],
})
```

PWA Assets Generator will generate the `public/pwa-48x48.png` PWA icon, then generate the corresponding favicon (`public/favicon-48x48.ico`) and finally remove the PWA icon (`public/pwa-48x48.png`).
