### Deprecation Warnings Control

Configures how deprecation warnings are handled during compilation.

```javascript
const sass = require('sass');

const result = sass.compileString(`
  @import "colors";  // Using deprecated @import

  .box {
    color: #00ff00 / 0.5;  // Color slash syntax
  }
`, {
  // Treat specific deprecations as fatal errors
  fatalDeprecations: ['import', 'color-module-compat'],

  // Silence specific deprecations
  silenceDeprecations: ['slash-div'],

  // Opt into future deprecations early
  futureDeprecations: ['some-future-change'],

  // Show all deprecation warnings (not just 5)
  verbose: true,

  // Quiet warnings from dependencies
  quietDeps: true
});

console.log(result.css);
```
