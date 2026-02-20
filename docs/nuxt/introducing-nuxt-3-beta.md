# Introducing Nuxt 3 Beta

We are excited to open source Nuxt 3 after more than a year of intense development. The repository is available on GitHub on [nuxt/nuxt](https://github.com/nuxt/nuxt){rel="&#x22;nofollow&#x22;"} under the [MIT](https://github.com/nuxt/nuxt/blob/main/LICENSE){rel="&#x22;nofollow&#x22;"} license.

::tip
The documentation is available on <https://nuxt.com>{rel=""nofollow""}.
::

## A new foundation

On top of supporting [Vue 3](https://vuejs.org){rel="&#x22;nofollow&#x22;"} or [Vite](https://vitejs.dev){rel="&#x22;nofollow&#x22;"}, Nuxt 3 contains a new [server engine](https://nuxt.com/docs/guide/concepts/server-engine){rel="&#x22;nofollow&#x22;"}, unlocking new full-stack capabilities to Nuxt server and beyond. It's the first JavaScript application server that is portable across a variety of modern cloud hosting providers.

In production, it builds your Vue application and server into one universal `.output` directory. This output is light: minified and without any other Node.js dependencies (except polyfills). You can deploy this output on any system supporting JavaScript, whether Node.js, Serverless, Workers, Edge-side rendering or purely static.

**Bonus:** this server engine can be used on existing Nuxt 2 projects with [Nuxt Bridge](https://nuxt.com/docs/getting-started/bridge){rel="&#x22;nofollow&#x22;"} 🚀

Head over the [Nuxt 3 homepage](https://nuxt.com){rel="&#x22;nofollow&#x22;"} to learn more about Nuxt Nitro and Nuxt Bridge.

## Important notes

Nuxt 3 is currently in beta, so expect things to break (and be fixed quickly). We have [plenty of work left](https://github.com/nuxt/nuxt/issues){rel="&#x22;nofollow&#x22;"} but we want to open it publicly to gather feedback and contributions from the community 💚

**Do not use it for production until we reach the first release candidate.**

During the beta, almost every commit will [trigger a new npm release](https://github.com/nuxt/nuxt/blob/main/.github/workflows/ci.yml#L111-L119){rel="&#x22;nofollow&#x22;"}; you may want to look at the [merged pull requests](https://github.com/nuxt/nuxt/pulls?q=is%3Apr+is%3Amerged){rel="&#x22;nofollow&#x22;"} until we begin generating automated changelogs in the documentation.

We are working every day to improve the documentation, explaining as much as possible all the concepts, features and usage of Nuxt 3.

Check out the community section of the Nuxt 3 website for [getting help](https://nuxt.com/docs/community/getting-help){rel="&#x22;nofollow&#x22;"}, [reporting bugs](https://nuxt.com/docs/community/reporting-bugs){rel="&#x22;nofollow&#x22;"} or [contributing to the framework](https://nuxt.com/docs/community/contribution){rel="&#x22;nofollow&#x22;"}.

## Timeline

Here some major milestones we've achieved on the way to Nuxt 3:

- **Jul 2, 2020**: Nuxt 3 first commit with full TypeScript rewrite
- **Aug 7, 2020**: Webpack 5 support
- **Sep 15, 2020**: [`pages/`](https://nuxt.com/docs/guide/directory-structure/pages){rel="&#x22;nofollow&#x22;"} support
- **Oct 29, 2020**: [Vue 3](https://vuejs.org){rel="&#x22;nofollow&#x22;"} support with bundle-renderer
- **Nov 2, 2020**: [Nuxt Nitro](https://nuxt.com/guide/concepts/server-engine){rel="&#x22;nofollow&#x22;"} initial work
- **Jan 22, 2021**: Initial [Vite](https://vitejs.dev){rel="&#x22;nofollow&#x22;"} support
- **Feb 4, 2021**: Nuxt can deploy on [major serverless platforms](https://nuxt.com/docs/getting-started/deployment){rel="&#x22;nofollow&#x22;"}
- **Mar 6, 2021**: [UnJS](https://github.com/unjs){rel="&#x22;nofollow&#x22;"} organisation created on GitHub
- **Mar 28, 2021**: Init Nuxt Kit and Nuxt CLI ([nuxi](https://nuxt.com/docs/api/commands/add){rel="&#x22;nofollow&#x22;"})
- **May 20, 2021**: [`app.vue`](https://nuxt.com/docs/guide/directory-structure/app){rel="&#x22;nofollow&#x22;"} support (`pages/` becomes optional)
- **Jun 30, 2021**: [`layouts/`](https://nuxt.com/docs/guide/directory-structure/layouts){rel="&#x22;nofollow&#x22;"} support
- **Jul 15, 2021**: Native ESM support
- **Aug 10, 2021**: Auto import of composables and components
- **Sep 5, 2021**: Init [Nuxt Bridge](https://nuxt.com/docs/bridge/overview){rel="&#x22;nofollow&#x22;"} for improving Nuxt 2 experience
- **Sep 7, 2021**: Support Vite build for production
- **Oct 11, 2021**: Add [`useState`](https://nuxt.com/docs/getting-started/state-management){rel="&#x22;nofollow&#x22;"} and [`useFetch`](https://nuxt.com/docs/api/composables/use-fetch){rel="&#x22;nofollow&#x22;"} composables

So far, we've merged [385 pull requests](https://github.com/nuxt/nuxt/pulls?q=is%3Apr+is%3Amerged){rel="&#x22;nofollow&#x22;"}, closed [229 issues](https://github.com/nuxt/nuxt/issues?q=is%3Aissue+is%3Aclosed){rel="&#x22;nofollow&#x22;"} and made [925+ commits](https://github.com/nuxt/nuxt/commits/main){rel="&#x22;nofollow&#x22;"}.

We are excited to hear your thoughts and we thank you for your patience.

Now you can go over the [Nuxt 3 documentation](https://nuxt.com){rel="&#x22;nofollow&#x22;"} 😊

Don't forget to follow us on [Twitter](https://x.com/nuxt_js){rel="&#x22;nofollow&#x22;"} to get the latest news about Nuxt!
