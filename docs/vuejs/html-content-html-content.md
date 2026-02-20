### HTML content {#html-content}

Whether using templates or render functions, content is automatically escaped. That means in this template:

```vue-html
<h1>{{ userProvidedString }}</h1>
```

if `userProvidedString` contained:

```js
'<script>alert("hi")</script>'
```

then it would be escaped to the following HTML:

```vue-html
&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;
```

thus preventing the script injection. This escaping is done using native browser APIs, like `textContent`, so a vulnerability can only exist if the browser itself is vulnerable.
