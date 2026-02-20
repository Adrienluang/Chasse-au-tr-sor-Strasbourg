### Create Vector Geometries with Custom Canvas Renderer

Source: https://leafletjs.com/reference

This example shows how to create a custom Canvas renderer with specific options (e.g., padding) and apply it to individual vector geometries like polylines and circles. It highlights flexibility in renderer configuration.

```javascript
var map = L.map('map');
var myRenderer = L.canvas({ padding: 0.5 });
var line = L.polyline( coordinates, { renderer: myRenderer } );
var circle = L.circle( center, { renderer: myRenderer } );
```

--------------------------------
