### defineCustomElement {#definecustomelement}

Vue supports creating custom elements using exactly the same Vue component APIs via the [`defineCustomElement`](/api/custom-elements#definecustomelement) method. The method accepts the same argument as [`defineComponent`](/api/general#definecomponent), but instead returns a custom element constructor that extends `HTMLElement`:

```vue-html
<my-vue-element></my-vue-element>
```

```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // normal Vue component options here
  props: {},
  emits: {},
  template: `...`,

  // defineCustomElement only: CSS to be injected into shadow root
  styles: [`/* inlined css */`]
})

// Register the custom element.
// After registration, all `<my-vue-element>` tags
// on the page will be upgraded.
customElements.define('my-vue-element', MyVueElement)

// You can also programmatically instantiate the element:
// (can only be done after registration)
document.body.appendChild(
  new MyVueElement({
    // initial props (optional)
  })
)
```

#### Lifecycle {#lifecycle}

- A Vue custom element will mount an internal Vue component instance inside its shadow root when the element's [`connectedCallback`](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks) is called for the first time.

- When the element's `disconnectedCallback` is invoked, Vue will check whether the element is detached from the document after a microtask tick.

  - If the element is still in the document, it's a move and the component instance will be preserved;

  - If the element is detached from the document, it's a removal and the component instance will be unmounted.

#### Props {#props}

- All props declared using the `props` option will be defined on the custom element as properties. Vue will automatically handle the reflection between attributes / properties where appropriate.

  - Attributes are always reflected to corresponding properties.

  - Properties with primitive values (`string`, `boolean` or `number`) are reflected as attributes.

- Vue also automatically casts props declared with `Boolean` or `Number` types into the desired type when they are set as attributes (which are always strings). For example, given the following props declaration:

  ```js
  props: {
    selected: Boolean,
    index: Number
  }
  ```

  And the custom element usage:

  ```vue-html
  <my-element selected index="1"></my-element>
  ```

  In the component, `selected` will be cast to `true` (boolean) and `index` will be cast to `1` (number).

#### Events {#events}

Events emitted via `this.$emit` or setup `emit` are dispatched as native [CustomEvents](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events#adding_custom_data_%E2%80%93_customevent) on the custom element. Additional event arguments (payload) will be exposed as an array on the CustomEvent object as its `detail` property.

#### Slots {#slots}

Inside the component, slots can be rendered using the `<slot/>` element as usual. However, when consuming the resulting element, it only accepts [native slots syntax](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots):

- [Scoped slots](/guide/components/slots#scoped-slots) are not supported.

- When passing named slots, use the `slot` attribute instead of the `v-slot` directive:

  ```vue-html
  <my-element>
    <div slot="named">hello</div>
  </my-element>
  ```

#### Provide / Inject {#provide-inject}

The [Provide / Inject API](/guide/components/provide-inject#provide-inject) and its [Composition API equivalent](/api/composition-api-dependency-injection#provide) also work between Vue-defined custom elements. However, note that this works **only between custom elements**. i.e. a Vue-defined custom element won't be able to inject properties provided by a non-custom-element Vue component.

#### App Level Config <sup class="vt-badge" data-text="3.5+" /> {#app-level-config}

You can configure the app instance of a Vue custom element using the `configureApp` option:

```js
defineCustomElement(MyComponent, {
  configureApp(app) {
    app.config.errorHandler = (err) => {
      /* ... */
    }
  }
})
```
