### Opting in

You can opt in to the latest commits on the `main` branch to avoid waiting for the next release and helping the module by beta testing changes.

Update `@nuxtjs/i18n` dependency in your `package.json`:

```diff [package.json]
{
  "devDependencies": {
-   "@nuxtjs/i18n": "^9.0.0"
+   "@nuxtjs/i18n": "npm:@nuxtjs/i18n-edge"
  }
}
```

Remove lockfile (`package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`) and reinstall dependencies.
