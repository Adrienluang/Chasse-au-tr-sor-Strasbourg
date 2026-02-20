### Leaflet.js: Class Factory Method

Source: https://leafletjs.com/reference

Illustrates the pattern of using factory methods in Leaflet to create class instances without the `new` keyword. This example shows how to define a simple factory function for a custom class, which internally uses the class constructor.

```javascript
// Assuming MyClass is defined as above

// Original way using new keyword
// var map = new L.Map('mapId');

// Using the factory method
var map = L.map('mapId');

// Example of creating a factory for your own class
// L.MyClass = function(options) {
//     return new MyClass(options);
// };
// var instance = L.MyClass();
```

--------------------------------
