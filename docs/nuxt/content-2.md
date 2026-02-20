# content

[Nuxt Content](https://content.nuxt.com){rel="&#x22;nofollow&#x22;"} reads the `content/` directory in your project and parses `.md`, `.yml`, `.csv` and `.json` files to create a file-based CMS for your application.

- Render your content with built-in components.
- Query your content with a MongoDB-like API.
- Use your Vue components in Markdown files with the MDC syntax.
- Automatically generate your navigation.

::read-more{target="_blank" to="https://content.nuxt.com"}
Learn more in **Nuxt Content** documentation.
::

## Enable Nuxt Content

Install the `@nuxt/content` module in your project as well as adding it to your `nuxt.config.ts` with one command:

```bash [Terminal]
npx nuxt module add content
```

## Create Content

Place your markdown files inside the `content/` directory:

```md [content/index.md]
