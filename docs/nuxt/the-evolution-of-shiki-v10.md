# The Evolution of Shiki v1.0

[Shiki](https://github.com/shikijs/shiki){rel="&#x22;nofollow&#x22;"} is a syntax highlighter that uses [TextMate grammars and themes](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide#textmate-grammars){rel="&#x22;nofollow&#x22;"}, the same engine that powers VS Code. It provides one of the most accurate and beautiful syntax highlighting for your code snippets. It was created by [Pine Wu](https://github.com/octref){rel="&#x22;nofollow&#x22;"} back in 2018, when he was part of the VS Code team. It started as an experiment to use [Oniguruma](https://github.com/microsoft/vscode-oniguruma){rel="&#x22;nofollow&#x22;"} to do syntax highlighting.

Different from existing syntax highlighters like [Prism](https://prismjs.com/){rel="&#x22;nofollow&#x22;"} and [Highlight.js](https://highlightjs.org/){rel="&#x22;nofollow&#x22;"} that designed to run in the browser, Shiki took a different approach by **highlighting ahead of time**. It ships the highlighted HTML to the client, producing accurate and beautiful syntax highlighting with **zero JavaScript**. It soon took off and became a very popular choice, especially for static site generators and documentation sites.

::collapsible{name="Shiki Example"}
For example, with the code snippet below:

```ts
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
  ],
})
```

Shiki will generate the following HTML:

```html
<pre class="shiki material-theme-palenight" style="background-color:#292D3E;color:#babed8" tabindex="0">
  <code>
    <span class="line"><span style="color:#89DDFF;font-style:italic">export</span><span style="color:#89DDFF;font-style:italic"> default</span><span style="color:#82AAFF"> defineNuxtConfig</span><span style="color:#BABED8">(</span><span style="color:#89DDFF">{</span></span>
    <span class="line"><span style="color:#F07178">  modules</span><span style="color:#89DDFF">:</span><span style="color:#BABED8"> [</span></span>
    <span class="line"><span style="color:#89DDFF">    '</span><span style="color:#C3E88D">@nuxt/content</span><span style="color:#89DDFF">'</span><span style="color:#89DDFF">,</span></span>
    <span class="line"><span style="color:#BABED8">  ]</span><span style="color:#89DDFF">,</span></span>
    <span class="line"><span style="color:#89DDFF">}</span><span style="color:#BABED8">)</span></span>
  </code>
</pre>
```

It might look a bit overwhelming if you read it, but **this piece of HTML works everywhere without any JavaScript or CSS**. TextMate grammars has a very rich representation of the types of every token (TextMate scopes). Since Shiki flattens all the tokens into styled spans, it achieves accurate results that most traditional CSS-based highlighters have difficulties achieving.
::

While Shiki is awesome, it's still a library that is designed to run on Node.js. This means it is limited to highlighting static code only and would have trouble with dynamic code, because Shiki doesn't work in the browser. In addition, Shiki relies on the WASM binary of Oniguruma, as well as a bunch of heavy grammar and theme files in JSON. It uses Node.js filesystem and path resolution to load these files, which is not accessible in the browser.

To improve that situation, I [started this RFC](https://github.com/shikijs/shiki/issues/91){rel="&#x22;nofollow&#x22;"} that later landed with [this PR](https://github.com/shikijs/shiki/pull/109){rel="&#x22;nofollow&#x22;"} and shipped in Shiki v0.9. While it abstracted the file loading layer to use fetch or filesystem based on the environment, it's still quite complicated to use as you need to serve the grammars and theme files somewhere in your bundle or CDN manually, then call the `setCDN` method to tell Shiki where to load these files.

The solution is not perfect but at least it made it possible to run Shiki in the browser to highlight dynamic content. We have been using that approach since then - until the story of this article began.

## The Start

Nuxt is putting a lot effort in pushing the [web to the edge](https://nuxt.com/blog/nuxt-on-the-edge), making the web more accessible with lower latency and better performance. Like CDN servers, edge hosting services such as [CloudFlare Workers](https://workers.cloudflare.com/){rel="&#x22;nofollow&#x22;"} are deployed all over the world. Users get the content from the nearest edge server without the round trips to the origin server which could be thousands of miles away. With the awesome benefits it provides, it also comes with some trade-offs. For example, edge servers use a restricted runtime environment. CloudFlare Workers also does not support file system access and usually don't preserve the state between requests. While Shiki's main overhead is loading the grammars and themes upfront, that wouldn't work well in the edge environment.

It all started with a chat between [Sébastien](https://x.com/Atinux){rel="&#x22;nofollow&#x22;"} and me. We were trying to make [Nuxt Content](https://github.com/nuxt/content){rel="&#x22;nofollow&#x22;"} which uses Shiki to highlight the code blocks, to work on the edge.

![Chat History Between Sébastien and Anthony](https://nuxt.com/assets/blog/shiki-start-chat.png){.rounded-lg.shadow.max-w-[700px].border.dark:border-gray-700}

I started the experiments by patching [`shiki-es`](https://github.com/pi0/shiki-es){rel="&#x22;nofollow&#x22;"} (a ESM build of Shiki by [Pooya Parsa](https://github.com/pi0){rel="&#x22;nofollow&#x22;"}) locally, to convert the grammars and themes files into [ECMAScript Module (ESM)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules){rel="&#x22;nofollow&#x22;"} so that it could be understood and bundled by the build tools. This was done to create the code bundle for CloudFlare Workers to consume without using the filesystem nor making network requests.

```ts [Before - Read JSON assets from filesystem]
import fs from 'fs/promises'

const cssGrammar = JSON.parse(await fs.readFile('../langs/css.json', 'utf-8'))
```

```ts [After - Using ESM import]
const cssGrammar = await import('../langs/css.mjs').then(m => m.default)
```

We need to wrap the JSON files into ESM as inline literal so that we can use [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import){rel="&#x22;nofollow&#x22;"} to dynamically import them. The difference is that `import()` is a standard JavaScript feature that works everywhere, while `fs.readFile` is a Node.js specific API that only works in Node.js. Having `import()` statically would also make bundlers like [Rollup](https://rollupjs.org/){rel="&#x22;nofollow&#x22;"} and [webpack](https://webpack.js.org/){rel="&#x22;nofollow&#x22;"} able to construct the module relationship graph and [emit the bundled code as chunks](https://rollupjs.org/tutorial/#code-splitting){rel="&#x22;nofollow&#x22;"}.

Then, I realized that it actually takes more than that to make it work on edge runtimes. Since bundlers expect imports to be resolvable at build time (meaning that in order to support all the languages and themes), we need to list all the import statements in every single grammar and theme file in the codebase. This would end up with a huge bundle size with a bunch of grammars and themes that you might not actually use. This problem is particularly important in the edge environment, where the bundle size is critical for performance.

So, we needed to figure out a better middle ground to make it work better.

## The Fork - Shikiji

Knowing this might fundamentally change the way Shiki works, and since we don't want to risk breaking the existing Shiki users with our experiments, I started a fork of Shiki called [Shikiji](https://github.com/antfu/shikiji){rel="&#x22;nofollow&#x22;"}. I rewrote the code from scratch while keeping the previous API design decisions in mind. The goal is to make Shiki runtime-agnostic, performant and efficient, like the philosophy we have at [UnJS](https://github.com/unjs){rel="&#x22;nofollow&#x22;"}.

To make that happen, we need to make Shikiji completely ESM-friendly, pure and [tree-shakable](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking){rel="&#x22;nofollow&#x22;"}. This goes all the way up to the dependencies of Shiki such as [`vscode-oniguruma`](https://github.com/microsoft/vscode-oniguruma){rel="&#x22;nofollow&#x22;"} and [`vscode-textmate`](https://github.com/microsoft/vscode-textmate){rel="&#x22;nofollow&#x22;"}, which are provided in [Common JS (CJS)](https://requirejs.org/docs/commonjs.html){rel="&#x22;nofollow&#x22;"} format. `vscode-oniguruma` also contains a WASM binding generated by [`emscripten`](https://github.com/emscripten-core/emscripten){rel="&#x22;nofollow&#x22;"} that contains [dangling promises](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-floating-promises.md){rel="&#x22;nofollow&#x22;"} that will make CloudFlare Workers fail to finish the request. We ended up by embedding the WASM binary into a [base64 string](https://en.wikipedia.org/wiki/Base64){rel="&#x22;nofollow&#x22;"} and shipping it as an ES module, manually rewriting the WASM binding to avoid dangling promises, and [vendored `vscode-textmate`](https://github.com/shikijs/shiki/blob/main/CONTRIBUTING.md#clone){rel="&#x22;nofollow&#x22;"} to compile from its source code and produce the efficient ESM output.

The end result was very promising. We managed to get Shikiji working on any runtime environment, with even the possibility to [import it from CDN and run in the browser](https://shiki.style/guide/install#cdn-usage){rel="&#x22;nofollow&#x22;"} with a single line of code.

We also took the chance to improve the API and the internal architecture of Shiki. We switched from simple string concatenation to use [`hast`](https://github.com/syntax-tree/hast){rel="&#x22;nofollow&#x22;"}, creating an Abstract Syntax Tree (AST) for generating the HTML output. This opens up the possibility of exposing a [Transformers API](https://shiki.style/guide/transformers){rel="&#x22;nofollow&#x22;"} to allow users to modify the intermediate HAST and do many cool integrations that would be very hard to achieve previously.

Dark/Light mode support [was a frequently requested feature](https://github.com/shikijs/shiki/issues/33){rel="&#x22;nofollow&#x22;"}. Because of the static approach Shiki takes, it won't be possible to change the theme on the fly at rendering. The solution in the past was to generate the highlighted HTML twice, and toggle their visibility based on the user's preference - it wasn't efficient as it duplicate the payload, or used [CSS variables theme](https://github.com/shikijs/shiki/pull/212){rel="&#x22;nofollow&#x22;"} which lost the granular highlighting Shiki is great for. With the new architecture that Shikiji has, I took a step back and rethought the problem, and [came up with the idea](https://github.com/shikijs/shiki/issues/33#issuecomment-1676362336){rel="&#x22;nofollow&#x22;"} of breaking down the common tokens and merge multiple themes as inlined CSS variables, which provide efficient output while aligning with the Shiki's philosophy. You can learn more about it in [Shiki's documentation](https://shiki.style/guide/dual-themes){rel="&#x22;nofollow&#x22;"}.

To make the migration easier, we also created the [`shikiji-compat` compatibility layer](https://shikiji.netlify.app/guide/compat){rel="&#x22;nofollow&#x22;"}, which uses Shikiji's new foundation and provides backward compatibility API.

To get Shikiji to work on Cloudflare Workers, we had one last challenge as they don't support [initiating WASM instance](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/instantiate_static){rel="&#x22;nofollow&#x22;"}s from inlined binary data. Instead it requires importing the static `.wasm` assets for security reasons. This means that our "All-in-ESM" approach does not work well on CloudFlare. This would require extra work for users to provide different WASM sources, which makes the experience more difficult than we intended. At this moment, [Pooya Parsa](https://github.com/pi0){rel="&#x22;nofollow&#x22;"} stepped in and made the universal layer [`unjs/unwasm`](https://github.com/unjs/unwasm){rel="&#x22;nofollow&#x22;"}, which supports the upcoming [WebAssembly/ES Module Integration](https://github.com/WebAssembly/esm-integration/tree/main/proposals/esm-integration){rel="&#x22;nofollow&#x22;"} proposal. It has been integrated into [Nitro to have automated WASM targets](https://github.com/unjs/nitro/pull/2037){rel="&#x22;nofollow&#x22;"}. We hope that `unwasm` will help developers to have a better experience when working with WASM.

Overall, the Shikiji rewrite works well. [Nuxt Content](https://github.com/nuxt/content){rel="&#x22;nofollow&#x22;"}, [VitePress](https://vitepress.dev/){rel="&#x22;nofollow&#x22;"} and [Astro](https://astro.build/){rel="&#x22;nofollow&#x22;"} have been migrated to it. The feedback we have received has also been very positive.

## Merging Back

I am a team member of Shiki and have helped to do releases from time to time. While [Pine](https://github.com/octref){rel="&#x22;nofollow&#x22;"} is the lead of Shiki, he was busy on other stuff and Shiki's iterations slowed down. During the experiments in Shikiji, I [proposed a few improvements](https://github.com/shikijs/shiki/issues/510){rel="&#x22;nofollow&#x22;"} that could help Shiki acquire a modern structure. While generally everyone agreed with that direction, there would have been quite a lot of work to do and no one started to work on that.

While we were happy to use Shikiji to solve the problems we had, we certainly didn't want to see the community split by two different versions of Shiki. After a call with Pine, we made the consensus to merge the two projects into one:

::read-more
---
color: purple
icon: i-octicon-git-merge-24
to: https://github.com/shikijs/shiki/pull/557
---
feat!: merge Shikiji back into Shiki for v1.0 [#557]{.opacity-50}
::

We are really happy to see that our work in Shikiji has been merged back to Shiki, that not only works for ourselves, but also benefits the entire community. With this merge, it **solves around 95% of the open issues** we have had in Shiki for years:

![Shikiji Merged Back to Shiki](https://nuxt.com/assets/blog/shiki-merge-pr.png){.rounded-lg.shadow}

Shiki now also got [a brand new documentation site](https://shiki.style/){rel="&#x22;nofollow&#x22;"} where you can also play it right in your browser (thanks to the agnostic approach!). Many frameworks now has built-in integration with Shiki, maybe you are already using it somewhere!

## Twoslash

[Twoslash](https://github.com/twoslashes/twoslash){rel="&#x22;nofollow&#x22;"} is an integration tool to retrieve type information from [TypeScript Language Services](https://github.com/microsoft/TypeScript/wiki/Using-the-Language-Service-API){rel="&#x22;nofollow&#x22;"} and generated to your code snippet. It essentially make your static code snippet to have hover type information similar to your VS Code editor. It's made by [Orta Therox](https://github.com/orta){rel="&#x22;nofollow&#x22;"} for the [TypeScript documentation site](https://github.com/microsoft/TypeScript-Website){rel="&#x22;nofollow&#x22;"}, there you can find [the original source code here](https://github.com/microsoft/TypeScript-Website/tree/v2/packages/ts-twoslasher){rel="&#x22;nofollow&#x22;"}. Orta also created the [Twoslash integration for Shiki v0.x versions](https://github.com/shikijs/twoslash){rel="&#x22;nofollow&#x22;"}. Back then, Shiki [did not have proper plugin system](https://github.com/shikijs/shiki/issues/380){rel="&#x22;nofollow&#x22;"}, that makes the `shiki-twoslash` had to be built as a wrapper over Shiki, make it a bit hard to set up as the existing Shiki integrations won't directly work with Twoslash.

We also took the chance to revise the Twoslash integrations when we were rewriting Shikiji, also a way to [dog-fooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food){rel="&#x22;nofollow&#x22;"} and verify the extensibility. With the new HAST internal, we are able to [integrate Twoslash as a transformer plugin](https://shiki.style/packages/twoslash){rel="&#x22;nofollow&#x22;"}, making it works everywhere that Shiki works and also in a composable way to be used with other transformers.

With this, we started to think that we could probably get Twoslash to work on [nuxt.com](https://nuxt.com), the website you are looking at. nuxt.com uses [Nuxt Content](https://github.com/nuxt/content){rel="&#x22;nofollow&#x22;"} under the hood, and different from other documentation tools like VitePress, one of the benefits Nuxt Content provides is that it's able to handle dynamic content and runs on the edge. Since Twoslash is relying on TypeScript as well as the giant types modules graph from your dependencies, that would be not ideal to ship all those things to the edge or browser. Sounds tricky, but challenge accepted!

We first come up of fetching the types on-demand from CDN, using the [Auto-Type-Acquisition](https://github.com/microsoft/TypeScript-Website/tree/v2/packages/ata){rel="&#x22;nofollow&#x22;"} technique that you will see on the [TypeScript playground](https://www.typescriptlang.org/play){rel="&#x22;nofollow&#x22;"}. We made the [`twoslash-cdn`](https://github.com/antfu/twoslash-cdn){rel="&#x22;nofollow&#x22;"} that allows Twoslash to run in any runtime. However, still, it sounds like not the most optimal solution, as it would still require to make many network requests that might defeat the purpose of running on the edge.

After a few iterations on the underlying tools (e.g. on [`@nuxtjs/mdc`](https://github.com/nuxt-modules/mdc/pull/129){rel="&#x22;nofollow&#x22;"}, the markdown compiler used by Nuxt Content), we managed to take the hybrid approach and made [`nuxt-content-twoslash`](https://github.com/antfu/nuxt-content-twoslash){rel="&#x22;nofollow&#x22;"} that runs Twoslash on build time and caches the results for edge rendering. This way we could avoid shipping any extra dependencies to the final bundle, but still have the rich interactive code snippets on the website:

```vue twoslash
<script setup>
// Try hover on identifiers below to see the types
const count = useState('counter', () => 0)
const double = computed(() => count.value * 2)
</script>

<template>
  <button>Count is: {{ count }}</button>
  <div>Double is: {{ double }}</div>
</template>
```

During that, we also took the chance to refactor [Twoslash](https://github.com/twoslashes/twoslash){rel="&#x22;nofollow&#x22;"} with Orta to have a more efficient and modern structure. It also allows us have [`twoslash-vue`](https://github.com/twoslashes/twoslash/tree/main/packages/twoslash-vue){rel="&#x22;nofollow&#x22;"} that provides the [Vue SFC](https://vuejs.org/guide/scaling-up/sfc.html){rel="&#x22;nofollow&#x22;"} support as you are playing above. It's powered by [Volar.js](https://github.com/volarjs/volar.js){rel="&#x22;nofollow&#x22;"} and [`vuejs/language-tools`](https://github.com/vuejs/language-tools){rel="&#x22;nofollow&#x22;"}. With Volar growing to be framework agnostic and frameworks to work together, we are looking forward to see such integrations to expand to more syntaxes like Astro and Svelte components files in the future.

## Integrations

If you want to give Shiki a try in your own website, here you can find some integrations that we have made:

- [Nuxt](https://shiki.style/packages/nuxt){rel="&#x22;nofollow&#x22;"}
  - If using [Nuxt Content](https://content.nuxt.com/){rel="&#x22;nofollow&#x22;"}, Shiki is [build-in](https://content.nuxt.com/get-started/configuration#highlight){rel="&#x22;nofollow&#x22;"}. For Twoslash, you can add [`nuxt-content-twoslash`](https://github.com/antfu/nuxt-content-twoslash){rel="&#x22;nofollow&#x22;"} on top.
  - If not, you can use [`nuxt-shiki`](https://github.com/pi0/nuxt-shiki){rel="&#x22;nofollow&#x22;"} to use Shiki as Vue component or composibles.
- [VitePress](https://shiki.style/packages/vitepress){rel="&#x22;nofollow&#x22;"}
  - Shiki is [built-in](https://vitepress.dev/guide/markdown#syntax-highlighting-in-code-blocks){rel="&#x22;nofollow&#x22;"}. For Twoslash, you can use [`vitepress-twoslash`](https://shiki.style/packages/vitepress#twoslash){rel="&#x22;nofollow&#x22;"}.
- Low-level integrations - Shiki provides official integrations for markdown compilers:
  - [`markdown-it`](https://shiki.style/packages/markdown-it){rel="&#x22;nofollow&#x22;"} - Plugin for [`markdown-it`](https://github.com/markdown-it/markdown-it){rel="&#x22;nofollow&#x22;"}
  - [`rehype`](https://shiki.style/packages/rehype){rel="&#x22;nofollow&#x22;"} - Plugin for [`rehype`](https://github.com/rehypejs/rehype){rel="&#x22;nofollow&#x22;"}

Check out more integrations on [Shiki's Documentation](https://shiki.style/){rel="&#x22;nofollow&#x22;"}

## Conclusions

**Our mission at Nuxt is not only to make a better framework for developers, but also to make the entire frontend and web ecosystem a better place.** We are keeping pushing the boundaries and endorse the modern web standards and best practices. We hope you enjoy the new [Shiki](https://github.com/shikijs/shiki){rel="&#x22;nofollow&#x22;"}, [unwasm](https://github.com/unjs/unwasm){rel="&#x22;nofollow&#x22;"}, [Twoslash](https://github.com/twoslashes/twoslash){rel="&#x22;nofollow&#x22;"} and many other tools we made in the process of making Nuxt and the web better.
