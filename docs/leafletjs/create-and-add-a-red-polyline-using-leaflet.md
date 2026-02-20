### Create and Add a Red Polyline using Leaflet

Source: https://leafletjs.com/reference-2.0.0

This example demonstrates how to create a red polyline from an array of LatLng points and add it to a Leaflet map. It also shows how to fit the map bounds to the polyline. The Polyline class extends the Path class.

```javascript
const latlngs = [
    [45.51, -122.68],
    [37.77, -122.43],
    [34.04, -118.2]
];

const polyline = new Polyline(latlngs, {color: 'red'}).addTo(map);

// zoom the map to the polyline
map.fitBounds(polyline.getBounds());
```

--------------------------------
