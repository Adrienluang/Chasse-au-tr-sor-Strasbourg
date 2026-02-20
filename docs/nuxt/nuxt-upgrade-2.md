# nuxt upgrade

```bash [Terminal]
npx nuxt upgrade [ROOTDIR] [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [--dedupe] [-f, --force] [-ch, --channel=<stable|nightly|v3|v4|v4-nightly|v3-nightly>]
```

The `upgrade` command upgrades Nuxt to the latest version.

## Arguments

| Argument      | Description                                    |
| ------------- | ---------------------------------------------- |
| `ROOTDIR="."` | Specifies the working directory (default: `.`) |

## Options

| Option                                                        | Default  | Description                                                                      |
| ------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------- |
| `--cwd=<directory>`                                           |          | Specify the working directory, this takes precedence over ROOTDIR (default: `.`) |
| `--logLevel=<silent|info|verbose>`                            |          | Specify build-time log level                                                     |
| `--dedupe`                                                    |          | Dedupe dependencies after upgrading                                              |
| `-f, --force`                                                 |          | Force upgrade to recreate lockfile and node\_modules                             |
| `-ch, --channel=<stable|nightly|v3|v4|v4-nightly|v3-nightly>` | `stable` | Specify a channel to install from (default: stable)                              |
