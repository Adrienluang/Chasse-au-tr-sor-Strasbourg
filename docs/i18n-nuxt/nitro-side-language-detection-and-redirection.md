### Nitro-side language detection and redirection

Language detection and redirection has been reimplemented to be handled from the Nitro server, this allows us to redirect requests earlier in the request lifecycle which improves performance.

The previous implementation did not work correctly when combined with prerendering which this new implementation does.

While this change makes detection and redirection more accurate and should better match the documented behavior, if this causes issues in your project it can be disabled by setting `experimental.nitroContextDetection: false`{.shiki,shiki-themes,material-theme-lighter,material-theme,material-theme-palenight lang="yml"} in the module options. The option to disable this feature is temporary and will be removed in a future version.
