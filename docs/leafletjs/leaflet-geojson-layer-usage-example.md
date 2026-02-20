### Leaflet GeoJSON Layer Usage Example

Source: https://leafletjs.com/reference-2.0.0

This example demonstrates how to create and customize a GeoJSON layer in Leaflet. It shows how to bind a popup to each feature based on its properties and add the layer to the map.

```javascript
new GeoJSON(data, {
    style: function (feature) {
        return {color: feature.properties.color};
    }
}).bindPopup(function (layer) {
    return layer.feature.properties.description;
}).addTo(map);

```

--------------------------------
