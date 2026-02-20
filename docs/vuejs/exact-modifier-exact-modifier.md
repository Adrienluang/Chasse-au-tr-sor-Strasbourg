### `.exact` Modifier {#exact-modifier}

The `.exact` modifier allows control of the exact combination of system modifiers needed to trigger an event.

```vue-html
<!-- this will fire even if Alt or Shift is also pressed -->
<button @click.ctrl="onClick">A</button>

<!-- this will only fire when Ctrl and no other keys are pressed -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- this will only fire when no system modifiers are pressed -->
<button @click.exact="onClick">A</button>
```

## Mouse Button Modifiers {#mouse-button-modifiers}

- `.left`
- `.right`
- `.middle`

These modifiers restrict the handler to events triggered by a specific mouse button.

Note, however, that `.left`, `.right`, and `.middle` modifier names are based on the typical right-handed mouse layout, but in fact represent "main", "secondary", and "auxiliary" pointing device event triggers, respectively, and not the actual physical buttons. So that for a left-handed mouse layout the "main" button might physically be the right one but would trigger the `.left` modifier handler. Or a trackpad might trigger the `.left` handler with a one-finger tap, the `.right` handler with a two-finger tap, and the `.middle` handler with a three-finger tap. Similarly, other devices and event sources generating "mouse" events might have trigger modes that are not related to "left" and "right" whatsoever.

---

---
url: /guide/components/attrs.md
---

# Fallthrough Attributes {#fallthrough-attributes}

> This page assumes you've already read the [Components Basics](/guide/essentials/component-basics). Read that first if you are new to components.

## Attribute Inheritance {#attribute-inheritance}

A "fallthrough attribute" is an attribute or `v-on` event listener that is passed to a component, but is not explicitly declared in the receiving component's [props](./props) or [emits](./events#declaring-emitted-events). Common examples of this include `class`, `style`, and `id` attributes.

When a component renders a single root element, fallthrough attributes will be automatically added to the root element's attributes. For example, given a `<MyButton>` component with the following template:

```vue-html
<!-- template of <MyButton> -->
<button>Click Me</button>
```

And a parent using this component with:

```vue-html
<MyButton class="large" />
```

The final rendered DOM would be:

```html
<button class="large">Click Me</button>
```

Here, `<MyButton>` did not declare `class` as an accepted prop. Therefore, `class` is treated as a fallthrough attribute and automatically added to `<MyButton>`'s root element.
