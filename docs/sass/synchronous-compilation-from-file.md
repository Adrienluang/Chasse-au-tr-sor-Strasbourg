### Synchronous Compilation from File

Compiles a Sass file to CSS synchronously, returning the compiled CSS and source map.

```javascript
const sass = require('sass');

const result = sass.compile('styles/main.scss', {
  style: 'compressed',
  sourceMap: true,
  loadPaths: ['node_modules', 'shared/styles']
});

console.log(result.css);
console.log(result.sourceMap);
console.log(result.loadedUrls);
```
