### Leaflet ImageOverlay Usage Example

Source: https://leafletjs.com/reference

Demonstrates how to create and add an ImageOverlay to a Leaflet map. It requires the Leaflet library and a map object.

```javascript
var imageUrl = 'https://maps.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
    imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
L.imageOverlay(imageUrl, imageBounds).addTo(map);
```

--------------------------------
