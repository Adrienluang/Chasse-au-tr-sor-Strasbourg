### Asynchronous Compilation from File

Asynchronously compiles a Sass file to CSS with support for async importers and custom functions.

```javascript
const sass = require('sass');

async function compileSass() {
  try {
    const result = await sass.compileAsync('styles/main.scss', {
      style: 'expanded',
      sourceMap: true,
      alertColor: true,
      importers: [{
        canonicalize(url) {
          if (url.startsWith('pkg:')) {
            return new URL(url);
          }
          return null;
        },
        async load(canonicalUrl) {
          const response = await fetch(canonicalUrl.href);
          const contents = await response.text();
          return { contents, syntax: 'scss' };
        }
      }]
    });

    console.log(result.css);
  } catch (error) {
    console.error('Compilation failed:', error.message);
  }
}

compileSass();
```
