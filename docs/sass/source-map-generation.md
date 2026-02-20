### Source Map Generation

Generates source maps for debugging compiled CSS back to original Sass sources.

```javascript
const sass = require('sass');
const fs = require('fs');
const path = require('path');

const result = sass.compile('styles/main.scss', {
  sourceMap: true,
  sourceMapIncludeSources: true,
  style: 'compressed'
});

// Write CSS file
const cssPath = 'dist/main.css';
const mapPath = 'dist/main.css.map';

fs.writeFileSync(
  cssPath,
  result.css + `\n/*# sourceMappingURL=${path.basename(mapPath)} */`
);

// Write source map
fs.writeFileSync(
  mapPath,
  JSON.stringify(result.sourceMap, null, 2)
);

console.log(`Compiled CSS: ${cssPath}`);
console.log(`Source map: ${mapPath}`);
console.log(`Files loaded: ${result.loadedUrls.length}`);
```

## Summary

The Sass JavaScript API provides a comprehensive and flexible interface for integrating Sass compilation into Node.js applications and build tools. The API supports both synchronous and asynchronous compilation modes, with the choice depending on performance requirements and the need for async operations like custom importers or functions. Key compilation functions include `compile()` and `compileString()` for synchronous operations, and `compileAsync()` and `compileStringAsync()` for asynchronous workflows. For applications performing multiple compilations, the `initCompiler()` and `initAsyncCompiler()` functions create reusable compiler instances that offer significant performance improvements, especially with the sass-embedded implementation.

The API's extensibility features enable deep customization of the compilation process through custom importers and functions. Importers allow control over how Sass resolves `@use` and `@import` rules, supporting scenarios from simple path redirection to dynamic stylesheet generation. Custom functions written in JavaScript can be called from Sass code, enabling complex calculations and integrations with external data sources. The API also provides rich value types (SassNumber, SassColor, SassList, SassMap, etc.) for working with Sass data structures in JavaScript, complete with assertion methods for type safety. Additional features include configurable output styles, source map generation, deprecation warning controls, and custom logging, making the JavaScript API suitable for everything from simple build scripts to sophisticated build systems and development tools.
