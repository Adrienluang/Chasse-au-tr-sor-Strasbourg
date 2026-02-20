### Prop Name Casing {#prop-name-casing}

We declare long prop names using camelCase because this avoids having to use quotes when using them as property keys, and allows us to reference them directly in template expressions because they are valid JavaScript identifiers:

<div class="composition-api">

```js
defineProps({
  greetingMessage: String
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    greetingMessage: String
  }
}
```

</div>

```vue-html
<span>{{ greetingMessage }}</span>
```

Technically, you can also use camelCase when passing props to a child component (except in [in-DOM templates](/guide/essentials/component-basics#in-dom-template-parsing-caveats)). However, the convention is using kebab-case in all cases to align with HTML attributes:

```vue-html
<MyComponent greeting-message="hello" />
```

We use [PascalCase for component tags](/guide/components/registration#component-name-casing) when possible because it improves template readability by differentiating Vue components from native elements. However, there isn't as much practical benefit in using camelCase when passing props, so we choose to follow each language's conventions.
