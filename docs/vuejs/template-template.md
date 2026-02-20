### `<template>` {#template}

- Each `*.vue` file can contain at most one top-level `<template>` block.

- Contents will be extracted and passed on to `@vue/compiler-dom`, pre-compiled into JavaScript render functions, and attached to the exported component as its `render` option.
