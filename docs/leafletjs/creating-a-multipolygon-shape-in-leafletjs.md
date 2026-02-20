### Creating a MultiPolygon Shape in Leaflet.js

Source: https://leafletjs.com/reference

This example demonstrates the creation of a MultiPolygon shape in Leaflet.js. It uses a three-dimensional array where each element represents a distinct polygon. Each of these polygons can optionally have its own holes, defined by a nested array structure similar to the single polygon with holes example. This allows for representing multiple, potentially complex, polygon areas.

```javascript
var latlngs = [
  [ // first polygon
    [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]], // outer ring
    [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole
  ],
  [ // second polygon
    [[41, -111.03],[45, -111.04],[45, -104.05],[41, -104.05]]
  ]
];

var multiPolygon = L.polygon(latlngs).addTo(map);

```

--------------------------------
