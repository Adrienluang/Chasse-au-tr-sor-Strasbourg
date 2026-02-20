### Favicon and Apple Touch Icon Links&#x20;

From version `v0.1.0`, the `@vite-pwa/assets-generator` CLI will generate the favicon and apple touch icon links.

If you're using any of the built-in presets from the CLI, the preset will be auto-detected.

If you're using the configuration file, you will need to include the new `headLinkOptions` option in your configuration file to configure the new preset `2023` layout for your favicons and apple touch icon links:

```ts
export interface HeadLinkOptions {
  /**
   * Base path to generate the html head links.
   *
   * @default '/'
   */
  basePath?: string
  /**
   * The preset to use.
   *
   * If using the built-in presets from CLI (`minimal` or `minimal-2023`), this option will be ignored (will be set to `default` or `2023` for `minimal` and `minimal-2023` respectively).
   *
   * @default 'default'
   */
  preset?: HtmlLinkPreset
  /**
   * By default, the SVG favicon will use the SVG file name as the name.
   *
   * For example, if you provide `public/logo.svg` as the image source, the name will be `<basePath>logo.svg`.
   *
   * @param name The name of the SVG icons.
   */
  resolveSvgName?: (name: string) => string
}
```
