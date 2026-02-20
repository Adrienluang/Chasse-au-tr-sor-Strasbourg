### Bundle for NPM

If you further want to build and publish your plugin for others to use, see [Vite's section on Library Mode](https://vite.dev/guide/build.html#library-mode).

---

---
url: /guide/typescript/overview.md
---

# Using Vue with TypeScript {#using-vue-with-typescript}

A type system like TypeScript can detect many common errors via static analysis at build time. This reduces the chance of runtime errors in production, and also allows us to more confidently refactor code in large-scale applications. TypeScript also improves developer ergonomics via type-based auto-completion in IDEs.

Vue is written in TypeScript itself and provides first-class TypeScript support. All official Vue packages come with bundled type declarations that should work out-of-the-box.

## Project Setup {#project-setup}

[`create-vue`](https://github.com/vuejs/create-vue), the official project scaffolding tool, offers the options to scaffold a [Vite](https://vite.dev/)-powered, TypeScript-ready Vue project.
