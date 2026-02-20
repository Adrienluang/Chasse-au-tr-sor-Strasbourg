### IDE Support {#ide-support}

- [Visual Studio Code](https://code.visualstudio.com/) (VS Code) is strongly recommended for its great out-of-the-box support for TypeScript.

  - [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (previously Volar) is the official VS Code extension that provides TypeScript support inside Vue SFCs, along with many other great features.

    :::tip
    Vue - Official extension replaces [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), our previous official VS Code extension for Vue 2. If you have Vetur currently installed, make sure to disable it in Vue 3 projects.
    :::

- [WebStorm](https://www.jetbrains.com/webstorm/) also provides out-of-the-box support for both TypeScript and Vue. Other JetBrains IDEs support them too, either out of the box or via [a free plugin](https://plugins.jetbrains.com/plugin/9442-vue-js). As of version 2023.2, WebStorm and the Vue Plugin come with built-in support for the Vue Language Server. You can set the Vue service to use Volar integration on all TypeScript versions, under Settings > Languages & Frameworks > TypeScript > Vue. By default, Volar will be used for TypeScript versions 5.0 and higher.
