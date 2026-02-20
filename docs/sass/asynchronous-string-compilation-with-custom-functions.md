### Asynchronous String Compilation with Custom Functions

Compiles Sass from a string with custom JavaScript functions available in the stylesheet.

```javascript
const sass = require('sass');

async function compileWithCustomFunctions() {
  const result = await sass.compileStringAsync(`
    @use 'sass:math';

    .box {
      width: double(150px);
      padding: sum(10px, 5px);
      margin: fibonacci(8) * 1px;
    }
  `, {
    functions: {
      'double($value)': (args) => {
        const num = args[0].assertNumber('value');
        return new sass.SassNumber(num.value * 2, num.numeratorUnits);
      },
      'sum($a, $b)': (args) => {
        const a = args[0].assertNumber('a');
        const b = args[1].assertNumber('b').convertValueToMatch(a, 'b', 'a');
        return new sass.SassNumber(a.value + b, a.numeratorUnits);
      },
      'fibonacci($n)': (args) => {
        const n = args[0].assertNumber('n').assertInt('n');
        let a = 0, b = 1;
        for (let i = 0; i < n; i++) {
          [a, b] = [b, a + b];
        }
        return new sass.SassNumber(a);
      }
    }
  });

  console.log(result.css);
}

compileWithCustomFunctions();
```
