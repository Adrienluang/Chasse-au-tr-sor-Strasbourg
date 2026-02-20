### Reactive Proxy vs. Original \* {#reactive-proxy-vs-original}

In Vue 3, data is made reactive by leveraging [JavaScript Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Users coming from Vue 2 should be aware of the following edge case:

```js
export default {
  data() {
    return {
      someObject: {}
    }
  },
  mounted() {
    const newObject = {}
    this.someObject = newObject

    console.log(newObject === this.someObject) // false
  }
}
```

When you access `this.someObject` after assigning it, the value is a reactive proxy of the original `newObject`. **Unlike in Vue 2, the original `newObject` is left intact and will not be made reactive: make sure to always access reactive state as a property of `this`.**

</div>

<div class="composition-api">

## Declaring Reactive State \*\* {#declaring-reactive-state-1}
