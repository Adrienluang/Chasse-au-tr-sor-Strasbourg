# DigitalOcean

Nuxt supports deploying on the [DigitalOcean App Platform](https://docs.digitalocean.com/products/app-platform/){rel="&#x22;nofollow&#x22;"} with minimal configuration.

## Setup

1. Create a new DigitalOcean app following the [guide](https://docs.digitalocean.com/products/app-platform/how-to/create-apps/){rel="&#x22;nofollow&#x22;"}.
2. Next, you'll need to configure environment variables. In your app settings, ensure the following [app-level environment variables](https://docs.digitalocean.com/products/app-platform/how-to/use-environment-variables/){rel="&#x22;nofollow&#x22;"}:
   ```bash
   SERVER_PRESET=digital-ocean
   ```
3. You will need to ensure you set an `engines.node` field in your app's `package.json` to ensure DigitalOcean uses a supported version of Node.js:
   ```json \[package.json]
   {
     "engines": {
         "node": "20.x"
     }
   }
   ```
4. You'll also need to add a run command so DigitalOcean knows what command to run after a build. You can do so by adding a start script to your `package.json`:
   ```json \[package.json]
   {
     "scripts": {
         "start": "node .output/server/index.mjs"
     }
   }
   ```
5. Finally, you'll need to add this start script to your DigitalOcean app's run command. Go to `Components > Settings > Commands`, click "Edit", then add `npm run start`

::tip
Your Nuxt app should be live at a DigitalOcean generated URL and you can now follow [the rest of the DigitalOcean deployment guide](https://docs.digitalocean.com/products/app-platform/how-to/manage-deployments/){rel=""nofollow""}.
::

## Learn more

::read-more
---
target: _blank
to: https://nitro.unjs.io/deploy/providers/digitalocean
---
Head over **Nitro documentation** to learn more about the digitalocean deployment preset.
::
