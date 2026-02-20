### Working with Sass Lists and Maps

Manipulates Sass list and map data structures in custom functions.

```javascript
const sass = require('sass');

const result = sass.compileString(`
  $colors: #ff0000, #00ff00, #0000ff;
  $config: ('spacing': 20px, 'color': red);

  .box {
    background: first-item($colors);
    padding: get-config($config, 'spacing');
  }
`, {
  functions: {
    'first-item($list)': (args) => {
      const list = args[0].asList();

      if (list.size === 0) {
        return sass.sassNull;
      }

      return list.get(0);
    },

    'get-config($map, $key)': (args) => {
      const map = args[0].assertMap('map');
      const key = args[1].assertString('key');

      const value = map.get(key);

      if (value === undefined) {
        throw new Error(`Key "${key.text}" not found in map`);
      }

      return value;
    }
  }
});

console.log(result.css);
```
