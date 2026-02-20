### Handling Function Arguments with Options Objects

Source: https://leafletjs.com/2013/06/28/leaflet-plugin-authoring-guide

Illustrates a best practice for functions with many arguments: using an options object. This improves readability and maintainability by allowing default values and selective parameter passing. Method names should be in camelCase.

```javascript
// bad
marker.myPlugin('bla', 'foo', null, {}, 5, 0);

// good
marker.myPlugin('bla', {
    optionOne: 'foo',
    optionThree: 5
});
```

--------------------------------
