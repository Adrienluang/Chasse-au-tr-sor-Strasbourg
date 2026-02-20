### Become a Community Leader {#become-a-community-leader}

There's a lot you can do to help Vue grow in your community:

- **Present at your local meetup.** Whether it's giving a talk or running a workshop, you can bring a lot of value to your community by helping both new and experienced Vue developers continue to grow.
- **Start your own meetup.** If there's not already a Vue meetup in your area, you can start your own! Use the [resources at events.vuejs.org](https://events.vuejs.org/resources/#getting-started) to help you succeed!
- **Help meetup organizers.** There can never be too much help when it comes to running an event, so offer a hand to help out local organizers to help make every event a success.

If you have any questions on how you can get more involved with your local Vue community, reach out on Twitter at [@vuejs_events](https://x.com/vuejs_events)!

---

---
url: /ecosystem/newsletters.md
---
# Community Newsletters {#community-newsletters}

There are many great newsletters / Vue-dedicated blogs from the community bringing you latest news and happenings in the Vue ecosystem. Here is a non-exhaustive list of active ones that we have come across:

- [Vue.js Feed](https://vuejsfeed.com/)
- [Michael Thiessen](https://michaelnthiessen.com/newsletter)
- [Jakub Andrzejewski](https://dev.to/jacobandrewsky)
- [Weekly Vue News](https://weekly-vue.news/)
- [Vue.js Developers Newsletter](https://vuejsdevelopers.com/newsletter/)

If you know a great one that isn't already included, please submit a pull request using the link below!

---

---
url: /api/compile-time-flags.md
---

# Compile-Time Flags {#compile-time-flags}

:::tip
Compile-time flags only apply when using the `esm-bundler` build of Vue (i.e. `vue/dist/vue.esm-bundler.js`).
:::

When using Vue with a build step, it is possible to configure a number of compile-time flags to enable / disable certain features. The benefit of using compile-time flags is that features disabled this way can be removed from the final bundle via tree-shaking.

Vue will work even if these flags are not explicitly configured. However, it is recommended to always configure them so that the relevant features can be properly removed when possible.

See [Configuration Guides](#configuration-guides) on how to configure them depending on your build tool.

## `__VUE_OPTIONS_API__` {#VUE_OPTIONS_API}

- **Default:** `true`

  Enable / disable Options API support. Disabling this will result in smaller bundles, but may affect compatibility with 3rd party libraries if they rely on Options API.

## `__VUE_PROD_DEVTOOLS__` {#VUE_PROD_DEVTOOLS}

- **Default:** `false`

  Enable / disable devtools support in production builds. This will result in more code included in the bundle, so it is recommended to only enable this for debugging purposes.

## `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__` {#VUE_PROD_HYDRATION_MISMATCH_DETAILS}

- **Default:** `false`

  Enable/disable detailed warnings for hydration mismatches in production builds. This will result in more code included in the bundle, so it is recommended to only enable this for debugging purposes.

- Only available in 3.4+

## Configuration Guides {#configuration-guides}
