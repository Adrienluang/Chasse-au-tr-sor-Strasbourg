# nuxt test

```bash [Terminal]
npx nuxt test [ROOTDIR] [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [--dev] [--watch]
```

The `test` command runs tests using [`@nuxt/test-utils`](https://nuxt.com/docs/4.x/getting-started/testing). This command sets `process.env.NODE_ENV` to `test` if not already set.

## Arguments

| Argument      | Description                                    |
| ------------- | ---------------------------------------------- |
| `ROOTDIR="."` | Specifies the working directory (default: `.`) |

## Options

| Option                             | Default | Description                                                                      |
| ---------------------------------- | ------- | -------------------------------------------------------------------------------- |
| `--cwd=<directory>`                |         | Specify the working directory, this takes precedence over ROOTDIR (default: `.`) |
| `--logLevel=<silent|info|verbose>` |         | Specify build-time log level                                                     |
| `--dev`                            |         | Run in dev mode                                                                  |
| `--watch`                          |         | Watch mode                                                                       |

::note
This command sets `process.env.NODE_ENV` to `test`.
::
