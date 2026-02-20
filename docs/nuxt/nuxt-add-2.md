# nuxt add

```bash [Terminal]
npx nuxt add <TEMPLATE> <NAME> [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [--force]
```

## Arguments

| Argument   | Description                                                                                                                                                                                                       |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TEMPLATE` | Specify which template to generate (options: \<api\|app\|app-config\|component\|composable\|error\|layer\|layout\|middleware\|module\|page\|plugin\|server-middleware\|server-plugin\|server-route\|server-util>) |
| `NAME`     | Specify name of the generated file                                                                                                                                                                                |

## Options

| Option                             | Default | Description                              |
| ---------------------------------- | ------- | ---------------------------------------- |
| `--cwd=<directory>`                | `.`     | Specify the working directory            |
| `--logLevel=<silent|info|verbose>` |         | Specify build-time log level             |
| `--force`                          | `false` | Force override file if it already exists |

**Modifiers:**

Some templates support additional modifier flags to add a suffix (like `.client` or `.get`) to their name.

```bash [Terminal]
