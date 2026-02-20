### Custom Logger Implementation

Implements a custom logger to capture and handle Sass warnings and debug messages.

```javascript
const sass = require('sass');

const warnings = [];
const debugMessages = [];

const customLogger = {
  warn(message, options) {
    warnings.push({
      message,
      deprecation: options.deprecation,
      span: options.span,
      stack: options.stack
    });

    console.warn(`[SASS WARNING] ${message}`);
    if (options.span) {
      console.warn(`  at ${options.span.url}:${options.span.start.line}`);
    }
  },

  debug(message, options) {
    debugMessages.push({ message, span: options.span });
    console.debug(`[SASS DEBUG] ${message}`);
  }
};

const result = sass.compileString(`
  @warn "This is a custom warning";
  @debug "Debugging variable value";

  .test { color: red; }
`, {
  logger: customLogger
});

console.log(`Captured ${warnings.length} warnings`);
console.log(`Captured ${debugMessages.length} debug messages`);
```
