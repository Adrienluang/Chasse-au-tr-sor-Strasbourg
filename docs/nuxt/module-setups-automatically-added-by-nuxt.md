# Module setups (automatically added by Nuxt)
setups.@nuxt/test-utils="3.23.0"
```

If present, the properties in the `nuxt.config` file will overwrite the properties in `.nuxtrc` file.

::note
Nuxt automatically adds a `setups` section to track module installation and upgrade state. This is used internally for [module lifecycle hooks](https://nuxt.com/docs/4.x/api/kit/modules#using-lifecycle-hooks-for-module-installation-and-upgrade) and should not be modified manually.
::

::read-more{to="https://nuxt.com/docs/4.x/api/configuration/nuxt-config"}
Discover all the available options in the **Nuxt configuration** documentation.
::

## Global `.nuxtrc` File

You can also create a global `.nuxtrc` file in your home directory to apply configurations globally.

- On macOS/Linux, this file is located at:
  ```md
  ~/.nuxtrc
  ```
- On Windows, it is located at:
  ```md
  C:\Users\{username}\.nuxtrc
  ```

This global `.nuxtrc` file allows you to define default settings that apply to all Nuxt projects on your system. However, project-level `.nuxtrc` files will override these global settings, and `nuxt.config` will take precedence over both.
