### TypeScript changes

To make typings more consistent and expressive, some types have been renamed:

| `vue-router@3` | `vue-router@4`          |
| -------------- | ----------------------- |
| RouteConfig    | RouteRecordRaw          |
| Location       | RouteLocation           |
| Route          | RouteLocationNormalized |

## New Features

Some of new features to keep an eye on in Vue Router 4 include:

* [Dynamic Routing](../advanced/dynamic-routing.md)
* [Composition API](../advanced/composition-api.md)

---

---
url: /guide/migration/v4-to-v5.md
---
# Migrating to Vue Router 5

> \[!TIP]
> Vue Router 5 is a transition release that merges [unplugin-vue-router](https://uvr.esm.is) (file-based routing) into the core package. **If you're using Vue Router 4 without unplugin-vue-router, there are no breaking changes** - you can upgrade without any code modifications. The only exception is that the *iife* build no longer includes `@vue/devtools-api` because it has been upgraded to v8 and does not expose an IIFE build itself. You can track that change in [this issue](https://github.com/vuejs/devtools/issues/989).
>
> Vue Router 6 will be ESM-only and remove deprecated APIs. v5 gives you time to prepare for that transition.

## For Vue Router 4 Users (without file-based routing)

No breaking changes. Update your dependency and you're done:

```bash
pnpm update vue-router@5
```

## From unplugin-vue-router

If you were using unplugin-vue-router for file-based routing, migration is mostly import path changes.
