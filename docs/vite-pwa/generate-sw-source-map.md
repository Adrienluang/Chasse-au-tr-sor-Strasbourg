### Generate SW Source Map

## Importing Virtual Modules

With this behavior, you **must** import one of the virtual modules exposed by `vite-plugin-pwa` plugin **only** if you need to prompt a dialog to the user when the application is ready to work offline, otherwise you can import or just omit it.

If you don't import one of the virtual modules, the automatic reload will still work.
