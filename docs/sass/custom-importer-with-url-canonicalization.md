### Custom Importer with URL Canonicalization

Implements a custom importer that generates stylesheets dynamically based on URL patterns.

```javascript
const sass = require('sass');

const result = sass.compile('main.scss', {
  importers: [{
    canonicalize(url) {
      // Handle color scheme URLs like "bgcolor:blue"
      if (url.startsWith('bgcolor:')) {
        return new URL(url);
      }

      // Handle gradient URLs like "gradient:red-blue"
      if (url.startsWith('gradient:')) {
        return new URL(url);
      }

      return null;
    },

    load(canonicalUrl) {
      const scheme = canonicalUrl.protocol.slice(0, -1);
      const value = canonicalUrl.pathname;

      if (scheme === 'bgcolor') {
        return {
          contents: `body { background-color: ${value}; }`,
          syntax: 'scss'
        };
      }

      if (scheme === 'gradient') {
        const [start, end] = value.split('-');
        return {
          contents: `
            .gradient {
              background: linear-gradient(to right, ${start}, ${end});
            }
          `,
          syntax: 'scss'
        };
      }

      return null;
    }
  }]
});

console.log(result.css);
```
