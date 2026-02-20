### Working with Sass Number Values

Creates and manipulates Sass number values with units in custom functions.

```javascript
const sass = require('sass');

const result = sass.compileString(`
  .container {
    width: responsive-size(1200px);
    padding: convert-unit(2rem, 'px');
  }
`, {
  functions: {
    'responsive-size($size)': (args) => {
      const size = args[0].assertNumber('size');

      // Convert to viewport width
      const pxValue = size.assertUnit('px', 'size').value;
      const vwValue = (pxValue / 1920) * 100;

      return new sass.SassNumber(vwValue, 'vw');
    },

    'convert-unit($value, $unit)': (args) => {
      const value = args[0].assertNumber('value');
      const targetUnit = args[1].assertString('unit').text;

      // Simple rem to px conversion (assuming 16px base)
      if (value.hasUnit('rem') && targetUnit === 'px') {
        return new sass.SassNumber(value.value * 16, 'px');
      }

      return value;
    }
  }
});

console.log(result.css);
```
