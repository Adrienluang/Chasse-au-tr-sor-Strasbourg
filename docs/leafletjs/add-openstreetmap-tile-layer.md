### Add OpenStreetMap Tile Layer

Source: https://leafletjs.com/examples/quick-start

This JavaScript code adds an OpenStreetMap tile layer to the Leaflet map. It specifies the tile URL template, maximum zoom level, and attribution. This code must be called after the map initialization and DOM element are ready.

```javascript
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
```

--------------------------------
