### Initialize Leaflet Class with L.Class.extend() and L.setOptions()

Source: https://leafletjs.com/examples/extending/extending-1-classes

Shows how to define a new class in Leaflet using `L.Class.extend()`, including a constructor named `initialize`. It also demonstrates initializing class-specific options using `L.setOptions()` within the constructor.

```javascript
var MyBoxClass = L.Class.extend({

    options: {
        width: 1,
        height: 1
    },

    initialize: function(name, options) {
        this.name = name;
        L.setOptions(this, options);
    }
    
});

var instance = new MyBoxClass('Red', {width: 10});

console.log(instance.name); // Outputs "Red"
console.log(instance.options.width); // Outputs "10"
console.log(instance.options.height); // Outputs "1", the default

```

--------------------------------
