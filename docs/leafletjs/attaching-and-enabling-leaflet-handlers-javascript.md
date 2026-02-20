### Attaching and Enabling Leaflet Handlers (JavaScript)

Source: https://leafletjs.com/examples/extending/extending-3-controls

Demonstrates how to attach a custom handler ('tilt') to a Leaflet map instance and how to enable it by default using addInitHook.

```javascript
L.Map.addInitHook('addHandler', 'tilt', L.TiltHandler);

// To enable manually:
// map.tilt.enable();
// map.tilt.disable();

// To enable by default in map options:
// var map = L.map('mapDiv', { tilt: true });

```

--------------------------------
