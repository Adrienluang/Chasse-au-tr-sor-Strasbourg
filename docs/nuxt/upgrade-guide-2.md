# Upgrade Guide

## Upgrading Nuxt

### Latest Nuxt 3 release

To upgrade Nuxt to the [latest v3 release](https://github.com/nuxt/nuxt/releases){rel="&#x22;nofollow&#x22;"}, use the `nuxt upgrade` command with `--channel=v3` flag.

::code-group{sync="pm"}
```bash [npm]
npx nuxt upgrade --dedupe --channel=v3
```

```bash [yarn]
yarn nuxt upgrade --dedupe --channel=v3
```

```bash [pnpm]
pnpm nuxt upgrade --dedupe --channel=v3
```

```bash [bun]
bun x nuxt upgrade --dedupe --channel=v3
```
::

::note
This will only work if you *already have* a version of `@nuxt/cli` which has the `--channel` flag implemented. If this does not work, you can instead use `nuxi@latest` for the initial upgrade.
E.g. `npx nuxi@latest upgrade --dedupe --channel=v3`
::

### Latest release

To upgrade Nuxt to the [latest release](https://github.com/nuxt/nuxt/releases){rel="&#x22;nofollow&#x22;"}, use the `nuxt upgrade` command.

::code-group{sync="pm"}
```bash [npm]
npx nuxt upgrade
```

```bash [yarn]
yarn nuxt upgrade
```

```bash [pnpm]
pnpm nuxt upgrade
```

```bash [bun]
bun x nuxt upgrade
```

```bash [deno]
deno x nuxt upgrade
```
::

### Nightly Release Channel

To use the latest Nuxt build and test features before their release, read about the [nightly release channel](https://nuxt.com/docs/3.x/guide/going-further/nightly-release-channel) guide.

::warning
The nightly release channel `latest` tag is currently tracking the Nuxt v4 branch, meaning that it is particularly likely to have breaking changes right now — be careful! You can opt in to the 3.x branch nightly releases with `"nuxt": "npm:nuxt-nightly@3x"`.
::

## Testing Nuxt 4

Nuxt 4 is **scheduled for release in Q2 2025**. It will include all the features currently available through `compatibilityVersion: 4`.

Until the release, it is possible to test many of Nuxt 4's breaking changes from Nuxt version 3.12+.

:video-accordion{title="Watch a video from Alexander Lichter showing how to opt in to Nuxt 4's breaking changes already" video-id="r4wFKlcJK6c"}

### Opting in to Nuxt 4

First, upgrade Nuxt to the [latest release](https://github.com/nuxt/nuxt/releases){rel="&#x22;nofollow&#x22;"}.

Then you can set your `compatibilityVersion` to match Nuxt 4 behavior:

::code-collapse
```ts [nuxt.config.ts] twoslash
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  // To re-enable _all_ Nuxt v3 behavior, set the following options:
  // srcDir: '.',
  // dir: {
  //   app: 'app'
  // },
  // experimental: {
  //   scanPageMeta: 'after-resolve',
  //   sharedPrerenderData: false,
  //   compileTemplate: true,
  //   resetAsyncDataToUndefined: true,
  //   templateUtils: true,
  //   relativeWatchPaths: true,
  //   normalizeComponentNames: false,
  //   spaLoadingTemplateLocation: 'within',
  //   parseErrorData: false,
  //   pendingWhenIdle: true,
  //   alwaysRunFetchOnKeyChange: true,
  //   defaults: {
  //     useAsyncData: {
  //       deep: true
  //     }
  //   }
  // },
  // features: {
  //   inlineStyles: true
  // },
  // unhead: {
  //   renderSSRHeadOptions: {
  //     omitLineBreaks: false
  //   }
  // }
})
```
::

::note
For now, you need to define the compatibility version in each layer that opts into Nuxt 4 behavior. This will not be required after Nuxt 4 is released.
::

When you set your `compatibilityVersion` to `4`, defaults throughout your Nuxt configuration will change to opt in to Nuxt v4 behavior, but you can granularly re-enable Nuxt v3 behavior when testing, following the commented out lines above. Please file issues if so, so that we can address them in Nuxt or in the ecosystem.

Breaking or significant changes are documented below along with migration steps and available configuration options.

### Migrating Using Codemods

To facilitate the upgrade process, we have collaborated with the [Codemod](https://github.com/codemod/codemod){rel="&#x22;nofollow&#x22;"} team to automate many migration steps with some open-source codemods.

::note
If you encounter any issues, please report them to the Codemod team with `npx codemod feedback` 🙏
::

For a complete list of Nuxt 4 codemods, detailed information on each, their source, and various ways to run them, visit the [Codemod Registry](https://app.codemod.com/registry){rel="&#x22;nofollow&#x22;"}.

You can run all the codemods mentioned in this guide using the following `codemod` recipe:

::code-group
```bash [npm]
