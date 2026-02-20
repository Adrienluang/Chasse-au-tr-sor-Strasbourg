### Leaflet.js Control.Layers Usage Example

Source: https://leafletjs.com/reference

Demonstrates how to create and add a layers control to a Leaflet map. It shows the structure for defining base layers and overlays, and how to instantiate the control with these layers. The control is then added to the map using the addTo method.

```javascript
var baseLayers = {
    "Mapbox": mapbox,
    "OpenStreetMap": osm
};

var overlays = {
    "Marker": marker,
    "Roads": roadsLayer
};

L.control.layers(baseLayers, overlays).addTo(map);
```

--------------------------------
