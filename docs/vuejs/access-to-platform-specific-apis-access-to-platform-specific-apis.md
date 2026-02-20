### Access to Platform-Specific APIs {#access-to-platform-specific-apis}

Universal code cannot assume access to platform-specific APIs, so if your code directly uses browser-only globals like `window` or `document`, they will throw errors when executed in Node.js, and vice-versa.

For tasks that are shared between server and client but with different platform APIs, it's recommended to wrap the platform-specific implementations inside a universal API, or use libraries that do this for you. For example, you can use [`node-fetch`](https://github.com/node-fetch/node-fetch) to use the same fetch API on both server and client.

For browser-only APIs, the common approach is to lazily access them inside client-only lifecycle hooks such as <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>.

Note that if a third-party library is not written with universal usage in mind, it could be tricky to integrate it into a server-rendered app. You _might_ be able to get it working by mocking some of the globals, but it would be hacky and may interfere with the environment detection code of other libraries.
