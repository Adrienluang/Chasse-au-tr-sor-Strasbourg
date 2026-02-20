### Add a Circle to a Leaflet Map with Options

Source: https://leafletjs.com/examples/quick-start

This code shows how to add a circle to a Leaflet map. It takes coordinates, an optional options object for styling (color, fill color, fill opacity, radius), and adds the circle to the map. The radius is specified in meters.

```javascript
var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);
```

--------------------------------
