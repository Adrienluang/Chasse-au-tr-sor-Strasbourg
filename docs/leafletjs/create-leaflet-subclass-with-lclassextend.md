### Create Leaflet Subclass with L.Class.extend

Source: https://leafletjs.com/examples/extending/extending-1-classes

Demonstrates how to create a new subclass of a Leaflet class using the L.Class.extend() method. This method accepts an object containing properties and methods for the new class. The example shows defining a property 'myDemoProperty' and a method 'myDemoMethod', then instantiating and using the new class.

```javascript
var MyDemoClass = L.Class.extend({

    // A property with initial value = 42
    myDemoProperty: 42,   

    // A method 
    myDemoMethod: function() { return this.myDemoProperty; }
    
});

var myDemoInstance = new MyDemoClass();

// This will output "42" to the development console
console.log( myDemoInstance.myDemoMethod() );   

```

--------------------------------
