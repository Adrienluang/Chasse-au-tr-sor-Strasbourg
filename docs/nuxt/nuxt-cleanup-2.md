# nuxt cleanup

```bash [Terminal]
npx nuxt cleanup [ROOTDIR] [--cwd=<directory>]
```

The `cleanup` command removes common generated Nuxt files and caches, including:

- `.nuxt`
- `.output`
- `node_modules/.vite`
- `node_modules/.cache`

## Arguments

| Argument      | Description                                    |
| ------------- | ---------------------------------------------- |
| `ROOTDIR="."` | Specifies the working directory (default: `.`) |

## Options

| Option              | Default | Description                                                                      |
| ------------------- | ------- | -------------------------------------------------------------------------------- |
| `--cwd=<directory>` |         | Specify the working directory, this takes precedence over ROOTDIR (default: `.`) |
