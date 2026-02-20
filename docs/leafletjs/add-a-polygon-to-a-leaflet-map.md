### Add a Polygon to a Leaflet Map

Source: https://leafletjs.com/examples/quick-start

This snippet illustrates how to add a polygon to a Leaflet map. It takes an array of coordinate pairs defining the polygon's vertices and adds it to the map. The polygon is defined by its outer boundary.

```javascript
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map);
```

--------------------------------
