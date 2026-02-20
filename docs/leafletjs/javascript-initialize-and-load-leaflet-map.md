### JavaScript: Initialize and Load Leaflet Map

Source: https://leafletjs.com/examples/mobile

Initializes a Leaflet map centered on the 'map' div and zooms to fit the entire world. It also sets up the OpenStreetMap tile layer with maximum zoom level and attribution. This is the basic setup for displaying a map.

```javascript
var map = L.map('map').fitWorld();

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);
```

--------------------------------
