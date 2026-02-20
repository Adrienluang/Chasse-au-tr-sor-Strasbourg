### Extend Leaflet Class Initialization with addInitHook()

Source: https://leafletjs.com/examples/extending/extending-1-classes

Explains how to use `L.Class.addInitHook()` to run custom initialization code after the main `initialize()` method and `L.setOptions()` have executed. This ensures `this.options` are available.

```javascript
MyBoxClass.addInitHook(function(){
    this._area = this.options.width * this.options.length;
});

```

--------------------------------
