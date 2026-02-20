# Build Tooling

We use the following build tools by default:

- [Vite](https://vite.dev){rel="&#x22;nofollow&#x22;"} or [webpack](https://webpack.js.org){rel="&#x22;nofollow&#x22;"}
- [Rollup](https://rollupjs.org){rel="&#x22;nofollow&#x22;"}
- [PostCSS](https://postcss.org){rel="&#x22;nofollow&#x22;"}
- [esbuild](https://esbuild.github.io){rel="&#x22;nofollow&#x22;"}

For this reason, most of your previous `build` configuration in `nuxt.config` will now be ignored, including any custom babel configuration.

If you need to configure any of Nuxt's build tools, you can do so in your `nuxt.config`, using the new top-level `vite`, `webpack` and `postcss` keys.

In addition, Nuxt ships with TypeScript support.

:read-more{to="https://nuxt.com/docs/4.x/guide/concepts/typescript"}

## Steps

1. Remove `@nuxt/typescript-build` and `@nuxt/typescript-runtime` from your dependencies and modules.
2. Remove any unused babel dependencies from your project.
3. Remove any explicit core-js dependencies.
4. Migrate `require` to `import`.
