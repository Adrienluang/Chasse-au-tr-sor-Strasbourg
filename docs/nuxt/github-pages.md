# GitHub Pages

Nuxt supports deploying to [GitHub Pages](https://pages.github.com/){rel="&#x22;nofollow&#x22;"} with minimal configuration.

::caution
GitHub Pages only support static sites, Nuxt will pre-render your application to static HTML files.
::

::caution
If you are **not** using a custom domain, you need to set `NUXT_APP_BASE_URL` to your repository-slug for your build step.

**Example**: `https://<user>.github.io/<repository>/`: `NUXT_APP_BASE_URL=/<repository>/ npx nuxt build --preset github_pages`
::

## Setup

Follow the steps to [create a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site){rel="&#x22;nofollow&#x22;"}.

## Deployment

Here is an example GitHub Actions workflow to deploy your site to GitHub Pages using the `github_pages` preset:

```yaml [.github/workflows/deploy.yml]
