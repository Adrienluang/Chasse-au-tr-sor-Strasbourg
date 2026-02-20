# nuxt typecheck

```bash [Terminal]
npx nuxt typecheck [ROOTDIR] [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [--dotenv] [-e, --extends=<layer-name>]
```

The `typecheck` command runs [`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/tsc){rel="&#x22;nofollow&#x22;"} to check types throughout your app.

## Arguments

| Argument      | Description                                    |
| ------------- | ---------------------------------------------- |
| `ROOTDIR="."` | Specifies the working directory (default: `.`) |

## Options

| Option                             | Default | Description                                                                      |
| ---------------------------------- | ------- | -------------------------------------------------------------------------------- |
| `--cwd=<directory>`                |         | Specify the working directory, this takes precedence over ROOTDIR (default: `.`) |
| `--logLevel=<silent|info|verbose>` |         | Specify build-time log level                                                     |
| `--dotenv`                         |         | Path to `.env` file to load, relative to the root directory                      |
| `-e, --extends=<layer-name>`       |         | Extend from a Nuxt layer                                                         |

::note
This command sets `process.env.NODE_ENV` to `production`. To override, define `NODE_ENV` in a [`.env`](https://nuxt.com/docs/3.x/directory-structure/env) file or as a command-line argument.
::

::read-more
---
to: https://nuxt.com/docs/3.x/guide/concepts/typescript#type-checking
---
Read more on how to enable type-checking at build or development time.
::
