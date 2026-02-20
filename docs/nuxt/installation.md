# Installation

## Play Online

If you just want to play around with Nuxt in your browser without setting up a project, you can use one of our online sandboxes:

::card-group
  :::card
  ---
  icon: i-simple-icons-stackblitz
  target: _blank
  title: Open on StackBlitz
  to: https://nuxt.new/s/v4
  ---
  :::

  :::card
  ---
  icon: i-simple-icons-codesandbox
  target: _blank
  title: Open on CodeSandbox
  to: https://nuxt.new/c/v4
  ---
  :::
::

Or follow the steps below to set up a new Nuxt project on your computer.

## New Project

### Prerequisites

- **Node.js** - [`20.x`](https://nodejs.org/en){rel="&#x22;nofollow&#x22;"} or newer (but we recommend the [active LTS release](https://github.com/nodejs/release#release-schedule){rel="&#x22;nofollow&#x22;"})
- **Text editor** - There is no IDE requirement, but we recommend [Visual Studio Code](https://code.visualstudio.com/){rel="&#x22;nofollow&#x22;"} with the [official Vue extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar){rel="&#x22;nofollow&#x22;"} (previously known as Volar) or [WebStorm](https://www.jetbrains.com/webstorm/){rel="&#x22;nofollow&#x22;"}, which, along with [other JetBrains IDEs](https://www.jetbrains.com/ides/){rel="&#x22;nofollow&#x22;"}, offers great Nuxt support right out-of-the-box. If you use another editor, such as Neovim, you can configure [Vue Language Server](https://github.com/vuejs/language-tools){rel="&#x22;nofollow&#x22;"} support by following the [Vue Language Tools setup guides](https://github.com/vuejs/language-tools/wiki){rel="&#x22;nofollow&#x22;"}.
- **Terminal** - In order to run Nuxt commands

::note
Additional notes for an optimal setup:

- **Node.js**: Make sure to use an even numbered version (20, 22, etc.)
- **Neovim**: When configuring the Vue TypeScript plugin, make sure `location` points to the `@vue/language-server` package directory, not its binary. See the [Neovim setup guide](https://github.com/vuejs/language-tools/wiki/Neovim){rel=""nofollow""} for a working configuration.
- **WSL**: If you are using Windows and experience slow HMR, you may want to try using [WSL (Windows Subsystem for Linux)](https://learn.microsoft.com/en-us/windows/wsl/install){rel=""nofollow""} which may solve some performance issues.
- **Windows slow DNS resolution**: Instead of using `localhost:3000` for local dev server on Windows, use `127.0.0.1` for much faster loading experience on browsers.
::

Open a terminal (if you're using [Visual Studio Code](https://code.visualstudio.com){rel="&#x22;nofollow&#x22;"}, you can open an [integrated terminal](https://code.visualstudio.com/docs/terminal/basics){rel="&#x22;nofollow&#x22;"}) and use the following command to create a new starter project:

::code-group{sync="pm"}
```bash [npm]
npm create nuxt@latest <project-name>
```

```bash [yarn]
yarn create nuxt <project-name>
```

```bash [pnpm]
pnpm create nuxt@latest <project-name>
```

```bash [bun]
bun create nuxt@latest <project-name>
```

```bash [deno]
deno -A npm:create-nuxt@latest <project-name>
```
::

::tip
Alternatively, you can find other starters or themes by opening [nuxt.new](https://nuxt.new){rel=""nofollow""} and following the instructions there.
::

Open your project folder in Visual Studio Code:

```bash [Terminal]
code <project-name>
```

Or change directory into your new project from your terminal:

```bash
cd <project-name>
```

## Development Server

Now you'll be able to start your Nuxt app in development mode:

::code-group{sync="pm"}
```bash [npm]
npm run dev -- -o
```

```bash [yarn]
yarn dev --open
```

```bash [pnpm]
pnpm dev -o
```

```bash [bun]
bun run dev -o
