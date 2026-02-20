### Netlify

Create a `_redirects` file that is included with your deployed files:

```[_redirects ~vscode-icons:file-type-light-netlify~]
/* /index.html 200
```

In vue-cli, nuxt, and vite projects, this file usually goes under a folder named `static` or `public`.

You can read more about the syntax on [Netlify documentation](https://docs.netlify.com/routing/redirects/rewrites-proxies/#history-pushstate-and-single-page-apps). You can also [create a `netlify.toml`](https://docs.netlify.com/configure-builds/file-based-configuration/) to combine *redirections* with other Netlify features.
