### Adding Constructor Hooks in Leaflet

Source: https://leafletjs.com/reference

Provides examples of using `addInitHook` to add custom initialization code to the constructor of a Leaflet class. This is useful for plugin developers who need to extend existing classes with additional logic, such as event listeners or property settings.

```javascript
MyClass.addInitHook(function () {
    // ... execute custom initialization code here
    // For example: this.on('click', this.handleClick);
});
```

```javascript
MyClass.addInitHook('methodName', arg1, arg2, ...);
```

--------------------------------
