### Async Compiler Instance for Performance

Creates an asynchronous compiler instance for optimal performance with concurrent compilations.

```javascript
const sass = require('sass');

async function batchCompile() {
  const compiler = await sass.initAsyncCompiler();

  try {
    const compilations = [
      compiler.compileStringAsync('$color: red; .a { color: $color; }'),
      compiler.compileStringAsync('$color: blue; .b { color: $color; }'),
      compiler.compileStringAsync('$color: green; .c { color: $color; }')
    ];

    const results = await Promise.all(compilations);

    results.forEach((result, i) => {
      console.log(`Compilation ${i + 1}: ${result.css}`);
    });
  } finally {
    await compiler.dispose();
  }
}

batchCompile();
```
