### HTML Injection {#html-injection}

As you learned earlier, Vue automatically escapes HTML content, preventing you from accidentally injecting executable HTML into your application. However, **in cases where you know the HTML is safe**, you can explicitly render HTML content:

- Using a template:

  ```vue-html
  <div v-html="userProvidedHtml"></div>
  ```

- Using a render function:

  ```js
  h('div', {
    innerHTML: this.userProvidedHtml
  })
  ```

- Using a render function with JSX:

  ```jsx
  <div innerHTML={this.userProvidedHtml}></div>
  ```

:::warning
User-provided HTML can never be considered 100% safe unless it's in a sandboxed iframe or in a part of the app where only the user who wrote that HTML can ever be exposed to it. Additionally, allowing users to write their own Vue templates brings similar dangers.
:::
