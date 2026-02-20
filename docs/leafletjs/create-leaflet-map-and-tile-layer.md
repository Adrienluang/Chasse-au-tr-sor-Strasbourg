### Create Leaflet Map and Tile Layer

Source: https://leafletjs.com/examples/overlays

This snippet shows how to initialize a Leaflet map and add a standard OpenStreetMap tile layer as the background. It requires the Leaflet library. The output is a functional map displayed on a webpage.

```javascript
var map = L.map('map').setView([37.8, -96], 4);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
```

--------------------------------
