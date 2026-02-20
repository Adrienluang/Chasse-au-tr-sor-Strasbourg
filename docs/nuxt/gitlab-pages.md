# GitLab Pages

Nuxt supports deploying on the [GitLab Pages](https://docs.gitlab.com/ee/user/project/pages){rel="&#x22;nofollow&#x22;"} with minimal configuration.

::caution
GitLab Pages only support static sites, Nuxt will pre-render your application to static HTML files.
::

::caution
If you are **not** using a custom domain, you need to set `NUXT_APP_BASE_URL` to your repository-slug for your build step.

**Example**: `https://<group/user>.gitlab.io/<repository>/`: `NUXT_APP_BASE_URL=/<repository>/ npm run generate`
::

## Deployment

1. Here is an example GitLab Pages workflow to deploy your site to GitLab Pages:

```yaml [.gitlab-ci.yml]
