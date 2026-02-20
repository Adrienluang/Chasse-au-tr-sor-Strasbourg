### Creating a Red Polygon in Leaflet.js

Source: https://leafletjs.com/reference

This example demonstrates how to create a simple red polygon on a Leaflet map using an array of LatLng points. It utilizes the `L.polygon` factory function and adds the created polygon to the map. The map is then zoomed to fit the bounds of the polygon. Ensure you have a `map` object initialized before running this code.

```javascript
// create a red polygon from an array of LatLng points
var latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];

var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);

// zoom the map to the polygon
map.fitBounds(polygon.getBounds());

```
