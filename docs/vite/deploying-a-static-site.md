# Deploying a Static Site

The following guides are based on some shared assumptions:

* You are using the default build output location (`dist`). This location [can be changed using `build.outDir`](/config/build-options.md#build-outdir), and you can extrapolate instructions from these guides in that case.
* You are using npm. You can use equivalent commands to run the scripts if you are using Yarn or other package managers.
* Vite is installed as a local dev dependency in your project, and you have setup the following npm scripts:

```json [package.json]
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

It is important to note that `vite preview` is intended for previewing the build locally and not meant as a production server.

::: tip NOTE
These guides provide instructions for performing a static deployment of your Vite site. Vite also supports Server-Side Rendering. SSR refers to front-end frameworks that support running the same application in Node.js, pre-rendering it to HTML, and finally hydrating it on the client. Check out the [SSR Guide](./ssr) to learn about this feature. On the other hand, if you are looking for integration with traditional server-side frameworks, check out the [Backend Integration guide](./backend-integration) instead.
:::

## Building the App

You may run `npm run build` command to build the app.

```bash
$ npm run build
```

By default, the build output will be placed at `dist`. You may deploy this `dist` folder to any of your preferred platforms.

### Testing the App Locally

Once you've built the app, you may test it locally by running `npm run preview` command.

```bash
$ npm run preview
```

The `vite preview` command will boot up a local static web server that serves the files from `dist` at `http://localhost:4173`. It's an easy way to check if the production build looks OK in your local environment.

You may configure the port of the server by passing the `--port` flag as an argument.

```json [package.json]
{
  "scripts": {
    "preview": "vite preview --port 8080"
  }
}
```

Now the `preview` command will launch the server at `http://localhost:8080`.

## GitHub Pages

1. **Update Vite Config**

   Set the correct `base` in `vite.config.js`.

   If you are deploying to `https://<USERNAME>.github.io/`, or to a custom domain through GitHub Pages (eg. `www.example.com`), set `base` to `'/'`. Alternatively, you can remove `base` from the configuration, as it defaults to `'/'`.

   If you are deploying to `https://<USERNAME>.github.io/<REPO>/` (eg. your repository is at `https://github.com/<USERNAME>/<REPO>`), then set `base` to `'/<REPO>/'`.

2. **Enable GitHub Pages**

   In your repository, go to **Settings → Pages**. Under **Build and deployment**, open the **Source** dropdown, and select **GitHub Actions**.

   GitHub will now deploy your site using a GitHub Actions [workflow](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows), which is necessary since Vite requires a build step for deployment.

3. **Create a Workflow**

   Create a new file in your repository at `.github/workflows/deploy.yml`. You can also click on **“create your own”** from the previous step, which will generate a starter workflow file for you.

   Here’s a sample workflow that installs dependencies with npm, builds the site, and deploys it whenever you push changes to the `main` branch:

   ```yaml \[.github/workflows/deploy.yml]
   # Simple workflow for deploying static content to GitHub Pages
   name: Deploy static content to Pages

   on:
     # Runs on pushes targeting the default branch
     push:
       branches: ['main']

     # Allows you to run this workflow manually from the Actions tab
     workflow_dispatch:

   # Sets the GITHUB_TOKEN permissions to allow deployment to GitHub Pages
   permissions:
     contents: read
     pages: write
     id-token: write

   # Allow one concurrent deployment
   concurrency:
     group: 'pages'
     cancel-in-progress: true

   jobs:
     # Single deploy job since we're just deploying
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v5
         - name: Set up Node
           uses: actions/setup-node@v6
           with:
             node-version: lts/*
             cache: 'npm'
         - name: Install dependencies
           run: npm ci
         - name: Build
           run: npm run build
         - name: Setup Pages
           uses: actions/configure-pages@v5
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v4
           with:
             # Upload dist folder
             path: './dist'
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

## GitLab Pages and GitLab CI

1. Set the correct `base` in `vite.config.js`.

   If you are deploying to `https://<USERNAME or GROUP>.gitlab.io/`, you can omit `base` as it defaults to `'/'`.

   If you are deploying to `https://<USERNAME or GROUP>.gitlab.io/<REPO>/`, for example your repository is at `https://gitlab.com/<USERNAME>/<REPO>`, then set `base` to `'/<REPO>/'`.

2. Create a file called `.gitlab-ci.yml` in the root of your project with the content below. This will build and deploy your site whenever you make changes to your content:

   ```yaml [.gitlab-ci.yml]
   image: node:lts
   pages:
     stage: deploy
     cache:
       key:
         files:
           - package-lock.json
         prefix: npm
       paths:
         - node_modules/
     script:
       - npm install
       - npm run build
       - cp -a dist/. public/
     artifacts:
       paths:
         - public
     rules:
       - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
   ```

## Netlify

### Netlify CLI

1. Install the [Netlify CLI](https://cli.netlify.com/).
2. Create a new site using `ntl init`.
3. Deploy using `ntl deploy`.

```bash
