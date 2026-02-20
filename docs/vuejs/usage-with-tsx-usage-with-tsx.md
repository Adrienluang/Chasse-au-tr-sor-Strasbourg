### Usage with TSX {#usage-with-tsx}

Vue also supports authoring components with JSX / TSX. Details are covered in the [Render Function & JSX](/guide/extras/render-function.html#jsx-tsx) guide.

## Generic Components {#generic-components}

Generic components are supported in two cases:

- In SFCs: [`<script setup>` with the `generic` attribute](/api/sfc-script-setup.html#generics)
- Render function / JSX components: [`defineComponent()`'s function signature](/api/general.html#function-signature)

## API-Specific Recipes {#api-specific-recipes}

- [TS with Composition API](./composition-api)
- [TS with Options API](./options-api)

---

---
url: /api/utility-types.md
---
# Utility Types {#utility-types}

:::info
This page only lists a few commonly used utility types that may need explanation for their usage. For a full list of exported types, consult the [source code](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/index.ts#L131).
:::

## PropType\<T> {#proptype-t}

Used to annotate a prop with more advanced types when using runtime props declarations.

- **Example**

  ```ts
  import type { PropType } from 'vue'

  interface Book {
    title: string
    author: string
    year: number
  }

  export default {
    props: {
      book: {
        // provide more specific type to `Object`
        type: Object as PropType<Book>,
        required: true
      }
    }
  }
  ```

- **See also** [Guide - Typing Component Props](/guide/typescript/options-api#typing-component-props)

## MaybeRef\<T> {#mayberef}

- Only supported in 3.3+

Alias for `T | Ref<T>`. Useful for annotating arguments of [Composables](/guide/reusability/composables.html).

## MaybeRefOrGetter\<T> {#maybereforgetter}

- Only supported in 3.3+

Alias for `T | Ref<T> | (() => T)`. Useful for annotating arguments of [Composables](/guide/reusability/composables.html).

## ExtractPropTypes\<T> {#extractproptypes}

Extract prop types from a runtime props options object. The extracted types are internal facing - i.e. the resolved props received by the component. This means boolean props and props with default values are always defined, even if they are not required.

To extract public facing props, i.e. props that the parent is allowed to pass, use [`ExtractPublicPropTypes`](#extractpublicproptypes).

- **Example**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar: boolean,
  //   baz: number,
  //   qux: number
  // }
  ```

## ExtractPublicPropTypes\<T> {#extractpublicproptypes}

- Only supported in 3.3+

Extract prop types from a runtime props options object. The extracted types are public facing - i.e. the props that the parent is allowed to pass.

- **Example**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPublicPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar?: boolean,
  //   baz: number,
  //   qux?: number
  // }
  ```

## ComponentCustomProperties {#componentcustomproperties}

Used to augment the component instance type to support custom global properties.

- **Example**

  ```ts
  import axios from 'axios'

  declare module 'vue' {
    interface ComponentCustomProperties {
      $http: typeof axios
      $translate: (key: string) => string
    }
  }
  ```

  :::tip
  Augmentations must be placed in a module `.ts` or `.d.ts` file. See [Type Augmentation Placement](/guide/typescript/options-api#augmenting-global-properties) for more details.
  :::

- **See also** [Guide - Augmenting Global Properties](/guide/typescript/options-api#augmenting-global-properties)

## ComponentCustomOptions {#componentcustomoptions}

Used to augment the component options type to support custom options.

- **Example**

  ```ts
  import { Route } from 'vue-router'

  declare module 'vue' {
    interface ComponentCustomOptions {
      beforeRouteEnter?(to: any, from: any, next: () => void): void
    }
  }
  ```

  :::tip
  Augmentations must be placed in a module `.ts` or `.d.ts` file. See [Type Augmentation Placement](/guide/typescript/options-api#augmenting-global-properties) for more details.
  :::

- **See also** [Guide - Augmenting Custom Options](/guide/typescript/options-api#augmenting-custom-options)

## ComponentCustomProps {#componentcustomprops}

Used to augment allowed TSX props in order to use non-declared props on TSX elements.

- **Example**

  ```ts
  declare module 'vue' {
    interface ComponentCustomProps {
      hello?: string
    }
  }

  export {}
  ```

  ```tsx
  // now works even if hello is not a declared prop
  <MyComponent hello="world" />
  ```

  :::tip
  Augmentations must be placed in a module `.ts` or `.d.ts` file. See [Type Augmentation Placement](/guide/typescript/options-api#augmenting-global-properties) for more details.
  :::

## CSSProperties {#cssproperties}

Used to augment allowed values in style property bindings.

- **Example**

  Allow any custom CSS property

  ```ts
  declare module 'vue' {
    interface CSSProperties {
      [key: `--${string}`]: string
    }
  }
  ```

  ```tsx
  <div style={ { '--bg-color': 'blue' } }>
  ```

  ```html
  <div :style="{ '--bg-color': 'blue' }"></div>
  ```

:::tip
Augmentations must be placed in a module `.ts` or `.d.ts` file. See [Type Augmentation Placement](/guide/typescript/options-api#augmenting-global-properties) for more details.
:::

:::info See also
SFC `<style>` tags support linking CSS values to dynamic component state using the `v-bind` CSS function. This allows for custom properties without type augmentation.

- [v-bind() in CSS](/api/sfc-css-features#v-bind-in-css)
  :::

---

---
url: /guide/extras/web-components.md
---
# Vue and Web Components {#vue-and-web-components}

[Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) is an umbrella term for a set of web native APIs that allows developers to create reusable custom elements.

We consider Vue and Web Components to be primarily complementary technologies. Vue has excellent support for both consuming and creating custom elements. Whether you are integrating custom elements into an existing Vue application, or using Vue to build and distribute custom elements, you are in good company.

## Using Custom Elements in Vue {#using-custom-elements-in-vue}

Vue [scores a perfect 100% in the Custom Elements Everywhere tests](https://custom-elements-everywhere.com/libraries/vue/results/results.html). Consuming custom elements inside a Vue application largely works the same as using native HTML elements, with a few things to keep in mind:
