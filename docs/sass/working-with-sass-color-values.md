### Working with Sass Color Values

Creates and manipulates Sass color values in custom functions.

```javascript
const sass = require('sass');

const result = sass.compileString(`
  .element {
    background: adjust-brightness(#3498db, 20%);
    color: mix-colors(red, blue, 0.3);
  }
`, {
  functions: {
    'adjust-brightness($color, $amount)': (args) => {
      const color = args[0].assertColor('color');
      const amount = args[1].assertNumber('amount');

      // Get RGB channels
      const red = color.channel('red');
      const green = color.channel('green');
      const blue = color.channel('blue');
      const alpha = color.channel('alpha');

      // Adjust brightness
      const factor = 1 + (amount.value / 100);

      return new sass.SassColor({
        red: Math.min(255, red * factor),
        green: Math.min(255, green * factor),
        blue: Math.min(255, blue * factor),
        alpha: alpha
      });
    },

    'mix-colors($color1, $color2, $weight)': (args) => {
      const color1 = args[0].assertColor('color1');
      const color2 = args[1].assertColor('color2');
      const weight = args[2].assertNumber('weight').value;

      const r = color1.channel('red') * weight + color2.channel('red') * (1 - weight);
      const g = color1.channel('green') * weight + color2.channel('green') * (1 - weight);
      const b = color1.channel('blue') * weight + color2.channel('blue') * (1 - weight);

      return new sass.SassColor({ red: r, green: g, blue: b });
    }
  }
});

console.log(result.css);
```
