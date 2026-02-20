### Binding Multiple Properties Using an Object {#binding-multiple-properties-using-an-object}

If you want to pass all the properties of an object as props, you can use [`v-bind` without an argument](/guide/essentials/template-syntax#dynamically-binding-multiple-attributes) (`v-bind` instead of `:prop-name`). For example, given a `post` object:

<div class="options-api">

```js
export default {
  data() {
    return {
      post: {
        id: 1,
        title: 'My Journey with Vue'
      }
    }
  }
}
```

</div>
<div class="composition-api">

```js
const post = {
  id: 1,
  title: 'My Journey with Vue'
}
```

</div>

The following template:

```vue-html
<BlogPost v-bind="post" />
```

Will be equivalent to:

```vue-html
<BlogPost :id="post.id" :title="post.title" />
```

## One-Way Data Flow {#one-way-data-flow}

All props form a **one-way-down binding** between the child property and the parent one: when the parent property updates, it will flow down to the child, but not the other way around. This prevents child components from accidentally mutating the parent's state, which can make your app's data flow harder to understand.

In addition, every time the parent component is updated, all props in the child component will be refreshed with the latest value. This means you should **not** attempt to mutate a prop inside a child component. If you do, Vue will warn you in the console:

<div class="composition-api">

```js
const props = defineProps(['foo'])

// ❌ warning, props are readonly!
props.foo = 'bar'
```

</div>
<div class="options-api">

```js
export default {
  props: ['foo'],
  created() {
    // ❌ warning, props are readonly!
    this.foo = 'bar'
  }
}
```

</div>

There are usually two cases where it's tempting to mutate a prop:

1. **The prop is used to pass in an initial value; the child component wants to use it as a local data property afterwards.** In this case, it's best to define a local data property that uses the prop as its initial value:

   <div class="composition-api">

   ```js
   const props = defineProps(['initialCounter'])

   // counter only uses props.initialCounter as the initial value;
   // it is disconnected from future prop updates.
   const counter = ref(props.initialCounter)
   ```

   </div>
   <div class="options-api">

   ```js
   export default {
     props: ['initialCounter'],
     data() {
       return {
         // counter only uses this.initialCounter as the initial value;
         // it is disconnected from future prop updates.
         counter: this.initialCounter
       }
     }
   }
   ```

   </div>

2. **The prop is passed in as a raw value that needs to be transformed.** In this case, it's best to define a computed property using the prop's value:

   <div class="composition-api">

   ```js
   const props = defineProps(['size'])

   // computed property that auto-updates when the prop changes
   const normalizedSize = computed(() => props.size.trim().toLowerCase())
   ```

   </div>
   <div class="options-api">

   ```js
   export default {
     props: ['size'],
     computed: {
       // computed property that auto-updates when the prop changes
       normalizedSize() {
         return this.size.trim().toLowerCase()
       }
     }
   }
   ```

   </div>
