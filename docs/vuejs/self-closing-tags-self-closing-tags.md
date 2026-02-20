### Self Closing Tags {#self-closing-tags}

We have been using self-closing tags for components in previous code samples:

```vue-html
<MyComponent />
```

This is because Vue's template parser respects `/>` as an indication to end any tag, regardless of its type.

In in-DOM templates, however, we must always include explicit closing tags:

```vue-html
<my-component></my-component>
```

This is because the HTML spec only allows [a few specific elements](https://html.spec.whatwg.org/multipage/syntax.html#void-elements) to omit closing tags, the most common being `<input>` and `<img>`. For all other elements, if you omit the closing tag, the native HTML parser will think you never terminated the opening tag. For example, the following snippet:

```vue-html
<my-component /> <!-- we intend to close the tag here... -->
<span>hello</span>
```

will be parsed as:

```vue-html
<my-component>
  <span>hello</span>
</my-component> <!-- but the browser will close it here. -->
```
