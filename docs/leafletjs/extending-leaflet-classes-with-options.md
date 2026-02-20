### Extending Leaflet Classes with Options

Source: https://leafletjs.com/reference

Demonstrates how to extend Leaflet classes and manage options. The `options` property is merged with parent options, allowing for convenient configuration and default value management. This example shows how a child class's options override parent options where keys match, while also inheriting unique options.

```javascript
var MyClass = L.Class.extend({
    options: {
        myOption1: 'foo',
        myOption2: 'bar'
    }
});

var MyChildClass = MyClass.extend({
    options: {
        myOption1: 'baz',
        myOption3: 5
    }
});

var a = new MyChildClass();
a.options.myOption1; // 'baz'
a.options.myOption2; // 'bar'
a.options.myOption3; // 5
```

--------------------------------
