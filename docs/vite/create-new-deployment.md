# Create new deployment
$ npx wrangler pages deploy dist
```

After your assets are uploaded, Wrangler will give you a preview URL to inspect your site. When you log into the Cloudflare Pages dashboard, you will see your new project.

### Cloudflare Pages with Git

1. Push your code to your git repository (GitHub, GitLab).
2. Log in to the Cloudflare dashboard and select your account in **Account Home** > **Pages**.
3. Select **Create a new Project** and the **Connect Git** option.
4. Select the git project you want to deploy and click **Begin setup**
5. Select the corresponding framework preset in the build setting depending on the Vite framework you have selected.
6. Then save and deploy!
7. Your application is deployed! (e.g `https://<PROJECTNAME>.pages.dev/`)

After your project has been imported and deployed, all subsequent pushes to branches will generate [Preview Deployments](https://developers.cloudflare.com/pages/platform/preview-deployments/) unless specified not to in your [branch build controls](https://developers.cloudflare.com/pages/platform/branch-build-controls/). All changes to the Production Branch (commonly “main”) will result in a Production Deployment.

You can also add custom domains and handle custom build settings on Pages. Learn more about [Cloudflare Pages Git Integration](https://developers.cloudflare.com/pages/get-started/#manage-your-site).

## Google Firebase

1. Make sure you have [firebase-tools](https://www.npmjs.com/package/firebase-tools) installed.

2. Create `firebase.json` and `.firebaserc` at the root of your project with the following content:

   ```json [firebase.json]
   {
     "hosting": {
       "public": "dist",
       "ignore": [],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

   ```js [.firebaserc]
   {
     "projects": {
       "default": "<YOUR_FIREBASE_ID>"
     }
   }
   ```

3. After running `npm run build`, deploy using the command `firebase deploy`.

## Surge

1. First install [surge](https://www.npmjs.com/package/surge), if you haven’t already.

2. Run `npm run build`.

3. Deploy to surge by typing `surge dist`.

You can also deploy to a [custom domain](http://surge.sh/help/adding-a-custom-domain) by adding `surge dist yourdomain.com`.

## Azure Static Web Apps

You can quickly deploy your Vite app with Microsoft Azure [Static Web Apps](https://aka.ms/staticwebapps) service. You need:

* An Azure account and a subscription key. You can create a [free Azure account here](https://azure.microsoft.com/free).
* Your app code pushed to [GitHub](https://github.com).
* The [SWA Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) in [Visual Studio Code](https://code.visualstudio.com).

Install the extension in VS Code and navigate to your app root. Open the Static Web Apps extension, sign in to Azure, and click the '+' sign to create a new Static Web App. You will be prompted to designate which subscription key to use.

Follow the wizard started by the extension to give your app a name, choose a framework preset, and designate the app root (usually `/`) and built file location `/dist`. The wizard will run and will create a GitHub action in your repo in a `.github` folder.

The action will work to deploy your app (watch its progress in your repo's Actions tab) and, when successfully completed, you can view your app in the address provided in the extension's progress window by clicking the 'Browse Website' button that appears when the GitHub action has run.

## Render

You can deploy your Vite app as a Static Site on [Render](https://render.com/).

1. Create a [Render account](https://dashboard.render.com/register).

2. In the [Dashboard](https://dashboard.render.com/), click the **New** button and select **Static Site**.

3. Connect your GitHub/GitLab account or use a public repository.

4. Specify a project name and branch.
   * **Build Command**: `npm install && npm run build`
   * **Publish Directory**: `dist`

5. Click **Create Static Site**.

   Your app should be deployed at `https://<PROJECTNAME>.onrender.com/`.

By default, any new commit pushed to the specified branch will automatically trigger a new deployment. [Auto-Deploy](https://render.com/docs/deploys#toggling-auto-deploy-for-a-service) can be configured in the project settings.

You can also add a [custom domain](https://render.com/docs/custom-domains) to your project.

## Flightcontrol

Deploy your static site using [Flightcontrol](https://www.flightcontrol.dev/?ref=docs-vite) by following these [instructions](https://www.flightcontrol.dev/docs/reference/examples/vite?ref=docs-vite).

## Kinsta Static Site Hosting

Deploy your static site using [Kinsta](https://kinsta.com/static-site-hosting/) by following these [instructions](https://kinsta.com/docs/static-site-hosting/static-site-quick-start/react-static-site-examples/#react-with-vite).

## xmit Static Site Hosting

Deploy your static site using [xmit](https://xmit.co) by following this [guide](https://xmit.dev/posts/vite-quickstart/).

## Zephyr Cloud

[Zephyr Cloud](https://zephyr-cloud.io) is a deployment platform that integrates directly into your build process and provides global edge distribution for module federation and other kind of applications.

Zephyr follows a different approach than other cloud providers. It integrates directly with Vite build process, so every time you build or run the dev server for your application, it will be automatically deployed with Zephyr Cloud.

Follow the steps in [the Vite deployment guide](https://docs.zephyr-cloud.io/bundlers/vite) to get started.

---

---
url: /guide/env-and-mode.md
---
