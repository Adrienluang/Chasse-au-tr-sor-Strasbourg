### Does Composition API cover all use cases? {#does-composition-api-cover-all-use-cases}

Yes in terms of stateful logic. When using Composition API, there are only a few options that may still be needed: `props`, `emits`, `name`, and `inheritAttrs`.

:::tip

Since 3.3 you can directly use `defineOptions` in `<script setup>` to set the component name or `inheritAttrs` property

:::

If you intend to exclusively use Composition API (along with the options listed above), you can shave a few kbs off your production bundle via a [compile-time flag](/api/compile-time-flags) that drops Options API related code from Vue. Note this also affects Vue components in your dependencies.
