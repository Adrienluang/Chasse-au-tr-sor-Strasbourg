### Output Style Configuration

Controls the formatting of compiled CSS output with expanded or compressed styles.

```javascript
const sass = require('sass');

const source = `
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }
}
`;

// Expanded output (readable)
const expanded = sass.compileString(source, { style: 'expanded' });
console.log('Expanded:\n', expanded.css);
// Output:
// nav ul {
//   margin: 0;
//   padding: 0;
//   list-style: none;
// }
// nav li {
//   display: inline-block;
//   margin: 0 10px;
// }

// Compressed output (minified)
const compressed = sass.compileString(source, { style: 'compressed' });
console.log('Compressed:\n', compressed.css);
// Output: nav ul{margin:0;padding:0;list-style:none}nav li{display:inline-block;margin:0 10px}
```
