# nuxt devtools

```bash [Terminal]
npx nuxt devtools <COMMAND> [ROOTDIR] [--cwd=<directory>]
```

Running `nuxt devtools enable` will install the Nuxt DevTools globally, and also enable it within the particular project you are using. It is saved as a preference in your user-level `.nuxtrc`. If you want to remove devtools support for a particular project, you can run `nuxt devtools disable`.

## Arguments

| Argument      | Description                                    |
| ------------- | ---------------------------------------------- |
| `COMMAND`     | Command to run (options: \<enable\|disable>)   |
| `ROOTDIR="."` | Specifies the working directory (default: `.`) |

## Options

| Option              | Default | Description                                                                      |
| ------------------- | ------- | -------------------------------------------------------------------------------- |
| `--cwd=<directory>` |         | Specify the working directory, this takes precedence over ROOTDIR (default: `.`) |

::read-more
---
icon: i-simple-icons-nuxtdotjs
target: \_blank
to: https://devtools.nuxt.com
---
Read more about the **Nuxt DevTools**.
::
