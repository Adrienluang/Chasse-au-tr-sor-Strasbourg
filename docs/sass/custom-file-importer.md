### Custom File Importer

Implements a file importer to control how Sass resolves file loads from disk.

```javascript
const sass = require('sass');
const { pathToFileURL } = require('url');
const path = require('path');

const result = sass.compile('app.scss', {
  importers: [{
    findFileUrl(url) {
      // Redirect URLs starting with "~" to node_modules
      if (url.startsWith('~')) {
        const modulePath = url.substring(1);
        return pathToFileURL(
          path.resolve('node_modules', modulePath)
        );
      }

      // Redirect "@theme/" to custom theme directory
      if (url.startsWith('@theme/')) {
        const themePath = url.substring(7);
        return pathToFileURL(
          path.resolve('themes/current', themePath)
        );
      }

      return null;
    }
  }]
});

console.log(result.css);
```
