### Leaflet Map Initialization and Basic Usage (JavaScript)

Source: https://leafletjs.com/2016/09/27/leaflet-1.0-final

Demonstrates how to initialize a Leaflet map, set its view, and add a tile layer. This is fundamental for creating interactive maps with Leaflet.

```javascript
var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
```

--------------------------------
