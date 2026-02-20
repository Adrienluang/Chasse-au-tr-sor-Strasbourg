### `.number` {#number}

If you want user input to be automatically typecast as a number, you can add the `number` modifier to your `v-model` managed inputs:

```vue-html
<input v-model.number="age" />
```

If the value cannot be parsed with `parseFloat()`, then the original (string) value is used instead. In particular, if the input is empty (for instance after the user clearing the input field), an empty string is returned. This behavior differs from the [DOM property `valueAsNumber`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#valueasnumber). 

The `number` modifier is applied automatically if the input has `type="number"`.
