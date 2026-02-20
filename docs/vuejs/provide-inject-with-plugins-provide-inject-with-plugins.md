### Provide / Inject with Plugins {#provide-inject-with-plugins}

Plugins also allow us to use `provide` to give plugin users access to a function or attribute. For example, we can allow the application to have access to the `options` parameter to be able to use the translations object.

```js{3} [plugins/i18n.js]
export default {
  install: (app, options) => {
    app.provide('i18n', options)
  }
}
```

Plugin users will now be able to inject the plugin options into their components using the `i18n` key:

<div class="composition-api">

```vue{4}
<script setup>
import { inject } from 'vue'

const i18n = inject('i18n')

console.log(i18n.greetings.hello)
</script>
```

</div>
<div class="options-api">

```js{2}
export default {
  inject: ['i18n'],
  created() {
    console.log(this.i18n.greetings.hello)
  }
}
```

</div>
