### Compiler Instance for Multiple Compilations

Creates a reusable compiler instance for better performance when compiling multiple files.

```javascript
const sass = require('sass');

function processMultipleFiles() {
  const compiler = sass.initCompiler();

  try {
    const files = ['main.scss', 'admin.scss', 'mobile.scss'];
    const results = [];

    for (const file of files) {
      const result = compiler.compileString(`@use "${file}";`, {
        style: 'compressed',
        sourceMap: true
      });
      results.push({ file, css: result.css });
    }

    return results;
  } finally {
    compiler.dispose();
  }
}

const compiledFiles = processMultipleFiles();
compiledFiles.forEach(({ file, css }) => {
  console.log(`${file}: ${css.length} bytes`);
});
```
