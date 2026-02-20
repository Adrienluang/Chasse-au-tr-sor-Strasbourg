### Leaflet Control.Layers Usage Example

Source: https://leafletjs.com/reference-2.0.0

Demonstrates how to create and add a Control.Layers to a Leaflet map. This control allows users to switch between different base layers and toggle overlays on/off. It takes objects of base layers and overlays as arguments.

```javascript
const baseLayers = {
    "Mapbox": mapbox,
    "OpenStreetMap": osm
};

const overlays = {
    "Marker": marker,
    "Roads": roadsLayer
};

new Control.Layers(baseLayers, overlays).addTo(map);
```

--------------------------------
