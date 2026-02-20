### Leaflet Class Definition and Instantiation

Source: https://leafletjs.com/reference-2.0.0

Demonstrates how to define a new class using `Class.extend`, including a constructor (`initialize`) and methods. It also shows how to create an instance of this class and call its methods.

```javascript
const MyClass = Class.extend({
    initialize(greeter) {
        this.greeter = greeter;
        // class constructor
    },

    greet(name) {
        alert(this.greeter + ', ' + name)
    }
});

// create instance of MyClass, passing "Hello" to the constructor
const a = new MyClass("Hello");

// call greet method, alerting "Hello, World"
a.greet("World");

```

--------------------------------
