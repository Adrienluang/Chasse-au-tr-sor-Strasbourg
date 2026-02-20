### Node Package Importer

Uses the built-in Node.js package importer to load Sass from node_modules using pkg: URLs.

```javascript
const sass = require('sass');

const result = sass.compileString(`
  @use "pkg:bootstrap/scss/bootstrap";
  @use "pkg:vuetify/src/styles/main";

  .custom {
    @extend .btn;
  }
`, {
  importers: [new sass.NodePackageImporter()],
  loadPaths: ['./styles']
});

console.log(result.css);
console.log('Loaded from:', result.loadedUrls);
```
