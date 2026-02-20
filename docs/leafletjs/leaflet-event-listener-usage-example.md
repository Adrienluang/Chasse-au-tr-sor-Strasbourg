### Leaflet Event Listener Usage Example

Source: https://leafletjs.com/reference-2.0.0

Provides a practical example of how to attach and detach event listeners to Leaflet objects. It emphasizes defining listeners as functions for easy removal, demonstrating the `on` and `off` methods.

```javascript
map.on('click', function(e) {
    alert(e.latlng);
});

function onClick(e) { ... }
map.on('click', onClick);
map.off('click', onClick);
```

--------------------------------
