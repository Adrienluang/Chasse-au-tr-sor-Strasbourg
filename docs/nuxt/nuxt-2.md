# .nuxt

::important
This directory should be added to your [`.gitignore`](https://nuxt.com/docs/3.x/directory-structure/gitignore) file to avoid pushing the dev build output to your repository.
::

This directory is interesting if you want to learn more about the files Nuxt generates based on your directory structure.

Nuxt also provides a Virtual File System (VFS) for modules to add templates to this directory without writing them to disk.

You can explore the generated files by opening the [Nuxt DevTools](https://devtools.nuxt.com){rel="&#x22;nofollow&#x22;"} in development mode and navigating to the **Virtual Files** tab.

::warning
You should not touch any files inside since the whole directory will be re-created when running [`nuxt dev`](https://nuxt.com/docs/3.x/api/commands/dev).
::
