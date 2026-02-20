### Synchronous String Compilation

Compiles Sass source code provided as a string rather than from a file.

```javascript
const sass = require('sass');

const scssSource = `
$primary-color: #3498db;
$font-stack: 'Helvetica Neue', Arial, sans-serif;

.header {
  color: $primary-color;
  font-family: $font-stack;

  .nav {
    background: lighten($primary-color, 20%);
  }
}
`;

const result = sass.compileString(scssSource, {
  syntax: 'scss',
  style: 'compressed'
});

console.log(result.css);
// Output: .header{color:#3498db;font-family:"Helvetica Neue",Arial,sans-serif}.header .nav{background:#85c4f2}
```
