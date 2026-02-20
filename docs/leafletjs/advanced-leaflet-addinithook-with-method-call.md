### Advanced Leaflet addInitHook with Method Call

Source: https://leafletjs.com/examples/extending/extending-1-classes

Demonstrates an alternative syntax for `addInitHook` that allows calling a specific method with arguments after initialization. This is useful for more complex setup routines.

```javascript
MyCubeClass.include({
    _calculateVolume: function(arg1, arg2) {
        this._volume = this.options.width * this.options.length * this.options.depth;
    }
});

MyCubeClass.addInitHook('_calculateVolume', argValue1, argValue2);

```

--------------------------------
