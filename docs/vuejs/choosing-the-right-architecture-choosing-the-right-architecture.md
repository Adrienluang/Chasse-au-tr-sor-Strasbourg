### Choosing the Right Architecture {#choosing-the-right-architecture}

If your use case is sensitive to page load performance, avoid shipping it as a pure client-side SPA. You want your server to be directly sending HTML containing the content the users want to see. Pure client-side rendering suffers from slow time-to-content. This can be mitigated with [Server-Side Rendering (SSR)](/guide/extras/ways-of-using-vue#fullstack-ssr) or [Static Site Generation (SSG)](/guide/extras/ways-of-using-vue#jamstack-ssg). Check out the [SSR Guide](/guide/scaling-up/ssr) to learn about performing SSR with Vue. If your app doesn't have rich interactivity requirements, you can also use a traditional backend server to render the HTML and enhance it with Vue on the client.

If your main application has to be an SPA, but has marketing pages (landing, about, blog), ship them separately! Your marketing pages should ideally be deployed as static HTML with minimal JS, by using SSG.
